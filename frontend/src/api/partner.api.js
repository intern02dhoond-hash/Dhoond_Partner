/**
 * Partner API
 * Handles partner profile and status API calls
 */

import api from './axios';

/**
 * Register a new partner
 * @param {Object} data - { full_name, service_type, phone, email }
 * @returns {Promise} Partner data
 */
export const registerPartner = async (data) => {
  return api.post('/partner/register', data);
};

/**
 * Get partner profile
 * @returns {Promise} Partner profile
 */
export const getPartnerProfile = async () => {
  return api.get('/partner/profile');
};

/**
 * Update partner profile
 * @param {Object} data - Fields to update
 * @returns {Promise} Updated profile
 */
export const updateProfile = async (data) => {
  return api.put('/partner/profile', data);
};

/**
 * Toggle duty status (online/offline)
 * @param {string} status - 'online' or 'offline'
 * @returns {Promise} Updated status
 */
export const toggleDutyStatus = async (status) => {
  return api.patch('/partner/duty', { status });
};

/**
 * Update partner's current location
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise} Updated location
 */
export const updateLocation = async (latitude, longitude) => {
  return api.patch('/partner/location', { latitude, longitude });
};

export default {
  registerPartner,
  getPartnerProfile,
  updateProfile,
  toggleDutyStatus,
  updateLocation,
};
