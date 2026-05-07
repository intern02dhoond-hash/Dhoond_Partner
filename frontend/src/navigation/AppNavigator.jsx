/**
 * App Navigator
 * Root navigator that switches between Auth and Main flows
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import AuthNavigator from './AuthNavigator';
import BottomTabs from './BottomTabs';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loader while checking stored auth
  if (isLoading) {
    return <Loader message="Starting Dhoond Partner..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
