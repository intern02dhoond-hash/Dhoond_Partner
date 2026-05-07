/**
 * Button Component — Dhoond Partner
 * Reusable button with primary/secondary/outline variants
 * Themed with Dhoond blue (#2E6BE6) branding
 * Styled with Tailwind CSS (twrnc)
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import tw from '../../../tw';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  isLoading = false,
  disabled = false,
  style,
}) => {
  // Base styles for all buttons
  const baseStyle = tw`py-4 px-6 rounded-xl items-center justify-center min-h-[52px]`;

  // Variant-specific styles
  const variantStyles = {
    primary: tw`bg-dhoond shadow-md`,
    secondary: tw`bg-status-error`,
    outline: tw`bg-transparent border-[1.5px] border-dhoond`,
  };

  // Disabled override
  const disabledStyle = disabled ? tw`bg-disabled shadow-none` : {};

  // Text styles
  const textBase = tw`text-base font-semibold tracking-wide`;
  const textColor =
    variant === 'outline'
      ? tw`text-dhoond`
      : tw`text-white`;

  return (
    <TouchableOpacity
      style={[baseStyle, variantStyles[variant], disabledStyle, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#2E6BE6' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text style={[textBase, textColor]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
