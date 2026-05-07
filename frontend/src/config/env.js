/**
 * Environment Configuration
 * Central place for all environment-related settings
 */

const ENV = {
  // Use localhost for web browser development, LAN IP for mobile device testing
  API_BASE_URL: 'http://10.91.245.130:5000/api/v1',

  // App info
  APP_NAME: 'Dhoond Partner',
  APP_VERSION: '1.0.0',

  // Feature flags
  ENABLE_NOTIFICATIONS: true,
  ENABLE_LOCATION_TRACKING: true,
};

export default ENV;
