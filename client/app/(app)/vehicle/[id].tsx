import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Toast from "react-native-toast-message";

const MOCK = {
  id: 1, vehicleNo: "TN01AB1234", mobile: "9876543210",
  visitType: "Delivery", name: "Ravi Transport", company: "Ravi Logistics",
  warehouse: "Block A", remarks: "Raw material delivery",
  passNo: "V001", inTime: "08:30 AM", outTime: "10:00 AM", date: "2026-06-26",
};

export default function VehicleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const vehicle = { ...MOCK, id: Number(id) };

  const handleOut = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    Toast.show({ type: "success", text1: "Vehicle marked as out" });
    router.back();
  };

  const Row = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View className="flex-row items-start py-3 border-b border-border">
      <View className="w-8 items-center mt-0.5">
        <Ionicons name={icon as any} size={16} color="#64748B" />
      </View>
      <View className="flex-1">
        <Text className="text-text-muted text-xs">{label}</Text>
        <Text className="text-text-primary text-sm font-medium mt-0.5">{value || "—"}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1">Vehicle Detail</Text>
        {!vehicle.outTime && (
          <TouchableOpacity onPress={handleOut} className="bg-success/20 border border-success/30 px-4 py-2 rounded-xl flex-row items-center gap-1">
            {loading ? <ActivityIndicator size="small" color="#10B981" /> : (
              <>
                <Ionicons name="log-out-outline" size={16} color="#10B981" />
                <Text className="text-success text-sm font-semibold">Out</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="items-center py-6">
          <View className="w-20 h-20 rounded-2xl bg-green-500/20 items-center justify-center mb-3">
            <Ionicons name="car-outline" size={36} color="#10B981" />
          </View>
          <Text className="text-text-primary text-xl font-bold">{vehicle.vehicleNo}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="bg-blue-500/20 px-3 py-1 rounded-full">
              <Text className="text-blue-400 text-xs font-semibold">{vehicle.visitType}</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${vehicle.outTime ? "bg-success/20" : "bg-amber-500/20"}`}>
              <Text className={`text-xs font-semibold ${vehicle.outTime ? "text-success" : "text-amber-400"}`}>
                {vehicle.outTime ? "Exited" : "Inside"}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-surface border border-border rounded-2xl px-4">
          <Row icon="call-outline" label="Mobile" value={vehicle.mobile} />
          <Row icon="person-outline" label="Driver / Person" value={vehicle.name} />
          <Row icon="business-outline" label="Company" value={vehicle.company} />
          <Row icon="cube-outline" label="Warehouse" value={vehicle.warehouse} />
          <Row icon="chatbubble-outline" label="Remarks" value={vehicle.remarks} />
          <Row icon="card-outline" label="Pass No" value={vehicle.passNo} />
          <Row icon="log-in-outline" label="In Time" value={vehicle.inTime} />
          <Row icon="log-out-outline" label="Out Time" value={vehicle.outTime || "Not yet"} />
          <Row icon="calendar-outline" label="Date" value={vehicle.date} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}