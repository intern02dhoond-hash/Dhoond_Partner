const orderService = require('./order.service');
const partnerService = require('../partner/partner.service');

/**
 * Order Controller
 * Handles order-related requests from the partner app
 */
class OrderController {
  /**
   * Get orders assigned to the current partner
   * GET /api/order/my-orders
   */
  async getMyOrders(req, res) {
    try {
      const { uid } = req.user;
      
      // 1. Get partner internal ID
      const partner = await partnerService.getPartnerByFirebaseUid(uid);
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }

      // 2. Get orders
      const status = req.query.status; // Optional filter
      const orders = await orderService.getPartnerOrders(partner.id, status);

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      console.error('Get My Orders Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Accept an available broadcasted order
   * POST /api/order/accept/:publicId
   */
  async acceptOrder(req, res) {
    try {
      const { uid } = req.user;
      const { publicId } = req.params;

      // 1. Get partner
      const partner = await partnerService.getPartnerByFirebaseUid(uid);
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }

      // 2. Find order internal ID from public ID
      const order = await orderService.getOrderByPublicId(publicId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // 3. Accept order
      const acceptedOrder = await orderService.acceptOrder(order.id, partner.id);

      res.status(200).json({
        success: true,
        message: 'Order accepted successfully',
        data: acceptedOrder
      });
    } catch (error) {
      console.error('Accept Order Error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || 'Failed to accept order' 
      });
    }
  }

  /**
   * Update order status
   * PATCH /api/order/status/:publicId
   */
  async updateStatus(req, res) {
    try {
      const { publicId } = req.params;
      const { status } = req.body;

      const allowedStatuses = ['partner_arrived', 'in_progress', 'completed', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status update' });
      }

      // Find order
      const order = await orderService.getOrderByPublicId(publicId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Update status
      const updatedOrder = await orderService.updateOrderStatus(order.id, status);

      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: updatedOrder
      });
    } catch (error) {
      console.error('Update Status Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Get specific order details
   * GET /api/order/details/:publicId
   */
  async getOrderDetails(req, res) {
    try {
      const { publicId } = req.params;
      const order = await orderService.getOrderByPublicId(publicId);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Get Order Details Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new OrderController();
