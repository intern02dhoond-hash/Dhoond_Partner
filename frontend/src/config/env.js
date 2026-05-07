/**
 * Environment Configuration
 * Central place for all environment-related settings
 */

const ENV = {
  // Replace with your local machine's IP address for development
  API_BASE_URL: 'http://192.168.0.201:5000/api/v1',

  // App info
  APP_NAME: 'Dhoond Partner',
  APP_VERSION: '1.0.0',

  // Feature flags
  ENABLE_NOTIFICATIONS: true,
  ENABLE_LOCATION_TRACKING: true,
};

export default ENV;
