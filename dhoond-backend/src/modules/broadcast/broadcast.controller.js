const broadcastService = require('./broadcast.service');
const partnerService = require('../partner/partner.service');

/**
 * Broadcast Controller
 * Handles broadcast notifications and listing for partners
 */
class BroadcastController {
  /**
   * Get active broadcasts (new orders) for the logged-in partner
   * GET /api/broadcast/active
   */
  async getMyBroadcasts(req, res) {
    try {
      const { uid } = req.user;

      // 1. Get partner internal ID
      const partner = await partnerService.getPartnerByFirebaseUid(uid);
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }

      // 2. Get active broadcasts
      const broadcasts = await broadcastService.getActiveBroadcastsForPartner(partner.id);

      res.status(200).json({
        success: true,
        count: broadcasts.length,
        data: broadcasts
      });
    } catch (error) {
      console.error('Get My Broadcasts Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Reject/Skip a broadcast
   * POST /api/broadcast/reject/:broadcastId
   */
  async rejectBroadcast(req, res) {
    try {
      const { uid } = req.user;
      const { broadcastId } = req.params;

      const partner = await partnerService.getPartnerByFirebaseUid(uid);
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }

      await broadcastService.rejectBroadcast(broadcastId, partner.id);

      res.status(200).json({
        success: true,
        message: 'Broadcast rejected'
      });
    } catch (error) {
      console.error('Reject Broadcast Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new BroadcastController();
