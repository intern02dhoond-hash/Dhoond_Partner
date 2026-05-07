import React, { useState } from "react";
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
} from "react-native";
import {
  Phone,
  Mail,
  Wifi,
  ShieldCheck,
  Edit2,
  LogOut,
  X,
} from "lucide-react-native";
import useAuth from "../../hooks/useAuth";
import TokenService from "../../services/token.service";

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user, token, login, logout } = useAuth();
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editEmail, setEditEmail] = useState(user?.email || '');
  
  const isDutyOn = user?.duty_status === "online";

  const toggleDuty = async () => {
    const newStatus = isDutyOn ? "offline" : "online";
    // Reuse login to update user state globally
    await login(token || "dummy_token_123", { ...user, duty_status: newStatus });
  };

  const handleSaveEmail = async () => {
    const updatedUser = { ...user, email: editEmail };
    await login(token || "dummy_token_123", updatedUser);
    setEditModalVisible(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const initials = (user?.full_name || user?.name || "P").charAt(0).toUpperCase();
  const displayName = user?.full_name || user?.name || "Partner";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6BE6" />

      {/* Blue Header */}
      <View style={{
        backgroundColor: "#2E6BE6",
        paddingTop: 48,
        paddingBottom: 36,
        alignItems: "center",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 8,
        shadowColor: "#1A3FA8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 18,
      }}>
        {/* Avatar */}
        <View style={{
          width: 82, 
          height: 82, 
          borderRadius: 41,
          backgroundColor: "rgba(255,255,255,0.22)",
          borderColor: "rgba(255,255,255,0.5)",
          borderWidth: 3,
          alignItems: "center", 
          justifyContent: "center",
          marginBottom: 12,
        }}>
          <Text style={{ fontSize: 34, fontWeight: '800', color: "#FFFFFF" }}>{initials}</Text>
        </View>

        {/* Name */}
        <Text style={{ fontSize: 20, fontWeight: '700', color: "#FFFFFF", letterSpacing: 0.2, marginBottom: 8 }}>
          {displayName}
        </Text>

        {/* Service type pill */}
        <View style={{
          backgroundColor: "rgba(255,255,255,0.15)",
          borderColor: "rgba(255,255,255,0.25)",
          borderWidth: 1,
          borderRadius: 20,
          paddingVertical: 4,
          paddingHorizontal: 14,
        }}>
          <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: '500' }}>
            {user?.service_type || "General"}
          </Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Phone */}
        <InfoCard>
          <IconBox bg="#EEF3FD"><Phone color="#2E6BE6" size={18} /></IconBox>
          <View>
            <Label>PHONE</Label>
            <Value>{user?.phone || 'N/A'}</Value>
          </View>
        </InfoCard>

        {/* Email */}
        <InfoCard>
          <IconBox bg="#EEF3FD"><Mail color="#2E6BE6" size={18} /></IconBox>
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
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isDutyOn ? "#10B981" : "#EF4444" }} />
                <Text style={{ fontSize: 15, fontWeight: '600', color: isDutyOn ? "#10B981" : "#EF4444" }}>
                  {isDutyOn ? "Online" : "Offline"}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Custom Toggle Switch */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleDuty}
            style={{
              width: 50, 
              height: 28, 
              borderRadius: 14, 
              backgroundColor: isDutyOn ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)",
              justifyContent: 'center',
              paddingHorizontal: 3,
            }}
          >
            <View style={{
              width: 22, 
              height: 22, 
              borderRadius: 11,
              backgroundColor: isDutyOn ? "#10B981" : "#EF4444",
              transform: [{ translateX: isDutyOn ? 22 : 0 }],
            }} />
          </TouchableOpacity>
        </InfoCard>

        {/* Verification */}
        <InfoCard extra={{ marginBottom: 28 }}>
          <IconBox bg="#FFFBEB"><ShieldCheck color="#F59E0B" size={18} /></IconBox>
          <View>
            <Label>VERIFICATION</Label>
            <Value extra={{ color: "#F59E0B" }}>{user?.verification_status || "Pending"}</Value>
          </View>
        </InfoCard>

        {/* Edit Profile Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => { setEditEmail(user?.email || ''); setEditModalVisible(true); }}
          style={{
            width: "100%", 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: 8,
            backgroundColor: "#FFFFFF", 
            borderRadius: 14, 
            paddingVertical: 15, 
            marginBottom: 10,
            borderWidth: 1.5, 
            borderColor: "rgba(46,107,230,0.35)",
          }}
        >
          <Edit2 color="#2E6BE6" size={18} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: "#2E6BE6" }}>Edit Profile</Text>
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
            gap: 8,
            backgroundColor: "#FEF2F2", 
            borderRadius: 14, 
            paddingVertical: 15,
            borderWidth: 1.5, 
            borderColor: "rgba(239,68,68,0.2)",
          }}
        >
          <LogOut color="#EF4444" size={18} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: "#EF4444" }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Email Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="fade">
        <View style={{
          flex: 1, 
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end", 
        }}>
          <View style={{
            backgroundColor: "#FFFFFF", 
            borderTopLeftRadius: 28, 
            borderTopRightRadius: 28,
            padding: 24, 
            paddingBottom: 40,
          }}>
            {/* Handle bar */}
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#E2E8F0", alignSelf: 'center', marginBottom: 20 }} />

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: "#1E293B" }}>Edit Email</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ padding: 4 }}>
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
              style={{
                width: "100%", 
                borderWidth: 1.5, 
                borderColor: "rgba(46,107,230,0.25)", 
                borderRadius: 12,
                paddingVertical: 14, 
                paddingHorizontal: 16, 
                fontSize: 15, 
                color: "#1E293B",
                backgroundColor: "#F8FAFF", 
                marginBottom: 20,
              }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={{
                  flex: 1, 
                  paddingVertical: 14, 
                  borderRadius: 12,
                  borderWidth: 1.5, 
                  borderColor: "rgba(46,107,230,0.25)", 
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', color: "#64748B" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEmail}
                style={{
                  flex: 1, 
                  paddingVertical: 14, 
                  borderRadius: 12,
                  backgroundColor: "#2E6BE6",
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: "#FFFFFF" }}>Save</Text>
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
    <View style={{
      backgroundColor: "#FFFFFF", 
      borderRadius: 14, 
      paddingVertical: 14, 
      paddingHorizontal: 16, 
      marginBottom: 10,
      flexDirection: "row", 
      alignItems: "center", 
      gap: 12,
      borderWidth: 1, 
      borderColor: "rgba(46,107,230,0.08)",
      elevation: 1,
      shadowColor: "#2E6BE6",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      ...extra,
    }}>
      {children}
    </View>
  );
}

function IconBox({ bg, children }) {
  return (
    <View style={{
      width: 36, 
      height: 36, 
      borderRadius: 10, 
      backgroundColor: bg,
      alignItems: "center", 
      justifyContent: "center", 
    }}>
      {children}
    </View>
  );
}

function Label({ children }) {
  return (
    <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 }}>
      {children}
    </Text>
  );
}

function Value({ children, extra = {} }) {
  return (
    <Text style={{ fontSize: 15, fontWeight: '600', color: "#1E293B", ...extra }}>
      {children}
    </Text>
  );
}