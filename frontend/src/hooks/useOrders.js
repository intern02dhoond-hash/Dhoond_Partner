/**
 * useOrders Hook
 * Manages fetching and state of partner orders
 */

import { useState, useCallback } from 'react';
import { getMyOrders, getOrderDetails } from '../api/order.api';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all orders for the current partner
   * @param {string} status - Optional status filter
   */
  const fetchOrders = useCallback(async (status = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyOrders(status);
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch details for a single order
   * @param {string} publicId - Order public UUID
   */
  const fetchOrderDetails = useCallback(async (publicId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOrderDetails(publicId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    fetchOrderDetails,
  };
};

export default useOrders;
