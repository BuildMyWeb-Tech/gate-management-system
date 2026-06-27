import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Visitor {
  id: number;
  name: string;
  mobile: string;
  toMeet: string;
  inTime: string;
  outTime?: string;
  date: string;
  visitorType: string;
}

const MOCK_VISITORS: Visitor[] = [
  { id: 1, name: "Arjun Sharma", mobile: "9876543210", toMeet: "Rajesh Kumar", inTime: "09:15 AM", outTime: "11:30 AM", date: "2026-06-26", visitorType: "Official" },
  { id: 2, name: "Meena Devi", mobile: "9876543211", toMeet: "Priya S", inTime: "10:00 AM", date: "2026-06-26", visitorType: "Personal" },
  { id: 3, name: "Karthik Raj", mobile: "9876543212", toMeet: "HR Dept", inTime: "11:30 AM", outTime: "12:15 PM", date: "2026-06-26", visitorType: "Interview" },
  { id: 4, name: "Sunita Verma", mobile: "9876543213", toMeet: "Accounts", inTime: "02:00 PM", date: "2026-06-25", visitorType: "Official" },
];

export default function VisitorListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-06-26");

  const filtered = MOCK_VISITORS.filter(
    (v) =>
      v.date === selectedDate &&
      (v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.mobile.includes(search))
  );

  const visitorTypeColor = (type: string) => {
    if (type === "Official") return { bg: "bg-blue-500/20", text: "text-blue-400" };
    if (type === "Personal") return { bg: "bg-green-500/20", text: "text-green-400" };
    return { bg: "bg-amber-500/20", text: "text-amber-400" };
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1">Visitor List</Text>
        <View className="bg-surface border border-border rounded-xl px-3 py-1.5 flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
          <Text className="text-text-secondary text-xs">{selectedDate}</Text>
        </View>
      </View>

      {/* Search */}
      <View className="px-5 py-3">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-11">
          <Ionicons name="search-outline" size={16} color="#64748B" />
          <TextInput className="flex-1 ml-2 text-text-primary text-sm" placeholder="Search by name or mobile..." placeholderTextColor="#64748B" value={search} onChangeText={setSearch} />
        </View>
      </View>

      {/* Stats row */}
      <View className="flex-row px-5 gap-3 mb-2">
        <View className="flex-1 bg-surface border border-border rounded-xl p-3 items-center">
          <Text className="text-text-primary text-lg font-bold">{filtered.length}</Text>
          <Text className="text-text-muted text-xs">Total</Text>
        </View>
        <View className="flex-1 bg-surface border border-border rounded-xl p-3 items-center">
          <Text className="text-success text-lg font-bold">{filtered.filter((v) => v.outTime).length}</Text>
          <Text className="text-text-muted text-xs">Out</Text>
        </View>
        <View className="flex-1 bg-surface border border-border rounded-xl p-3 items-center">
          <Text className="text-amber-400 text-lg font-bold">{filtered.filter((v) => !v.outTime).length}</Text>
          <Text className="text-text-muted text-xs">Inside</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 10 }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Ionicons name="people-outline" size={48} color="#334155" />
            <Text className="text-text-muted mt-3 text-center">No visitors for this date</Text>
          </View>
        }
        renderItem={({ item }) => {
          const tc = visitorTypeColor(item.visitorType);
          return (
            <TouchableOpacity
              onPress={() => router.push(`/(app)/visitor/${item.id}` as any)}
              className="bg-surface border border-border rounded-2xl p-4"
              activeOpacity={0.8}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                    <Text className="text-primary font-bold">{item.name.charAt(0)}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary font-semibold">{item.name}</Text>
                    <Text className="text-text-muted text-xs mt-0.5">{item.mobile}</Text>
                  </View>
                </View>
                <View className={`px-2 py-1 rounded-lg ${tc.bg}`}>
                  <Text className={`text-xs font-semibold ${tc.text}`}>{item.visitorType}</Text>
                </View>
              </View>
              <View className="mt-3 pt-3 border-t border-border flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="person-outline" size={12} color="#64748B" />
                  <Text className="text-text-muted text-xs">To Meet: {item.toMeet}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="log-in-outline" size={12} color="#10B981" />
                    <Text className="text-success text-xs font-medium">{item.inTime}</Text>
                  </View>
                  {item.outTime ? (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="log-out-outline" size={12} color="#94A3B8" />
                      <Text className="text-text-secondary text-xs">{item.outTime}</Text>
                    </View>
                  ) : (
                    <View className="bg-amber-500/20 px-2 py-0.5 rounded-full">
                      <Text className="text-amber-400 text-xs font-semibold">Inside</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push("/(app)/visitor/new")}
        className="absolute bottom-8 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}