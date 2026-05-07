/**
 * Loader Component — Dhoond Partner
 * Full-screen loading indicator
 * Themed with Dhoond blue (#2E6BE6) branding
 * Styled with Tailwind CSS (twrnc)
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import tw from '../../../tw';

const Loader = ({ message = 'Loading...', size = 'large' }) => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-bg-main`}>
      <View style={tw`w-[72px] h-[72px] rounded-full bg-dhoond-soft justify-center items-center`}>
        <ActivityIndicator size={size} color="#2E6BE6" />
      </View>
      {message ? (
        <Text style={tw`mt-4 text-sm text-txt-secondary font-medium`}>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

export default Loader;
