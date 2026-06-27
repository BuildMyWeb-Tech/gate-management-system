import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";

const MOCK_SECURITIES = [
  { id: 1, name: "Ramesh Kumar", code: "S001" },
  { id: 2, name: "Priya Devi", code: "S002" },
  { id: 3, name: "Suresh Babu", code: "S003" },
];

const MOCK_PATROLS = [
  { id: 1, securityName: "Ramesh Kumar", gate: "Main Gate", patrolStart: "06:00 AM", patrolEnd: "07:00 AM", remarks: "All clear", date: "2026-06-26" },
  { id: 2, securityName: "Priya Devi", gate: "North Gate", patrolStart: "08:00 AM", patrolEnd: "09:00 AM", remarks: "Minor issue resolved", date: "2026-06-26" },
  { id: 3, securityName: "Suresh Babu", gate: "Main Gate", patrolStart: "10:00 AM", remarks: "", date: "2026-06-26" },
];

export default function PatrolScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [patrols, setPatrols] = useState(MOCK_PATROLS);
  const [showForm, setShowForm] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState<typeof MOCK_SECURITIES[0] | null>(null);
  const [showSecurityDrop, setShowSecurityDrop] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedSecurity) e.security = "Select a security personnel";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const newPatrol = {
      id: Date.now(),
      securityName: selectedSecurity!.name,
      gate: user?.gateName || "Main Gate",
      patrolStart: now,
      remarks,
      date: "2026-06-26",
    };
    setPatrols((p) => [newPatrol, ...p]);
    setLoading(false);
    Toast.show({ type: "success", text1: "Patrol logged successfully" });
    setShowForm(false);
    setSelectedSecurity(null);
    setRemarks("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1">Security Patrol</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)} className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1">
          <Ionicons name={showForm ? "close" : "add"} size={18} color="#fff" />
          <Text className="text-white font-semibold text-sm">{showForm ? "Cancel" : "Log Patrol"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} showsVerticalScrollIndicator={false}>

        {/* New Patrol Form */}
        {showForm && (
          <View className="bg-surface border border-border rounded-2xl p-5">
            <Text className="text-text-primary font-bold text-base mb-4">New Patrol Entry</Text>

            {/* Gate (auto from logged in user) */}
            <View className="mb-4">
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Gate</Text>
              <View className="flex-row items-center bg-background border border-border rounded-xl px-4 h-12">
                <Ionicons name="git-merge-outline" size={16} color="#64748B" />
                <Text className="text-text-primary ml-2">{user?.gateName || "Main Gate"}</Text>
              </View>
            </View>

            {/* Security Selection */}
            <View className="mb-4">
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Security Personnel</Text>
              <TouchableOpacity
                className={`flex-row items-center justify-between bg-background border rounded-xl px-4 h-12 ${errors.security ? "border-error" : "border-border"}`}
                onPress={() => setShowSecurityDrop(!showSecurityDrop)}
              >
                <Text className={selectedSecurity ? "text-text-primary" : "text-text-muted"}>
                  {selectedSecurity ? `${selectedSecurity.name} (${selectedSecurity.code})` : "Select security"}
                </Text>
                <Ionicons name={showSecurityDrop ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
              </TouchableOpacity>
              {errors.security && <Text className="text-error text-xs mt-1">{errors.security}</Text>}
              {showSecurityDrop && (
                <View className="bg-background border border-border rounded-xl mt-1 overflow-hidden">
                  {MOCK_SECURITIES.map((s) => (
                    <TouchableOpacity key={s.id} className="px-4 py-3 border-b border-border flex-row items-center gap-2"
                      onPress={() => { setSelectedSecurity(s); setShowSecurityDrop(false); setErrors({}); }}>
                      <View className="w-7 h-7 rounded-full bg-primary/20 items-center justify-center">
                        <Text className="text-primary text-xs font-bold">{s.name.charAt(0)}</Text>
                      </View>
                      <Text className="text-text-primary text-sm">{s.name}</Text>
                      <Text className="text-text-muted text-xs">({s.code})</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Patrol Start Time */}
            <View className="mb-4">
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Patrol Start</Text>
              <View className="flex-row items-center bg-background border border-border rounded-xl px-4 h-12">
                <Ionicons name="time-outline" size={16} color="#F59E0B" />
                <Text className="text-text-primary ml-2">{now}</Text>
                <Text className="text-text-muted text-xs ml-2">(auto)</Text>
              </View>
            </View>

            {/* Remarks */}
            <View className="mb-5">
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Remarks</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-text-primary"
                placeholder="Observations, issues found..."
                placeholderTextColor="#64748B"
                value={remarks}
                onChangeText={setRemarks}
                multiline numberOfLines={3}
              />
            </View>

            <TouchableOpacity onPress={handleSave} disabled={loading} className="h-12 bg-primary rounded-xl items-center justify-center">
              {loading ? <ActivityIndicator color="#fff" /> : (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text className="text-white font-semibold">Save Patrol</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Patrol History */}
        <View>
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">Today's Patrols</Text>
          {patrols.length === 0 ? (
            <View className="items-center py-12 bg-surface border border-border rounded-2xl">
              <Ionicons name="walk-outline" size={48} color="#334155" />
              <Text className="text-text-muted mt-3">No patrols logged today</Text>
            </View>
          ) : (
            <View className="gap-3">
              {patrols.map((p) => (
                <View key={p.id} className="bg-surface border border-border rounded-2xl p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-amber-500/20 items-center justify-center">
                        <Text className="text-amber-400 font-bold">{p.securityName.charAt(0)}</Text>
                      </View>
                      <View>
                        <Text className="text-text-primary font-semibold">{p.securityName}</Text>
                        <Text className="text-text-muted text-xs mt-0.5">{p.gate}</Text>
                      </View>
                    </View>
                    <View className={`px-2 py-1 rounded-lg ${"patrolEnd" in p && p.patrolEnd ? "bg-success/20" : "bg-amber-500/20"}`}>
                      <Text className={`text-xs font-semibold ${"patrolEnd" in p && p.patrolEnd ? "text-success" : "text-amber-400"}`}>
                        {"patrolEnd" in p && p.patrolEnd ? "Completed" : "Active"}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-3 pt-3 border-t border-border flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="play-circle-outline" size={14} color="#10B981" />
                      <Text className="text-success text-xs">{p.patrolStart}</Text>
                    </View>
                    {"patrolEnd" in p && p.patrolEnd && (
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="stop-circle-outline" size={14} color="#94A3B8" />
                        <Text className="text-text-secondary text-xs">{p.patrolEnd}</Text>
                      </View>
                    )}
                    {p.remarks ? (
                      <Text className="text-text-muted text-xs flex-1" numberOfLines={1}>• {p.remarks}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}