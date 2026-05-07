const pool = require('../../config/db');

/**
 * Broadcast Service
 * Manages order broadcasts to nearby partners
 */
class BroadcastService {
  /**
   * Get active broadcasts for a specific partner
   * Returns orders that were broadcasted to this partner but not yet accepted by anyone
   * @param {number} partnerId - Internal partner ID
   * @returns {Promise<Array>} - List of active broadcasts
   */
  async getActiveBroadcastsForPartner(partnerId) {
    const query = `
      SELECT b.*, o.public_id as order_public_id, o.service_type, o.service_address, o.estimated_amount, o.description
      FROM broadcasts b
      JOIN broadcast_receivers br ON b.id = br.broadcast_id
      JOIN orders o ON b.order_id = o.id
      WHERE br.partner_id = $1
      AND b.status = 'active'
      AND br.status = 'sent'
      AND b.expires_at > CURRENT_TIMESTAMP
      AND o.status = 'broadcasted'
    `;
    
    const { rows } = await pool.query(query, [partnerId]);
    return rows;
  }

  /**
   * Mark a broadcast receiver entry as rejected (partner ignored/rejected it)
   * @param {number} broadcastId - Internal broadcast ID
   * @param {number} partnerId - Internal partner ID
   */
  async rejectBroadcast(broadcastId, partnerId) {
    const query = `
      UPDATE broadcast_receivers 
      SET status = 'rejected', responded_at = CURRENT_TIMESTAMP
      WHERE broadcast_id = $1 AND partner_id = $2;
    `;
    await pool.query(query, [broadcastId, partnerId]);
  }
}

module.exports = new BroadcastService();
