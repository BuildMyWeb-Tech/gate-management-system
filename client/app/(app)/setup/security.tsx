import { useState } from "react";
import {
  View, Text, TouchableOpacity, TextInput,
  Modal, Alert, FlatList, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface Security {
  id: number;
  code: string;
  name: string;
  mobile: string;
  gender: "Male" | "Female" | "Other";
}

const MOCK_SECURITY: Security[] = [
  { id: 1, code: "S001", name: "Ramesh Kumar", mobile: "9876543210", gender: "Male" },
  { id: 2, code: "S002", name: "Priya Devi", mobile: "9876543211", gender: "Female" },
  { id: 3, code: "S003", name: "Suresh Babu", mobile: "9876543212", gender: "Male" },
];

const EMPTY_FORM = { code: "", name: "", mobile: "", gender: "Male" as Security["gender"] };

export default function SecurityScreen() {
  const router = useRouter();
  const [securities, setSecurities] = useState<Security[]>(MOCK_SECURITY);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Security | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = securities.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile.includes(search)
  );

  const openAdd = () => { setEditingItem(null); setForm(EMPTY_FORM); setErrors({}); setModalVisible(true); };
  const openEdit = (item: Security) => {
    setEditingItem(item);
    setForm({ code: item.code, name: item.name, mobile: item.mobile, gender: item.gender });
    setErrors({});
    setModalVisible(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit mobile";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingItem) {
      setSecurities((prev) => prev.map((s) => (s.id === editingItem.id ? { ...s, ...form } : s)));
      Toast.show({ type: "success", text1: "Security updated" });
    } else {
      setSecurities((prev) => [{ id: Date.now(), ...form }, ...prev]);
      Toast.show({ type: "success", text1: "Security added" });
    }
    setModalVisible(false);
  };

  const handleDelete = (item: Security) => {
    Alert.alert("Delete Security", `Delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { setSecurities((prev) => prev.filter((s) => s.id !== item.id)); Toast.show({ type: "success", text1: "Deleted" }); } },
    ]);
  };

  const genderColor = (g: string) =>
    g === "Male" ? "#3B82F6" : g === "Female" ? "#EC4899" : "#A855F7";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1">Securities</Text>
        <TouchableOpacity onPress={openAdd} className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1">
          <Ionicons name="add" size={18} color="#fff" />
          <Text className="text-white font-semibold text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 py-3">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-11">
          <Ionicons name="search-outline" size={16} color="#64748B" />
          <TextInput className="flex-1 ml-2 text-text-primary text-sm" placeholder="Search securities..." placeholderTextColor="#64748B" value={search} onChangeText={setSearch} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 10 }}
        ListEmptyComponent={<View className="items-center py-20"><Ionicons name="shield-outline" size={48} color="#334155" /><Text className="text-text-muted mt-3">No security personnel found</Text></View>}
        renderItem={({ item }) => (
          <View className="bg-surface border border-border rounded-2xl p-4">
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-full bg-primary/20 items-center justify-center mr-3">
                <Text className="text-primary font-bold text-base">{item.name.charAt(0)}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-text-primary font-semibold">{item.name}</Text>
                  <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: genderColor(item.gender) + "25" }}>
                    <Text className="text-xs font-medium" style={{ color: genderColor(item.gender) }}>{item.gender}</Text>
                  </View>
                </View>
                <Text className="text-text-muted text-xs mt-0.5">{item.code} • {item.mobile}</Text>
              </View>
              <TouchableOpacity onPress={() => openEdit(item)} className="w-8 h-8 items-center justify-center">
                <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} className="w-8 h-8 items-center justify-center">
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <ScrollView>
            <View className="bg-surface rounded-t-3xl p-6 mt-40">
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-text-primary text-lg font-bold">{editingItem ? "Edit Security" : "Add Security"}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color="#94A3B8" /></TouchableOpacity>
              </View>

              {/* Security Code */}
              <View className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Security Code</Text>
                <TextInput className={`bg-background border rounded-xl px-4 h-12 text-text-primary ${errors.code ? "border-error" : "border-border"}`} placeholder="e.g. S001" placeholderTextColor="#64748B" value={form.code} onChangeText={(v) => setForm((p) => ({ ...p, code: v }))} autoCapitalize="characters" />
                {errors.code && <Text className="text-error text-xs mt-1">{errors.code}</Text>}
              </View>

              {/* Name */}
              <View className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Security Name</Text>
                <TextInput className={`bg-background border rounded-xl px-4 h-12 text-text-primary ${errors.name ? "border-error" : "border-border"}`} placeholder="Full name" placeholderTextColor="#64748B" value={form.name} onChangeText={(v) => setForm((p) => ({ ...p, name: v }))} autoCapitalize="words" />
                {errors.name && <Text className="text-error text-xs mt-1">{errors.name}</Text>}
              </View>

              {/* Mobile */}
              <View className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Mobile</Text>
                <TextInput className={`bg-background border rounded-xl px-4 h-12 text-text-primary ${errors.mobile ? "border-error" : "border-border"}`} placeholder="10-digit mobile number" placeholderTextColor="#64748B" value={form.mobile} onChangeText={(v) => setForm((p) => ({ ...p, mobile: v }))} keyboardType="phone-pad" maxLength={10} />
                {errors.mobile && <Text className="text-error text-xs mt-1">{errors.mobile}</Text>}
              </View>

              {/* Gender */}
              <View className="mb-6">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-2">Gender</Text>
                <View className="flex-row gap-2">
                  {(["Male", "Female", "Other"] as const).map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setForm((p) => ({ ...p, gender: g }))}
                      className={`flex-1 h-11 rounded-xl border items-center justify-center ${form.gender === g ? "bg-primary border-primary" : "bg-background border-border"}`}
                    >
                      <Text className={`text-sm font-semibold ${form.gender === g ? "text-white" : "text-text-secondary"}`}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity onPress={() => setModalVisible(false)} className="flex-1 h-12 border border-border rounded-xl items-center justify-center"><Text className="text-text-secondary font-semibold">Cancel</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleSave} className="flex-1 h-12 bg-primary rounded-xl items-center justify-center"><Text className="text-white font-semibold">Save</Text></TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}