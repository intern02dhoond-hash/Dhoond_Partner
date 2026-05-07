/**
 * OTP Screen — Dhoond Partner
 * 6-digit OTP verification after phone auth
 * Themed with Dhoond blue (#2E6BE6) branding
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { ShieldCheck, RotateCcw, ArrowLeft } from "lucide-react-native";
import useAuth from "../../hooks/useAuth";
import TokenService from "../../services/token.service";

const { width } = Dimensions.get('window');
const BOX_SIZE = (width - 48 - 40) / 6; // 6 boxes with padding

const isValidNumber = (str) => {
  if (typeof str !== "string") return false;
  if (str.trim() === "") return true;
  return !isNaN(Number(str));
};

const OTPScreen = ({ route, navigation }) => {
  const { phone, fullName, serviceType } = route.params || {};
  const { login } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120);
  const inputs = useRef([]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleBoxChange = (text, index) => {
    if (!isValidNumber(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    setError("");
    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleBoxKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const getOtpString = () => otp.join("");

  const handleVerifyOTP = async () => {
    const otpStr = getOtpString();
    if (otpStr.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      console.log("OTP Verified for:", phone);
      const existingUser = await TokenService.getUserData();
      const fakeToken = "dummy_token_123";
      const fakeUserData = {
        id: existingUser?.id || "1",
        phone: phone || existingUser?.phone || "",
        full_name: fullName || existingUser?.full_name || existingUser?.name || "Test Partner",
        service_type: serviceType || existingUser?.service_type || "General",
        verification_status: existingUser?.verification_status || "Pending",
        email: existingUser?.email || "Not provided",
        duty_status: existingUser?.duty_status || "online",
      };
      await login(fakeToken, fakeUserData);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />

      {/* ── Blue Header ── */}
      <View
        style={{
          backgroundColor: '#2E6BE6',
          paddingTop: 52,
          paddingBottom: 40,
          alignItems: 'center',
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          position: 'relative',
          elevation: 8,
          shadowColor: '#1a50c8',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 52,
            left: 18,
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.28)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#FFFFFF" size={20} />
        </TouchableOpacity>

        {/* Shield badge */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.25)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <ShieldCheck color="#FFFFFF" size={34} />
        </View>

        <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2, marginBottom: 4 }}>
          Verify OTP
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.2 }}>
          Secure verification for your account
        </Text>
      </View>

      {/* ── Content ── */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Phone info card */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: 'rgba(46,107,230,0.10)',
            elevation: 2,
            shadowColor: '#2E6BE6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
          }}
        >
          <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 10 }}>
            We sent a 6-digit code to
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E6BE6' }} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#2E6BE6', letterSpacing: 0.5 }}>
              +91 {phone || "XXXXXXXXXX"}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#EEF3FD',
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 20,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontSize: 12, color: '#2E6BE6', fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OTP label */}
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 10, letterSpacing: 0.2 }}>
          Enter 6-digit OTP
        </Text>

        {/* OTP boxes */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              value={digit}
              onChangeText={(text) => handleBoxChange(text, index)}
              onKeyPress={(e) => handleBoxKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: digit ? '#2E6BE6' : error ? '#EF4444' : 'rgba(46,107,230,0.20)',
                backgroundColor: digit ? '#FFFFFF' : '#F8FAFF',
                textAlign: 'center',
                fontSize: 22,
                fontWeight: '700',
                color: '#2E6BE6',
              }}
            />
          ))}
        </View>

        {/* Error */}
        {error ? (
          <Text style={{ fontSize: 12, color: '#EF4444', marginBottom: 8, letterSpacing: 0.2 }}>
            {error}
          </Text>
        ) : null}

        {/* Timer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 24 }}>
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>Code expires in</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: timer < 30 ? '#EF4444' : '#2E6BE6' }}>
            {formatTime(timer)}
          </Text>
        </View>

        {/* Verify Button — full-width, mobile optimized */}
        <TouchableOpacity
          style={{
            backgroundColor: '#2E6BE6',
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 56,
            width: '100%',
            elevation: 4,
            shadowColor: '#1a50c8',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
          onPress={handleVerifyOTP}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 }}>
                Verifying...
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 }}>
              {"Verify & Continue"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
        </View>

        {/* Resend button */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            paddingVertical: 15,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: 'rgba(46,107,230,0.25)',
            gap: 8,
            opacity: timer > 0 ? 0.5 : 1,
          }}
          onPress={() => {
            if (timer === 0) {
              setTimer(120);
              console.log("Resend OTP");
            }
          }}
          disabled={timer > 0}
        >
          <RotateCcw color="#2E6BE6" size={16} />
          <Text style={{ fontSize: 14, color: '#64748B' }}>
            Didn't receive it?{' '}
            <Text style={{ color: '#2E6BE6', fontWeight: '700' }}>Resend Code</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default OTPScreen;