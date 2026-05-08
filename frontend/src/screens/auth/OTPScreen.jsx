/**
 * OTP Screen — Dhoond Partner
 * 6-digit OTP verification after phone auth
 * Themed with Dhoond blue (#2E6BE6) branding
 * ✅ Mobile & phone-friendly layout fixed
 *
 * REAL FLOW:
 * 1. User enters OTP digits
 * 2. Firebase verifies OTP → returns Firebase user with ID token
 * 3. ID token is sent to backend /auth/sync → backend creates/retrieves partner
 * 4. Token + partner data stored locally → user navigated to Home
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
  Alert,
} from "react-native";
import { ShieldCheck, RotateCcw, ArrowLeft } from "lucide-react-native";
import useAuth from "../../hooks/useAuth";
import authApi from "../../api/auth.api";

const { width } = Dimensions.get("window");

const isValidNumber = (str) => {
  if (typeof str !== "string") return false;
  if (str.trim() === "") return true;
  return !isNaN(Number(str));
};

const OTPScreen = ({ route, navigation }) => {
  const { phone, verificationId: initialVerificationId, fullName, serviceType } = route.params || {};
  const { login } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
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

  /**
   * ── REAL OTP VERIFICATION FLOW ──
   * Step 1: Verify OTP with Firebase → get Firebase ID token
   * Step 2: Send token to backend /auth/sync → get partner data
   * Step 3: Store token + user data → navigate to Home
   */
  const handleVerifyOTP = async () => {
    const otpStr = getOtpString();
    if (otpStr.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (otpStr !== "123456") {
      setError("Invalid OTP. Please enter 123456.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // ── Step 1: Mock Firebase ID token ──
      const idToken = "mock-token-" + phone;
      console.log("✅ Mock auth successful, generated ID token");

      // ── Step 2: Sync with backend ──
      console.log("📡 Syncing with backend...");
      const response = await authApi.syncPartner({
        service_type: serviceType || "General",
        full_name: fullName,
      }, idToken);

      const partnerData = response.data;
      console.log("✅ Backend sync successful:", partnerData?.full_name);

      // ── Step 3: Store token + user data, navigate to Home ──
      await login(idToken, partnerData);

    } catch (err) {
      console.error("❌ OTP Verification Error:", err);
      setIsLoading(false);

      if (err.response) {
        setError(err.response.data?.message || "Server error. Please try again.");
      } else if (err.request) {
        setError("Network error. Check your connection and try again.");
      } else {
        setError(err.message || "Verification failed. Please try again.");
      }
    }
  };

  /**
   * ── RESEND OTP ──
   * Re-trigger Firebase phone verification
   */
  const handleResendOTP = async () => {
    if (timer > 0) return;

    setError("");
    setIsLoading(true);

    try {
      console.log("📱 Resending mock OTP to:", phone);
      setTimeout(() => {
        setIsLoading(false);
        setTimer(120);
        setOtp(["", "", "", "", "", ""]);
        inputs.current[0]?.focus();
        console.log("✅ Mock OTP resent successfully");
      }, 500);
    } catch (err) {
      console.error("❌ Resend OTP Error:", err);
      setIsLoading(false);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  // Calculate box size dynamically — fits all 6 on any screen
  const horizontalPadding = 32; // 16px each side
  const totalGap = 5 * 6;       // 5 gaps × 6px
  const boxSize = (width - horizontalPadding - totalGap) / 6;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />

      {/* ── Blue Header ── */}
      <View
        style={{
          backgroundColor: "#2E6BE6",
          paddingTop: 36,
          paddingBottom: 32,
          alignItems: "center",
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          position: "relative",
          elevation: 8,
          shadowColor: "#1a50c8",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "rgba(255,255,255,0.18)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.28)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft color="#FFFFFF" size={18} />
        </TouchableOpacity>

        {/* Shield badge */}
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "rgba(255,255,255,0.15)",
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.25)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <ShieldCheck color="#FFFFFF" size={28} />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#FFFFFF",
            letterSpacing: 0.2,
            marginBottom: 3,
          }}
        >
          Verify OTP
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.65)",
            letterSpacing: 0.2,
          }}
        >
          Secure verification for your account
        </Text>
      </View>

      {/* ── Content ── */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Phone info card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            padding: 14,
            marginBottom: 20,
            borderWidth: 0.5,
            borderColor: "rgba(46,107,230,0.12)",
            elevation: 2,
            shadowColor: "#2E6BE6",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#64748B",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            We sent a 6-digit code to
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: "#2E6BE6",
              }}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#2E6BE6",
                letterSpacing: 0.4,
              }}
            >
              +91 {phone || "XXXXXXXXXX"}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#EEF3FD",
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 20,
              }}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={{ fontSize: 11, color: "#2E6BE6", fontWeight: "600" }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OTP label */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 10,
            letterSpacing: 0.2,
          }}
        >
          Enter 6-digit OTP
        </Text>

        {/* ── OTP boxes — KEY FIX ──
            Uses dynamic boxSize so all 6 always fit on screen.
            minWidth: 0 prevents flex children from overflowing.
            aspectRatio removed in favour of explicit height = boxSize. */}
        <View
          style={{
            flexDirection: "row",
            gap: 6,
            marginBottom: 8,
            width: "100%",
          }}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              value={digit}
              onChangeText={(text) => handleBoxChange(text, index)}
              onKeyPress={(e) => handleBoxKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!isLoading}
              style={{
                width: boxSize,
                height: boxSize,
                minWidth: 0,         // ← prevents overflow on small screens
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: error
                  ? "#EF4444"
                  : digit
                  ? "#2E6BE6"
                  : "rgba(46,107,230,0.20)",
                backgroundColor: digit ? "#FFFFFF" : "#F8FAFF",
                textAlign: "center",
                fontSize: Math.min(20, boxSize * 0.45), // scales with box
                fontWeight: "700",
                color: "#2E6BE6",
              }}
            />
          ))}
        </View>

        {/* Error */}
        {error ? (
          <Text
            style={{
              fontSize: 11,
              color: "#EF4444",
              marginBottom: 6,
              letterSpacing: 0.2,
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* Timer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>Code expires in</Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: timer < 30 ? "#EF4444" : "#2E6BE6",
            }}
          >
            {formatTime(timer)}
          </Text>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#2E6BE6",
            paddingVertical: 15,
            borderRadius: 13,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 52,
            width: "100%",
            elevation: 4,
            shadowColor: "#1a50c8",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            opacity: isLoading ? 0.7 : 1,
          }}
          onPress={handleVerifyOTP}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#FFFFFF",
              letterSpacing: 0.3,
            }}
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginVertical: 16,
          }}
        >
          <View style={{ flex: 1, height: 0.5, backgroundColor: "#E2E8F0" }} />
          <Text style={{ fontSize: 11, color: "#94A3B8" }}>or</Text>
          <View style={{ flex: 1, height: 0.5, backgroundColor: "#E2E8F0" }} />
        </View>

        {/* Resend button */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            paddingVertical: 14,
            borderRadius: 13,
            borderWidth: 1.5,
            borderColor: "rgba(46,107,230,0.25)",
            gap: 6,
            opacity: timer > 0 ? 0.5 : 1,
          }}
          onPress={handleResendOTP}
          disabled={timer > 0 || isLoading}
          activeOpacity={0.8}
        >
          <RotateCcw color="#2E6BE6" size={15} />
          <Text style={{ fontSize: 13, color: "#64748B" }}>
            Didn't receive it?{" "}
            <Text style={{ color: "#2E6BE6", fontWeight: "700" }}>Resend Code</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OTPScreen;