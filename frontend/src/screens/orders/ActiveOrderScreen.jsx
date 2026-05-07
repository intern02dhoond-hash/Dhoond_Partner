/**
 * Active Order Screen — Dhoond Partner
 * Shows the currently active/accepted order list
 * Themed with Dhoond blue (#2E6BE6) branding
 * Styled with Tailwind CSS (twrnc)
 */

import React, { useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import OrderCard from '../../components/cards/OrderCard';
import Loader from '../../components/common/Loader';
import useOrders from '../../hooks/useOrders';
import tw from '../../../tw';

const ActiveOrderScreen = ({ navigation }) => {
  const { orders, isLoading, error, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders('accepted');
  }, [fetchOrders]);

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetails', { publicId: order.public_id });
  };

  if (isLoading) return <Loader message="Fetching your orders..." />;

  return (
    <SafeAreaView style={tw`flex-1 bg-bg-main`}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />

      {/* Blue Header */}
      <View style={tw`bg-dhoond pt-12 pb-5 items-center rounded-b-[28px]`}>
        <Text style={tw`text-2xl font-bold text-white`}>My Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.public_id || item.id?.toString()}
        renderItem={({ item }) => <OrderCard order={item} onPress={handleOrderPress} />}
        contentContainerStyle={tw`p-5 grow`}
        ListEmptyComponent={
          <View style={tw`flex-1 justify-center items-center pt-25`}>
            <View style={tw`w-[60px] h-[60px] rounded-[30px] bg-dhoond-soft justify-center items-center mb-3.5`}>
              <ClipboardList color="#2E6BE6" size={28} />
            </View>
            <Text style={tw`text-lg text-txt-secondary font-medium`}>No active orders</Text>
            <Text style={tw`text-sm text-txt-light mt-1`}>Accepted orders will appear here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ActiveOrderScreen;
