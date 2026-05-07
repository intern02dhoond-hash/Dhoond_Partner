import React from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView, Dimensions } from 'react-native';
import { TrendingUp, CalendarDays, CheckCircle, Wallet, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const EarningsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* ── Blue Header ── */}
        <View style={{
          backgroundColor: '#2E6BE6',
          paddingTop: 48,
          paddingHorizontal: 20,
          paddingBottom: 40,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#1A3FA8',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.22,
          shadowRadius: 18,
        }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 24, letterSpacing: 0.2 }}>
            Earnings
          </Text>

          {/* Total Earnings Card */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 24,
            padding: 24,
            width: '100%',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Wallet color="#FFFFFF" size={24} />
            </View>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 }}>
              TOTAL EARNINGS
            </Text>
            <Text style={{ fontSize: 44, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1, marginBottom: 4 }}>
              ₹0.00
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
              <CalendarDays color="#FFFFFF" size={12} opacity={0.8} />
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>This month</Text>
            </View>
          </View>
        </View>

        {/* ── Content ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 }}>
          
          {/* Stats Row */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            {/* Completed */}
            <View style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(46,107,230,0.08)',
              elevation: 2,
              shadowColor: '#2E6BE6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF3FD', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <CheckCircle color="#2E6BE6" size={20} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 2 }}>0</Text>
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }}>Completed</Text>
            </View>

            {/* Today */}
            <View style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(46,107,230,0.08)',
              elevation: 2,
              shadowColor: '#2E6BE6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <TrendingUp color="#10B981" size={20} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 2 }}>₹0</Text>
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }}>Today</Text>
            </View>

            {/* This Week */}
            <View style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(46,107,230,0.08)',
              elevation: 2,
              shadowColor: '#2E6BE6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <CalendarDays color="#F59E0B" size={20} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 2 }}>₹0</Text>
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }}>This Week</Text>
            </View>
          </View>

          {/* Detailed History Banner */}
          <View style={{
            backgroundColor: '#EEF3FD',
            borderRadius: 16,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: 'rgba(46,107,230,0.15)',
          }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#2E6BE6', marginBottom: 4 }}>
                Detailed History
              </Text>
              <Text style={{ fontSize: 13, color: '#64748B' }}>
                Full earnings breakdown feature is coming soon!
              </Text>
            </View>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
              <ArrowRight color="#2E6BE6" size={18} />
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EarningsScreen;
