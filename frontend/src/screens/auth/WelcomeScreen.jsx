/**
 * Welcome Screen
 * Animated splash/landing page shown when the app opens.
 * Uses the Dhoond logo image for branding.
 * Styled with Tailwind CSS (twrnc)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import tw from '../../../tw';

const DhoondLogo = require('../../assets/images/dhoond_logo.png');

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const circle1Scale = useRef(new Animated.Value(0)).current;
  const circle2Scale = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      // Step 1: Decorative circles expand — was 700/900ms, now 320/420ms
      Animated.parallel([
        Animated.timing(circle1Scale, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(circle2Scale, {
          toValue: 1,
          duration: 420,
          delay: 60,          // was 150ms
          useNativeDriver: true,
        }),
      ]),
      // Step 2: Logo fades in — tighter spring (faster snap)
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 220,      // was open-ended spring
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,        // was 5 (higher = less oscillation, faster settle)
          tension: 120,       // was 80 (higher = faster spring)
          useNativeDriver: true,
        }),
      ]),
      // Step 3: Subtitle slides up — was 500ms, now 220ms
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
      // Step 4: Buttons fade in — was 500ms, now 220ms
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={tw`flex-1 bg-dhoond items-center justify-center overflow-hidden`}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Top-left decorative circle */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: -width * 0.25,
            left: -width * 0.2,
            width: width * 0.9,
            height: width * 0.9,
            borderRadius: width * 0.45,
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
          },
          { transform: [{ scale: circle1Scale }] },
        ]}
      />

      {/* Bottom-right decorative circle */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: -width * 0.25,
            right: -width * 0.2,
            width: width * 0.9,
            height: width * 0.9,
            borderRadius: width * 0.45,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
          { transform: [{ scale: circle2Scale }] },
        ]}
      />

      {/* Top-right small accent circle */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: width * 0.1,
            right: -width * 0.15,
            width: width * 0.45,
            height: width * 0.45,
            borderRadius: width * 0.225,
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
          { opacity: logoOpacity },
        ]}
      />

      {/* Inner glow circle behind logo */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: width * 0.65,
            height: width * 0.65,
            borderRadius: width * 0.325,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          { opacity: logoOpacity },
        ]}
      />

      {/* ===== Logo + Subtitle ===== */}
      <Animated.View
        style={{
          alignItems: 'center',
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
      >
        <Image
          source={DhoondLogo}
          style={{
            width: width * 0.82,
            height: width * 0.30,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />

        {/* Divider line */}
        <View
          style={{
            width: 40,
            height: 1.5,
            backgroundColor: 'rgba(255,255,255,0.30)',
            borderRadius: 2,
            marginBottom: 14,
          }}
        />

        {/* Partner subtitle */}
        <Animated.Text
          style={[
            {
              fontSize: 13,
              color: 'rgba(255,255,255,0.70)',
              letterSpacing: 5,
              textTransform: 'uppercase',
              fontWeight: '400',
            },
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          Partner
        </Animated.Text>
      </Animated.View>

      {/* ===== Action Buttons ===== */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            paddingHorizontal: 28,
            gap: 14,
          },
          {
            opacity: buttonsOpacity,
            transform: [{ translateY: buttonsTranslateY }],
          },
        ]}
      >
        {/* Login Button — solid white */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FFFFFF',
            paddingVertical: 17,
            borderRadius: 14,
            alignItems: 'center',
          }}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
        >
          <Text
            style={{
              color: '#1E40AF',
              fontSize: 15,
              fontWeight: '700',
              letterSpacing: 0.4,
            }}
          >
            I'm Already a Partner
          </Text>
        </TouchableOpacity>

        {/* Signup Button — outlined */}
        <TouchableOpacity
          style={{
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.45)',
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
          }}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: '600',
              letterSpacing: 0.4,
            }}
          >
            Become a Partner
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ===== Bottom loader dots ===== */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 44,
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
          },
          { opacity: subtitleOpacity },
        ]}
      >
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              height: 8,
              width: i === 1 ? 22 : 8,
              borderRadius: 4,
              backgroundColor:
                i === 1 ? '#FFFFFF' : 'rgba(255,255,255,0.38)',
            }}
          />
        ))}
      </Animated.View>
    </View>
  );
}