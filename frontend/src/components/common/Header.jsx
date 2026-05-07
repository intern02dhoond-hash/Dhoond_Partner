/**
 * Header Component
 * Reusable screen header with optional back button
 * Styled with Tailwind CSS (twrnc)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from '../../../tw';

const Header = ({ title, onBackPress, rightComponent }) => {
  return (
    <View style={tw`flex-row items-center justify-between px-4 py-2 pt-12 bg-surface border-b border-border-main`}>
      {/* Left - Back Button */}
      <View style={tw`w-[50px] items-start`}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={tw`p-1`}>
            <Text style={tw`text-2xl text-txt-primary`}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center - Title */}
      <Text style={tw`flex-1 text-center text-xl font-bold text-txt-primary`} numberOfLines={1}>
        {title}
      </Text>

      {/* Right - Optional Component */}
      <View style={tw`w-[50px] items-end`}>
        {rightComponent || null}
      </View>
    </View>
  );
};

export default Header;
