/**
 * Broadcast API
 * Handles broadcast-related API calls
 */

import api from './axios';

/**
 * Get active broadcasts for the current partner
 * @returns {Promise} List of active broadcasts
 */
export const getActiveBroadcasts = async () => {
  return api.get('/broadcast/active');
};

/**
 * Reject/skip a broadcast
 * @param {string} broadcastId - Broadcast ID
 * @returns {Promise} Rejection confirmation
 */
export const rejectBroadcast = async (broadcastId) => {
  return api.post(`/broadcast/reject/${broadcastId}`);
};

export default {
  getActiveBroadcasts,
  rejectBroadcast,
};
