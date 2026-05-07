/**
 * Order API
 * Handles order-related API calls
 */

import api from './axios';

/**
 * Get all orders for the current partner
 * @param {string} status - Optional status filter
 * @returns {Promise} List of orders
 */
export const getMyOrders = async (status = null) => {
  const params = status ? { status } : {};
  return api.get('/order/my-orders', { params });
};

/**
 * Accept a broadcasted order
 * @param {string} publicId - Order public UUID
 * @returns {Promise} Accepted order data
 */
export const acceptOrder = async (publicId) => {
  return api.post(`/order/accept/${publicId}`);
};

/**
 * Update order status
 * @param {string} publicId - Order public UUID
 * @param {string} status - New status value
 * @returns {Promise} Updated order
 */
export const updateOrderStatus = async (publicId, status) => {
  return api.patch(`/order/status/${publicId}`, { status });
};

/**
 * Get specific order details
 * @param {string} publicId - Order public UUID
 * @returns {Promise} Order details
 */
export const getOrderDetails = async (publicId) => {
  return api.get(`/order/details/${publicId}`);
};

export default {
  getMyOrders,
  acceptOrder,
  updateOrderStatus,
  getOrderDetails,
};
