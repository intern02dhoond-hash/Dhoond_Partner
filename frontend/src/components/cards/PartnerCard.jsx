/**
 * PartnerCard Component
 * Displays partner profile summary (e.g., on home screen)
 * Styled with Tailwind CSS (twrnc)
 */

import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../../tw';

const PartnerCard = ({ partner }) => {
  const isOnline = partner?.duty_status === 'online';

  return (
    <View style={tw`flex-row items-center bg-surface rounded-[14px] p-4 shadow-md`}>
      {/* Avatar Placeholder */}
      <View style={tw`w-12 h-12 rounded-full bg-dhoond-light justify-center items-center mr-2`}>
        <Text style={tw`text-xl font-bold text-white`}>
          {partner?.full_name?.charAt(0)?.toUpperCase() || 'P'}
        </Text>
      </View>

      {/* Partner Info */}
      <View style={tw`flex-1`}>
        <Text style={tw`text-lg font-semibold text-txt-primary`}>
          {partner?.full_name || 'Partner'}
        </Text>
        <Text style={tw`text-sm text-txt-secondary mt-0.5`}>
          {partner?.service_type || 'General'}
        </Text>
      </View>

      {/* Status Indicator */}
      <View style={tw`w-3 h-3 rounded-full ${isOnline ? 'bg-status-success' : 'bg-txt-light'}`} />
    </View>
  );
};

export default PartnerCard;
