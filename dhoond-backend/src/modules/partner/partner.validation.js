/**
 * Partner Validation
 * Simple manual validation for partner-related requests
 */
class PartnerValidation {
  /**
   * Validate registration data
   */
  validateRegistration(req, res, next) {
    const { full_name, service_type } = req.body;
    
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Valid full name is required' });
    }
    
    if (!service_type) {
      return res.status(400).json({ success: false, message: 'Service type is required' });
    }
    
    next();
  }

  /**
   * Validate location data
   */
  validateLocation(req, res, next) {
    const { latitude, longitude } = req.body;
    
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude must be numbers' });
    }
    
    next();
  }
}

module.exports = new PartnerValidation();
