const otpService = require('./otp.service');
const orderService = require('../order/order.service');

/**
 * OTP Controller
 * Handles OTP verification for order milestones
 */
class OtpController {
  /**
   * Verify Arrival OTP
   * Partner enters the code given by the customer when they arrive
   * POST /api/otp/verify-arrival/:publicId
   */
  async verifyArrival(req, res) {
    try {
      const { publicId } = req.params;
      const { otp } = req.body;

      // 1. Get order
      const order = await orderService.getOrderByPublicId(publicId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // 2. Verify OTP
      const isValid = await otpService.verifyOtp(order.id, 'arrival', otp);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      // 3. Update order status to 'partner_arrived'
      await orderService.updateOrderStatus(order.id, 'partner_arrived');

      res.status(200).json({
        success: true,
        message: 'Arrival verified. You can now start the work.'
      });
    } catch (error) {
      console.error('Verify Arrival Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Verify Completion OTP
   * Partner enters the code given by the customer when the work is finished
   * POST /api/otp/verify-completion/:publicId
   */
  async verifyCompletion(req, res) {
    try {
      const { publicId } = req.params;
      const { otp } = req.body;

      // 1. Get order
      const order = await orderService.getOrderByPublicId(publicId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // 2. Verify OTP
      const isValid = await otpService.verifyOtp(order.id, 'completion', otp);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      // 3. Update order status to 'completed'
      await orderService.updateOrderStatus(order.id, 'completed');

      res.status(200).json({
        success: true,
        message: 'Completion verified. Job marked as completed.'
      });
    } catch (error) {
      console.error('Verify Completion Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new OtpController();
