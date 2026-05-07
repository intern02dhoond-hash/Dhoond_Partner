/**
 * Auth API
 * Handles authentication-related API calls
 */

import api from './axios';

/**
 * Sync Firebase user with backend database
 * @param {Object} data - { service_type }
 * @returns {Promise} Partner data
 */
export const syncPartner = async (data) => {
  return api.post('/auth/sync', data);
};

/**
 * Get current partner profile from auth context
 * @returns {Promise} Partner profile
 */
export const getProfile = async () => {
  return api.get('/auth/profile');
};

export default {
  syncPartner,
  getProfile,
};
