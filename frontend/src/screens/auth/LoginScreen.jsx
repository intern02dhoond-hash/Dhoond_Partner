/**
 * Login Screen — Dhoond Partner
 * Phone number input for Firebase phone auth
 * Themed with Dhoond blue (#2E6BE6) branding
 *
 * REAL FLOW: Firebase sends OTP → navigate to OTP screen with confirmationResult
 */

import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import tw from "../../../tw";

const isValidNumber = (str) => {
  if (typeof str !== "string") return false;
  if (str.trim() === "") return true;
  return !isNaN(Number(str));
};

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    // ── Validation ──
    if (phone.length !== 10 || !isValidNumber(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log("✅ Mock OTP sent to:", phone);

      // Simulate network delay
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to OTP screen
        navigation.navigate("OTP", {
          phone,
          verificationId: "mock-verification",
        });
      }, 500);
    } catch (err) {
      console.error("❌ Mock OTP Error:", err);
      setIsLoading(false);
      setError("Failed to send OTP. Please try again.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-bg-main`}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />

      {/* Blue Header */}
      <View style={tw`bg-dhoond pt-15 pb-10 items-center rounded-b-[32px]`}>
        <Text style={tw`text-[32px] font-extrabold text-white tracking-tight`}>
          Dhoond
        </Text>
        <Text style={tw`text-sm text-white/70 tracking-widest uppercase mt-1`}>
          Partner App
        </Text>
      </View>

      {/* Form Section */}
      <View style={tw`flex-1 justify-center px-6 -mt-4`}>
        <Text style={tw`text-2xl font-bold text-txt-primary text-center mb-1`}>
          Welcome Back!
        </Text>
        <Text style={tw`text-base text-txt-secondary text-center mb-8`}>
          Login with your phone number to continue
        </Text>

        {/* Phone Input */}
        <Input
          label="Phone Number"
          value={phone}
          onChangeText={(val) => isValidNumber(val) && setPhone(val)}
          placeholder="Enter 10-digit number"
          keyboardType="phone-pad"
          maxLength={10}
          error={error}
          editable={!isLoading}
        />

        {/* Submit Button */}
        {isLoading ? (
          <View
            style={{
              backgroundColor: "#2E6BE6",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              opacity: 0.7,
            }}
          >
            <ActivityIndicator color="#FFFFFF" />
          </View>
        ) : (
          <Button title="Send OTP" onPress={handleSendOTP} />
        )}

        {/* Signup Link */}
        <Text style={tw`text-center mt-6 text-base text-txt-secondary`}>
          New partner?{" "}
          <Text
            style={tw`text-dhoond font-semibold`}
            onPress={() => navigation.navigate("Signup")}
          >
            Register here
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
