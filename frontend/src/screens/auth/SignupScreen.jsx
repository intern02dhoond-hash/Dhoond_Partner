/**
 * Signup Screen — Dhoond Partner
 * Fixed UI + Service Type Dropdown
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ChevronDown, Check, X } from 'lucide-react-native';
import tw from '../../../tw';

const SERVICE_TYPES = [
  'Painter',
  'AC Technician',
  'RO Technician',
  'Electrician',
  'Washing Machine Technician',
  'Refrigerator Technician',
];

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName]       = useState('');
  const [phone, setPhone]             = useState('');
  const [serviceType, setServiceType] = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('OTP', { phone, fullName, serviceType });
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEF2FB' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />

      {/* ── Blue Header ── */}
      <View style={{
        backgroundColor: '#2E6BE6',
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
      }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 }}>
          Dhoond
        </Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 4, marginTop: 4, textTransform: 'uppercase' }}>
          Partner App
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1E293B', textAlign: 'center', marginBottom: 6 }}>
          Create Account
        </Text>
        <Text style={{ fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 32 }}>
          Join Dhoond as a service partner
        </Text>

        {/* Full Name */}
        <Text style={labelStyle}>Full Name</Text>
        <Input
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />

        {/* Phone Number */}
        <Text style={labelStyle}>Phone Number</Text>
        <Input
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter 10-digit number"
          keyboardType="phone-pad"
          maxLength={10}
        />

        {/* ── Service Type Dropdown ── */}
        <Text style={labelStyle}>Service Type</Text>
        <TouchableOpacity
          onPress={() => setDropdownOpen(true)}
          activeOpacity={0.8}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 16,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1.5,
            borderColor: serviceType ? 'rgba(46,107,230,0.4)' : 'rgba(46,107,230,0.12)',
          }}
        >
          <Text style={{
            fontSize: 15,
            color: serviceType ? '#1E293B' : '#94A3B8',
            fontWeight: serviceType ? '500' : '400',
            flex: 1,
          }}>
            {serviceType || 'Select your service type'}
          </Text>
          <ChevronDown
            color={serviceType ? '#2E6BE6' : '#94A3B8'}
            size={20}
            style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {/* ── Register Button (fixed) ── */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={isLoading}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#2E6BE6',
            borderRadius: 14,
            paddingVertical: 17,
            alignItems: 'center',
            marginBottom: 24,
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#FFFFFF',
            letterSpacing: 0.3,
          }}>
            {isLoading ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>

        {/* Login link */}
        <Text style={{ textAlign: 'center', fontSize: 14, color: '#64748B' }}>
          Already registered?{' '}
          <Text
            style={{ color: '#2E6BE6', fontWeight: '600' }}
            onPress={() => navigation.navigate('Login')}
          >
            Login here
          </Text>
        </Text>
      </ScrollView>

      {/* ── Service Type Modal Dropdown ── */}
      <Modal visible={dropdownOpen} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 16,
            paddingBottom: 36,
          }}>
            {/* Handle bar */}
            <View style={{
              width: 40, height: 4, borderRadius: 2,
              backgroundColor: '#E2E8F0',
              alignSelf: 'center',
              marginBottom: 16,
            }} />

            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#1E293B' }}>
                Select Service Type
              </Text>
              <TouchableOpacity onPress={() => setDropdownOpen(false)} style={{ padding: 4 }}>
                <X color="#94A3B8" size={22} />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <FlatList
              data={SERVICE_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = serviceType === item;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setServiceType(item);
                      setDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      backgroundColor: isSelected ? '#EEF3FD' : 'transparent',
                      marginHorizontal: 12,
                      borderRadius: 12,
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{
                      fontSize: 15,
                      color: isSelected ? '#2E6BE6' : '#1E293B',
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      {item}
                    </Text>
                    {isSelected && <Check color="#2E6BE6" size={18} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const labelStyle = {
  fontSize: 14,
  fontWeight: '600',
  color: '#1E293B',
  marginBottom: 8,
};

export default SignupScreen;