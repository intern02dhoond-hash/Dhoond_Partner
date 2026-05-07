/**
 * OrderCard Component — Dhoond Partner
 * Displays a summary of an order in a card layout
 * Themed with Dhoond blue (#2E6BE6) branding
 * Styled with Tailwind CSS (twrnc)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from '../../../tw';
import { capitalize, formatDate } from '../../utils/helpers';

const OrderCard = ({ order, onPress }) => {
  /**
   * Get color class based on order status
   */
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'accepted': return 'text-dhoond';
      case 'in_progress': return 'text-status-warning';
      case 'completed': return 'text-status-success';
      case 'cancelled': return 'text-status-error';
      default: return 'text-txt-light';
    }
  };

  /**
   * Get soft background class based on order status
   */
  const getStatusBgClass = (status) => {
    switch (status) {
      case 'accepted': return 'bg-dhoond-soft';
      case 'in_progress': return 'bg-status-warning-soft';
      case 'completed': return 'bg-status-success-soft';
      case 'cancelled': return 'bg-status-error-soft';
      default: return 'bg-surface-alt';
    }
  };

  return (
    <TouchableOpacity 
      style={tw`bg-surface rounded-[14px] p-4 mb-2 border-l-4 border-dhoond shadow-md`} 
      onPress={() => onPress && onPress(order)} 
      activeOpacity={0.7}
    >
      {/* Order ID & Status */}
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-lg font-bold text-txt-primary`}>
          #{order.public_id?.slice(0, 8) || 'N/A'}
        </Text>
        <View style={tw`px-2.5 py-1 rounded-full ${getStatusBgClass(order.status)}`}>
          <Text style={tw`text-sm font-semibold ${getStatusColorClass(order.status)}`}>
            {capitalize(order.status?.replace('_', ' ') || 'Unknown')}
          </Text>
        </View>
      </View>

      {/* Service Type */}
      <Text style={tw`text-base text-txt-secondary mb-1`}>
        {order.service_type || 'General Service'}
      </Text>

      {/* Date */}
      <Text style={tw`text-sm text-txt-light`}>
        {formatDate(order.created_at)}
      </Text>
    </TouchableOpacity>
  );
};

export default OrderCard;
