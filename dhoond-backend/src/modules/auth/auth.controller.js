const authService = require('./auth.service');

/**
 * Sync Partner Profile
 */
const syncPartner = async (req, res) => {
  const { uid, email, phone_number, name, picture } = req.user;
  const { service_type, full_name } = req.body; 

  try {
    // 1. Check if partner exists using service
    let partner = await authService.findPartnerByUid(uid);

    if (partner) {
      return res.status(200).json({
        success: true,
        message: 'Partner profile retrieved',
        data: partner
      });
    }

    // 2. If not exists, create new partner using service
    partner = await authService.createPartner({
      uid, 
      name: full_name || name || 'New Partner', 
      phone: phone_number || 'N/A', 
      email, 
      photo: picture, 
      serviceType: service_type || 'General'
    });

    res.status(201).json({
      success: true,
      message: 'Partner profile created',
      data: partner
    });

  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during sync'
    });
  }
};

/**
 * Get Current Partner Profile
 */
const getProfile = async (req, res) => {
  try {
    const partner = await authService.findPartnerByUid(req.user.uid);
    
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
    console.error('Get Profile Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  syncPartner,
  getProfile
};
