/**
 * Order Details Screen — Dhoond Partner
 * Shows full details of a specific order
 * Themed with Dhoond blue (#2E6BE6) branding
 * Styled with Tailwind CSS (twrnc)
 */

import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import tw from '../../../tw';
import { capitalize, formatDate, formatTime } from '../../utils/helpers';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { publicId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch order details from API
    // const data = await getOrderDetails(publicId);
    // setOrder(data);

    // Placeholder data
    setTimeout(() => {
      setOrder({
        public_id: publicId || 'abc12345-demo',
        status: 'accepted',
        service_type: 'Plumbing',
        customer_name: 'Customer',
        customer_address: '123, Example Street, City',
        created_at: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 1000);
  }, [publicId]);

  if (isLoading) {
    return <Loader message="Loading order details..." />;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-bg-main`}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />

      {/* Blue Header with Back Button */}
      <View style={tw`bg-dhoond pt-12 pb-5 px-4 flex-row items-center justify-between rounded-b-[28px]`}>
        <TouchableOpacity style={tw`w-10 h-10 rounded-[20px] bg-white/15 justify-center items-center`} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#FFFFFF" size={22} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-white`}>Order Details</Text>
        <View style={tw`w-10`} />
      </View>

      <ScrollView contentContainerStyle={tw`p-5`}>
        {/* Order ID */}
        <View style={tw`bg-surface rounded-[14px] p-4 mb-2 shadow-sm`}>
          <Text style={tw`text-sm text-txt-light mb-1`}>Order ID</Text>
          <Text style={tw`text-lg font-semibold text-txt-primary`}>#{order?.public_id?.slice(0, 8)}</Text>
        </View>

        {/* Status */}
        <View style={tw`bg-surface rounded-[14px] p-4 mb-2 shadow-sm`}>
          <Text style={tw`text-sm text-txt-light mb-1`}>Status</Text>
          <View style={tw`self-start bg-dhoond-soft px-3 py-1 rounded-full mt-0.5`}>
            <Text style={tw`text-dhoond text-base font-semibold`}>
              {capitalize(order?.status?.replace('_', ' '))}
            </Text>
          </View>
        </View>

        {/* Service Type */}
        <View style={tw`bg-surface rounded-[14px] p-4 mb-2 shadow-sm`}>
          <Text style={tw`text-sm text-txt-light mb-1`}>Service</Text>
          <Text style={tw`text-lg font-semibold text-txt-primary`}>{order?.service_type}</Text>
        </View>

        {/* Customer Address */}
        <View style={tw`bg-surface rounded-[14px] p-4 mb-2 shadow-sm`}>
          <Text style={tw`text-sm text-txt-light mb-1`}>Address</Text>
          <Text style={tw`text-lg font-semibold text-txt-primary`}>{order?.customer_address}</Text>
        </View>

        {/* Date */}
        <View style={tw`bg-surface rounded-[14px] p-4 mb-2 shadow-sm`}>
          <Text style={tw`text-sm text-txt-light mb-1`}>Created</Text>
          <Text style={tw`text-lg font-semibold text-txt-primary`}>
            {formatDate(order?.created_at)} at {formatTime(order?.created_at)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={tw`mt-6`}>
          <Button title="Start Work" onPress={() => console.log('Start work')} />
          <View style={tw`h-2`} />
          <Button
            title="Cancel Order"
            variant="outline"
            onPress={() => console.log('Cancel order')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;
