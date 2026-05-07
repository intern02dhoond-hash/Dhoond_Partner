const partnerService = require('./partner.service');

/**
 * Partner Controller
 * Handles incoming HTTP requests for partner-related operations
 */
class PartnerController {
  /**
   * Register a new partner or update profile if already exists
   * POST /api/partner/register
   */
  async registerPartner(req, res) {
    try {
      const { uid, phone_number, email, name } = req.user; // From verifyFirebaseToken middleware
      const { full_name, service_type } = req.body;

      // Check if partner already exists
      let partner = await partnerService.getPartnerByFirebaseUid(uid);

      if (partner) {
        // If exists, maybe update some info or just return it
        return res.status(200).json({
          success: true,
          message: 'Partner already registered',
          data: partner
        });
      }

      // Create new partner
      partner = await partnerService.createPartner({
        firebase_uid: uid,
        full_name: full_name || name || 'New Partner',
        phone: phone_number || req.body.phone,
        email: email || req.body.email,
        service_type: service_type
      });

      res.status(201).json({
        success: true,
        message: 'Partner registered successfully',
        data: partner
      });
    } catch (error) {
      console.error('Register Partner Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get current partner profile
   * GET /api/partner/profile
   */
  async getProfile(req, res) {
    try {
      const { uid } = req.user;
      const partner = await partnerService.getPartnerByFirebaseUid(uid);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partner profile not found'
        });
      }

      res.status(200).json({
        success: true,
        data: partner
      });
    } catch (error) {
      console.error('Get Profile Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update partner profile
   * PUT /api/partner/profile
   */
  async updateProfile(req, res) {
    try {
      const { uid } = req.user;
      const updatedPartner = await partnerService.updatePartner(uid, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedPartner
      });
    } catch (error) {
      console.error('Update Profile Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Toggle duty status (Online/Offline)
   * PATCH /api/partner/duty
   */
  async toggleDuty(req, res) {
    try {
      const { uid } = req.user;
      const { status } = req.body; // 'online' or 'offline'

      if (!['online', 'offline'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be online or offline.'
        });
      }

      const updatedPartner = await partnerService.updateDutyStatus(uid, status);

      res.status(200).json({
        success: true,
        message: `Status updated to ${status}`,
        data: {
          duty_status: updatedPartner.duty_status
        }
      });
    } catch (error) {
      console.error('Toggle Duty Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update current location
   * PATCH /api/partner/location
   */
  async updateLocation(req, res) {
    try {
      const { uid } = req.user;
      const { latitude, longitude } = req.body;

      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required'
        });
      }

      const updatedPartner = await partnerService.updateLocation(uid, latitude, longitude);

      res.status(200).json({
        success: true,
        message: 'Location updated',
        data: {
          latitude: updatedPartner.latitude,
          longitude: updatedPartner.longitude
        }
      });
    } catch (error) {
      console.error('Update Location Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new PartnerController();
