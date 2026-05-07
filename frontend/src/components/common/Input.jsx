/**
 * Input Component — Dhoond Partner
 * Reusable text input with label and error display
 * Themed with Dhoond blue (#2E6BE6) branding
 * Styled with Tailwind CSS (twrnc)
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import tw from '../../../tw';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  style,
  ...props
}) => {
  return (
    <View style={[tw`mb-4`, style]}>
      {label ? (
        <Text style={tw`text-sm font-medium text-txt-primary mb-1.5`}>
          {label}
        </Text>
      ) : null}
      <TextInput
        style={[
          tw`bg-surface border-[1.5px] border-border-main rounded-lg px-4 py-3.5 text-sm text-txt-primary`,
          error && tw`border-status-error bg-status-error-soft`,
          !editable && tw`bg-surface-alt text-txt-light`,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        {...props}
      />
      {error ? (
        <Text style={tw`text-xs text-status-error mt-1`}>{error}</Text>
      ) : null}
    </View>
  );
};

export default Input;
