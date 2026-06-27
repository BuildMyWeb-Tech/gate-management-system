import { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, Modal, Alert, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface Gate {
  id: number;
  code: string;
  name: string;
  location: string;
  isActive: boolean;
}

const MOCK_GATES: Gate[] = [
  { id: 1, code: "G001", name: "Main Gate", location: "Front Entry", isActive: true },
  { id: 2, code: "G002", name: "North Gate", location: "North Wing", isActive: true },
  { id: 3, code: "G003", name: "South Gate", location: "South Wing", isActive: false },
  { id: 4, code: "G004", name: "Warehouse Gate", location: "Warehouse Block", isActive: true },
];

const EMPTY_FORM = { code: "", name: "", location: "" };

export default function GatesScreen() {
  const router = useRouter();
  const [gates, setGates] = useState<Gate[]>(MOCK_GATES);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGate, setEditingGate] = useState<Gate | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});

  const filtered = gates.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.code.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingGate(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalVisible(true);
  };

  const openEdit = (gate: Gate) => {
    setEditingGate(gate);
    setForm({ code: gate.code, name: gate.name, location: gate.location });
    setErrors({});
    setModalVisible(true);
  };

  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingGate) {
      setGates((prev) =>
        prev.map((g) =>
          g.id === editingGate.id ? { ...g, ...form } : g
        )
      );
      Toast.show({ type: "success", text1: "Gate updated" });
    } else {
      const newGate: Gate = {
        id: Date.now(),
        ...form,
        isActive: true,
      };
      setGates((prev) => [newGate, ...prev]);
      Toast.show({ type: "success", text1: "Gate added" });
    }
    setModalVisible(false);
  };

  const handleDelete = (gate: Gate) => {
    Alert.alert("Delete Gate", `Delete "${gate.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setGates((prev) => prev.filter((g) => g.id !== gate.id));
          Toast.show({ type: "success", text1: "Gate deleted" });
        },
      },
    ]);
  };

  const toggleActive = (gate: Gate) => {
    setGates((prev) =>
      prev.map((g) =>
        g.id === gate.id ? { ...g, isActive: !g.isActive } : g
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1">Gates</Text>
        <TouchableOpacity
          onPress={openAdd}
          className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1"
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text className="text-white font-semibold text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="px-5 py-3">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-11">
          <Ionicons name="search-outline" size={16} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-text-primary text-sm"
            placeholder="Search gates..."
            placeholderTextColor="#64748B"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 10 }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Ionicons name="git-merge-outline" size={48} color="#334155" />
            <Text className="text-text-muted mt-3">No gates found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-surface border border-border rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-xl bg-primary/20 items-center justify-center">
                  <Ionicons name="git-merge-outline" size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">{item.name}</Text>
                  <Text className="text-text-muted text-xs mt-0.5">
                    {item.code} • {item.location}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity onPress={() => toggleActive(item)}>
                  <View className={`px-2 py-1 rounded-lg ${item.isActive ? "bg-success/20" : "bg-error/20"}`}>
                    <Text className={`text-xs font-semibold ${item.isActive ? "text-success" : "text-error"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openEdit(item)} className="w-8 h-8 items-center justify-center">
                  <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} className="w-8 h-8 items-center justify-center">
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-text-primary text-lg font-bold">
                {editingGate ? "Edit Gate" : "Add Gate"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {(["code", "name", "location"] as const).map((field) => (
              <View key={field} className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Text>
                <TextInput
                  className={`bg-background border rounded-xl px-4 h-12 text-text-primary ${
                    errors[field] ? "border-error" : "border-border"
                  }`}
                  placeholder={`Enter ${field}`}
                  placeholderTextColor="#64748B"
                  value={form[field]}
                  onChangeText={(v) => setForm((p) => ({ ...p, [field]: v }))}
                  autoCapitalize={field === "code" ? "characters" : "words"}
                />
                {errors[field] && (
                  <Text className="text-error text-xs mt-1">{errors[field]}</Text>
                )}
              </View>
            ))}

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 h-12 border border-border rounded-xl items-center justify-center"
              >
                <Text className="text-text-secondary font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 h-12 bg-primary rounded-xl items-center justify-center"
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}