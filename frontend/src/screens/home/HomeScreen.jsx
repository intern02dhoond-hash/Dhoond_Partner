/**
 * Home Screen — Dhoond Partner
 * Main dashboard showing partner status, earnings card, and stats
 * Themed with #2E6BE6 blue identity
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Bell,
  User,
  Briefcase,
  Star,
  TrendingUp,
  ClipboardList,
  Package,
} from 'lucide-react-native';
import useAuth from '../../hooks/useAuth';

const HomeScreen = ({ navigation }) => {
  const { user, token, login } = useAuth();
  const isDutyOn = user?.duty_status === 'online';
  const toggleAnim = useRef(new Animated.Value(isDutyOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(toggleAnim, {
      toValue: isDutyOn ? 1 : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [isDutyOn]);

  const toggleDuty = async () => {
    const newStatus = isDutyOn ? 'offline' : 'online';
    await login(token || 'dummy_token_123', { ...user, duty_status: newStatus });
  };

  const barData = [0.32, 0.52, 0.68, 0.42, 0.85, 0.58, 1.0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* ── Blue Header ── */}
        <View
          style={{
            backgroundColor: '#2E6BE6',
            paddingTop: 48,
            paddingHorizontal: 20,
            paddingBottom: 68,
          }}
        >
          {/* Top row: greeting + icons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <View>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 2 }}>
                Good morning 👋
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
                {user?.full_name || 'Partner'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Bell color="#FFFFFF" size={18} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Profile')}
              >
                <User color="#FFFFFF" size={18} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Duty Toggle Pill ── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={toggleDuty}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              backgroundColor: '#1E3A5F',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 50,
              gap: 10,
            }}
          >
            {/* Status dot */}
            <Animated.View
              style={{
                width: 9,
                height: 9,
                borderRadius: 5,
                backgroundColor: toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#EF4444', '#10B981'],
                }),
              }}
            />

            <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFFFFF' }}>
              {isDutyOn ? 'On Duty' : 'Off Duty'}
            </Text>

            {/* Toggle track */}
            <Animated.View
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                justifyContent: 'center',
                paddingHorizontal: 2,
                backgroundColor: toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['rgba(255,255,255,0.15)', '#10B981'],
                }),
              }}
            >
              <Animated.View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#FFFFFF',
                  transform: [
                    {
                      translateX: toggleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 18],
                      }),
                    },
                  ],
                }}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* ── Earnings Card (overlaps header) ── */}
        <View style={{ marginTop: -52, paddingHorizontal: 16 }}>
          <View
            style={{
              backgroundColor: '#1C4ED8',
              borderRadius: 20,
              padding: 18,
              elevation: 8,
              shadowColor: '#1a3fa8',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
          >
            {/* Card header row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 10,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.55)',
                    letterSpacing: 1.2,
                    marginBottom: 6,
                  }}
                >
                  TODAY'S EARNINGS
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 30, fontWeight: '800', color: '#FFFFFF' }}>
                    ₹0.00
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: 'rgba(16,185,129,0.22)',
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                    }}
                  >
                    <TrendingUp color="#6ee7b7" size={12} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#6ee7b7' }}>
                      +0%
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Briefcase color="#FFFFFF" size={18} />
              </View>
            </View>

            {/* ── Bar Chart ── */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 5,
                height: 52,
                marginVertical: 14,
              }}
            >
              {barData.map((h, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: h * 52,
                    borderRadius: 5,
                    backgroundColor:
                      i === barData.length - 1
                        ? '#FFFFFF'
                        : 'rgba(255,255,255,0.28)',
                  }}
                />
              ))}
            </View>

            {/* ── Stats Row ── */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: 'rgba(255,255,255,0.10)',
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: '#FFFFFF' }}>0</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: 1,
                    marginTop: 2,
                  }}
                >
                  ORDERS
                </Text>
              </View>

              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />

              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: '#FFFFFF' }}>0h</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: 1,
                    marginTop: 2,
                  }}
                >
                  HOURS
                </Text>
              </View>

              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />

              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Star color="#FBBF24" size={15} fill="#FBBF24" />
                  <Text style={{ fontSize: 17, fontWeight: '800', color: '#FFFFFF' }}>0.0</Text>
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: 1,
                    marginTop: 2,
                  }}
                >
                  RATING
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Sections ── */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }}>

          {/* Active Broadcasts */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>
              Active Broadcasts
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 12, color: '#2E6BE6', fontWeight: '600' }}>See all</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: 'rgba(46,107,230,0.08)',
              elevation: 1,
              shadowColor: '#2E6BE6',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#EEF3FD',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ClipboardList color="#2E6BE6" size={22} />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#334155' }}>
                No active broadcasts
              </Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                New orders will appear here
              </Text>
            </View>
          </View>

          {/* Recent Activity */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>
              Recent Activity
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 12, color: '#2E6BE6', fontWeight: '600' }}>See all</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              borderWidth: 1,
              borderColor: 'rgba(46,107,230,0.08)',
              elevation: 1,
              shadowColor: '#2E6BE6',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#EEF3FD',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Package color="#2E6BE6" size={22} />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#334155' }}>
                No recent activity
              </Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                Completed orders will show here
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;