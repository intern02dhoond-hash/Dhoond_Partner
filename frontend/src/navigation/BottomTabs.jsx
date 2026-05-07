/**
 * Bottom Tabs Navigator — Dhoond Partner
 * Main tab bar for authenticated users
 * Themed with Dhoond blue (#2E6BE6) branding
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ActiveOrderScreen from '../screens/orders/ActiveOrderScreen';
import EarningsScreen from '../screens/earnings/EarningsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import COLORS from '../styles/colors';

import { Home, ClipboardList, Wallet, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.borderLight,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          elevation: 8,
          shadowColor: '#1A4FBF',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Orders" 
        component={ActiveOrderScreen} 
        options={{ 
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen} 
        options={{ 
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
