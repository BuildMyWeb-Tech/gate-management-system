import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Vehicle {
  id: number;
  vehicleNo: string;
  mobile: string;
  warehouse: string;
  inTime: string;
  outTime?: string;
  date: string;
  name: string;
}

const MOCK_VEHICLES: Vehicle[] = [
  { id: 1, vehicleNo: "TN01AB1234", mobile: "9876543210", warehouse: "Block A", inTime: "08:30 AM", outTime: "10:00 AM", date: "2026-06-26", name: "Ravi Transport" },
  { id: 2, vehicleNo: "TN02CD5678", mobile: "9876543211", warehouse: "Block B", inTime: "09:45 AM", date: "2026-06-26", name: "Kumar Logistics" },
  { id: 3, vehicleNo: "TN03EF9012", mobile: "9876543212", warehouse: "Block A", inTime: "11:00 AM", outTime: "12:30 PM", date: "2026-06-26", name: "Sri Murugan Traders" },
  { id: 4, vehicleNo: "TN04GH3456", mobile: "9876543213", warehouse: "Cold Storage", inTime: "01:15 PM", date: "2026-06-25", name: "Anand Freight" },
];

export default function VehicleListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedDate] = useState("2026-06-26");

  const filtered = MOCK_VEHICLES.filter(
    (v) =>
      v.date === selectedDate &&
      (v.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
        v.mobile.includes(search) ||
        v.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1">Vehicles</Text>
        <View className="bg-surface border border-border rounded-xl px-3 py-1.5 flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
          <Text className="text-text-secondary text-xs">{selectedDate}</Text>
        </View>
      </View>

      <View className="px-5 py-3">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-11">
          <Ionicons name="search-outline" size={16} color="#64748B" />
          <TextInput className="flex-1 ml-2 text-text-primary text-sm" placeholder="Search by vehicle no or mobile..." placeholderTextColor="#64748B" value={search} onChangeText={setSearch} />
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row px-5 gap-3 mb-2">
        {[
          { label: "Total", value: filtered.length, color: "text-text-primary" },
          { label: "Out", value: filtered.filter((v) => v.outTime).length, color: "text-success" },
          { label: "Inside", value: filtered.filter((v) => !v.outTime).length, color: "text-amber-400" },
        ].map((s) => (
          <View key={s.label} className="flex-1 bg-surface border border-border rounded-xl p-3 items-center">
            <Text className={`text-lg font-bold ${s.color}`}>{s.value}</Text>
            <Text className="text-text-muted text-xs">{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 10 }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Ionicons name="car-outline" size={48} color="#334155" />
            <Text className="text-text-muted mt-3">No vehicles for this date</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(app)/vehicle/${item.id}` as any)}
            className="bg-surface border border-border rounded-2xl p-4"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-xl bg-green-500/20 items-center justify-center">
                  <Ionicons name="car-outline" size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold">{item.vehicleNo}</Text>
                  <Text className="text-text-muted text-xs mt-0.5">{item.name} • {item.mobile}</Text>
                </View>
              </View>
              <View className={`px-2 py-1 rounded-lg ${item.outTime ? "bg-success/20" : "bg-amber-500/20"}`}>
                <Text className={`text-xs font-semibold ${item.outTime ? "text-success" : "text-amber-400"}`}>
                  {item.outTime ? "Out" : "Inside"}
                </Text>
              </View>
            </View>
            <View className="mt-3 pt-3 border-t border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-1">
                <Ionicons name="business-outline" size={12} color="#64748B" />
                <Text className="text-text-muted text-xs">{item.warehouse}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="log-in-outline" size={12} color="#10B981" />
                  <Text className="text-success text-xs font-medium">{item.inTime}</Text>
                </View>
                {item.outTime && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="log-out-outline" size={12} color="#94A3B8" />
                    <Text className="text-text-secondary text-xs">{item.outTime}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => router.push("/(app)/vehicle/new")} className="absolute bottom-8 right-6 w-14 h-14 bg-green-600 rounded-full items-center justify-center">
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}