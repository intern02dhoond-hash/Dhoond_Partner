const pool = require('../../config/db');

/**
 * Order Service
 * Handles order lifecycle and partner assignments
 */
class OrderService {
  /**
   * Get all orders assigned to a specific partner
   * @param {number} partnerId - Internal partner ID
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} - List of orders
   */
  async getPartnerOrders(partnerId, status = null) {
    let query = 'SELECT * FROM orders WHERE partner_id = $1';
    const values = [partnerId];

    if (status) {
      query += ' AND status = $2';
      values.push(status);
    }

    query += ' ORDER BY created_at DESC';
    
    const { rows } = await pool.query(query, values);
    return rows;
  }

  /**
   * Get order details by Public ID
   * @param {string} publicId - UUID of the order
   * @returns {Promise<Object>} - Order details
   */
  async getOrderByPublicId(publicId) {
    const query = `
      SELECT o.*, p.full_name as partner_name, p.phone as partner_phone
      FROM orders o
      LEFT JOIN partners p ON o.partner_id = p.id
      WHERE o.public_id = $1
    `;
    const { rows } = await pool.query(query, [publicId]);
    return rows[0];
  }

  /**
   * Partner accepts a broadcasted order
   * @param {number} orderId - Internal order ID
   * @param {number} partnerId - Internal partner ID
   * @returns {Promise<Object>} - Updated order
   */
  async acceptOrder(orderId, partnerId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Check if order is still available (status 'broadcasted')
      const orderCheck = await client.query(
        'SELECT status FROM orders WHERE id = $1 FOR UPDATE',
        [orderId]
      );

      if (!orderCheck.rows[0]) {
        throw new Error('Order not found');
      }

      if (orderCheck.rows[0].status !== 'broadcasted') {
        throw new Error('Order is no longer available');
      }

      // 2. Update order with partner_id and change status to 'accepted'
      const updateOrderQuery = `
        UPDATE orders 
        SET partner_id = $1, 
            status = 'accepted', 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *;
      `;
      const { rows } = await client.query(updateOrderQuery, [partnerId, orderId]);
      const order = rows[0];

      // 3. Update broadcast status to 'fulfilled'
      await client.query(
        "UPDATE broadcasts SET status = 'fulfilled' WHERE order_id = $1 AND status = 'active'",
        [orderId]
      );

      // 4. Update this partner's status in broadcast_receivers to 'accepted'
      await client.query(
        "UPDATE broadcast_receivers SET status = 'accepted', responded_at = CURRENT_TIMESTAMP WHERE broadcast_id IN (SELECT id FROM broadcasts WHERE order_id = $1) AND partner_id = $2",
        [orderId, partnerId]
      );

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update order status (e.g., partner_arrived, in_progress, completed)
   * @param {number} orderId - Internal order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - Updated order
   */
  async updateOrderStatus(orderId, status) {
    const query = `
      UPDATE orders 
      SET status = $1, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, orderId]);
    return rows[0];
  }
}

module.exports = new OrderService();
