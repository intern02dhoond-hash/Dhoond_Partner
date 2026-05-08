/**
 * Profile Screen — Dhoond Partner
 * Shows partner profile info, duty toggle, and edit options
 *
 * REAL FLOW:
 * - Duty toggle calls partnerApi.toggleDutyStatus() → updates PostgreSQL
 * - Email update calls partnerApi.updateProfile() → updates PostgreSQL
 * - All data comes from AuthContext (synced with backend)
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import {
  Phone,
  Mail,
  Wifi,
  Power,
  ShieldCheck,
  Edit2,
  LogOut,
  X,
} from "lucide-react-native";
import useAuth from "../../hooks/useAuth";
import partnerApi from "../../api/partner.api";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const { user, token, login, logout } = useAuth();
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [isTogglingDuty, setIsTogglingDuty] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  const isDutyOn = user?.duty_status === "online";
  const swipeAnim = useRef(new Animated.Value(isDutyOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(swipeAnim, {
      toValue: isDutyOn ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isDutyOn, swipeAnim]);

  /**
   * ── REAL DUTY TOGGLE ──
   * Calls backend PATCH /api/v1/partner/duty → updates PostgreSQL
   */
  const toggleDuty = async () => {
    if (isTogglingDuty) return;

    const newStatus = isDutyOn ? "offline" : "online";
    setIsTogglingDuty(true);

    try {
      const response = await partnerApi.toggleDutyStatus(newStatus);
      console.log("✅ Duty status updated:", response.data?.duty_status || newStatus);

      // Update local state
      await login(token, { ...user, duty_status: newStatus });
    } catch (err) {
      console.error("❌ Toggle Duty Error:", err);
      if (err.response) {
        Alert.alert("Update Failed", err.response.data?.message || "Could not update status.");
      } else if (err.request) {
        Alert.alert("Network Error", "Unable to reach the server.");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setIsTogglingDuty(false);
    }
  };

  /**
   * ── REAL EMAIL UPDATE ──
   * Calls backend PUT /api/v1/partner/profile → updates PostgreSQL
   */
  const handleSaveEmail = async () => {
    if (!editEmail.trim()) {
      Alert.alert("Validation", "Please enter a valid email.");
      return;
    }

    setIsSavingEmail(true);

    try {
      const response = await partnerApi.updateProfile({ email: editEmail.trim() });
      console.log("✅ Email updated:", response.data?.email);

      // Update local state with the full updated profile
      const updatedUser = response.data || { ...user, email: editEmail.trim() };
      await login(token, updatedUser);

      setEditModalVisible(false);
      Alert.alert("Success", "Email updated successfully!");
    } catch (err) {
      console.error("❌ Update Email Error:", err);
      if (err.response) {
        Alert.alert("Update Failed", err.response.data?.message || "Could not update email.");
      } else if (err.request) {
        Alert.alert("Network Error", "Unable to reach the server.");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    // Navigation happens automatically via AppNavigator (isAuthenticated becomes false)
  };

  const initials = (user?.full_name || user?.name || "P").charAt(0).toUpperCase();
  const displayName = user?.full_name || user?.name || "Partner";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EEF3FB" }}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />

      {/* Blue Header */}
      <View
        style={{
          backgroundColor: "#2E6BE6",
          paddingTop: 44,
          paddingBottom: 34,
          alignItems: "center",
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
          elevation: 8,
          shadowColor: "#1A3FA8",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.26,
          shadowRadius: 20,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 82,
            height: 82,
            borderRadius: 41,
            backgroundColor: "rgba(255,255,255,0.20)",
            borderColor: "rgba(255,255,255,0.55)",
            borderWidth: 2.5,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 34, fontWeight: "800", color: "#FFFFFF" }}>
            {initials}
          </Text>
        </View>

        {/* Name */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#FFFFFF",
            letterSpacing: 0.2,
            marginBottom: 8,
          }}
        >
          {displayName}
        </Text>

        {/* Service type pill */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.16)",
            borderColor: "rgba(255,255,255,0.30)",
            borderWidth: 1,
            borderRadius: 999,
            paddingVertical: 6,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.85)",
              fontWeight: "500",
            }}
          >
            {user?.service_type || "General"}
          </Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 14, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Phone */}
        <InfoCard>
          <IconBox bg="#EEF3FD">
            <Phone color="#2E6BE6" size={18} />
          </IconBox>
          <View>
            <Label>PHONE</Label>
            <Value>{user?.phone || "N/A"}</Value>
          </View>
        </InfoCard>

        {/* Email */}
        <InfoCard>
          <IconBox bg="#EEF3FD">
            <Mail color="#2E6BE6" size={18} />
          </IconBox>
          <View>
            <Label>EMAIL</Label>
            <Value>{user?.email || "Not provided"}</Value>
          </View>
        </InfoCard>

        {/* Working Status */}
        <InfoCard extra={{ justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <IconBox bg={isDutyOn ? "#ECFDF5" : "#FEF2F2"}>
              <Wifi color={isDutyOn ? "#10B981" : "#EF4444"} size={18} />
            </IconBox>
            <View>
              <Label>WORKING STATUS</Label>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isDutyOn ? "#10B981" : "#EF4444",
                  }}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: isDutyOn ? "#10B981" : "#EF4444",
                  }}
                >
                  {isTogglingDuty
                    ? "Updating..."
                    : isDutyOn
                    ? "Online"
                    : "Offline"}
                </Text>
              </View>
            </View>
          </View>

          {/* Duty swipe toggle */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleDuty}
            disabled={isTogglingDuty}
            style={{
              width: 56,
              height: 30,
              borderRadius: 15,
              backgroundColor: isDutyOn
                ? "rgba(16,185,129,0.20)"
                : "rgba(239,68,68,0.14)",
              justifyContent: "center",
              paddingHorizontal: 2,
              opacity: isTogglingDuty ? 0.5 : 1,
              borderWidth: 1,
              borderColor: isDutyOn
                ? "rgba(16,185,129,0.40)"
                : "rgba(239,68,68,0.30)",
            }}
          >
            <Animated.View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(15,23,42,0.08)",
                transform: [
                  {
                    translateX: swipeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 26],
                    }),
                  },
                ],
              }}
            >
              <Power
                size={14}
                strokeWidth={2.2}
                color={isDutyOn ? "#0F58E8" : "#EF4444"}
              />
            </Animated.View>
          </TouchableOpacity>
        </InfoCard>

        {/* Verification */}
        <InfoCard extra={{ marginBottom: 28 }}>
          <IconBox bg="#FFFBEB">
            <ShieldCheck color="#F59E0B" size={18} />
          </IconBox>
          <View>
            <Label>VERIFICATION</Label>
            <Value extra={{ color: "#F59E0B" }}>
              {user?.verification_status || "Pending"}
            </Value>
          </View>
        </InfoCard>

        {/* Edit Profile Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setEditEmail(user?.email || "");
            setEditModalVisible(true);
          }}
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingVertical: 16,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: "rgba(46,107,230,0.30)",
            elevation: 2,
            shadowColor: "#2E6BE6",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <Edit2 color="#2E6BE6" size={18} />
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#2E6BE6" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: "rgba(239,68,68,0.28)",
            elevation: 2,
            shadowColor: "#EF4444",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.09,
            shadowRadius: 10,
          }}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: "rgba(239,68,68,0.12)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut color="#DC2626" size={15} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#DC2626", letterSpacing: 0.2 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Email Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 24,
              paddingBottom: 40,
            }}
          >
            {/* Handle bar */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#E2E8F0",
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#1E293B" }}
              >
                Edit Email
              </Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={{ padding: 4 }}
              >
                <X color="#94A3B8" size={20} />
              </TouchableOpacity>
            </View>

            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSavingEmail}
              style={{
                width: "100%",
                borderWidth: 1,
                borderColor: "rgba(46,107,230,0.30)",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 16,
                fontSize: 15,
                color: "#1E293B",
                backgroundColor: "#F6F9FF",
                marginBottom: 20,
              }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                disabled={isSavingEmail}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "rgba(46,107,230,0.25)",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#64748B" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEmail}
                disabled={isSavingEmail}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: "#2E6BE6",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isSavingEmail ? 0.7 : 1,
                }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: "700", color: "#FFFFFF" }}
                >
                  {isSavingEmail ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoCard({ children, extra = {} }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: "rgba(46,107,230,0.10)",
        elevation: 2,
        shadowColor: "#1E3A8A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        ...extra,
      }}
    >
      {children}
    </View>
  );
}

function IconBox({ bg, children }) {
  return (
    <View
      style={{
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

function Label({ children }) {
  return (
    <Text
      style={{
        fontSize: 11,
        color: "#8A99B2",
        fontWeight: "700",
        letterSpacing: 0.45,
        marginBottom: 3,
      }}
    >
      {children}
    </Text>
  );
}

function Value({ children, extra = {} }) {
  return (
    <Text
      style={{ fontSize: 15, fontWeight: "700", color: "#1E293B", ...extra }}
    >
      {children}
    </Text>
  );
}