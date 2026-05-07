/**
 * App Constants
 * Static values used throughout the application
 */

// Order status values (must match backend)
export const ORDER_STATUS = {
  BROADCASTED: 'broadcasted',
  ACCEPTED: 'accepted',
  PARTNER_ARRIVED: 'partner_arrived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Partner duty status
export const DUTY_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};

// OTP types
export const OTP_TYPES = {
  ARRIVAL: 'arrival',
  COMPLETION: 'completion',
};

// AsyncStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@dhoond_auth_token',
  USER_DATA: '@dhoond_user_data',
  FCM_TOKEN: '@dhoond_fcm_token',
};

// API timeout (in ms)
export const API_TIMEOUT = 15000;
