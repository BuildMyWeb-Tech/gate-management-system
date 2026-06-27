import { useState } from "react";
import {
  View, Text, TouchableOpacity, TextInput,
  Modal, Alert, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface Location {
  id: number;
  code: string;
  name: string;
}

const MOCK_LOCATIONS: Location[] = [
  { id: 1, code: "L001", name: "Head Office" },
  { id: 2, code: "L002", name: "Warehouse Block A" },
  { id: 3, code: "L003", name: "Production Floor" },
  { id: 4, code: "L004", name: "Admin Block" },
];

const EMPTY_FORM = { code: "", name: "" };

export default function LocationScreen() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Location | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});

  const filtered = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalVisible(true);
  };

  const openEdit = (item: Location) => {
    setEditingItem(item);
    setForm({ code: item.code, name: item.name });
    setErrors({});
    setModalVisible(true);
  };

  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingItem) {
      setLocations((prev) =>
        prev.map((l) => (l.id === editingItem.id ? { ...l, ...form } : l))
      );
      Toast.show({ type: "success", text1: "Location updated" });
    } else {
      setLocations((prev) => [{ id: Date.now(), ...form }, ...prev]);
      Toast.show({ type: "success", text1: "Location added" });
    }
    setModalVisible(false);
  };

  const handleDelete = (item: Location) => {
    Alert.alert("Delete Location", `Delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => {
          setLocations((prev) => prev.filter((l) => l.id !== item.id));
          Toast.show({ type: "success", text1: "Location deleted" });
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1">Locations</Text>
        <TouchableOpacity onPress={openAdd} className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1">
          <Ionicons name="add" size={18} color="#fff" />
          <Text className="text-white font-semibold text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 py-3">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-11">
          <Ionicons name="search-outline" size={16} color="#64748B" />
          <TextInput className="flex-1 ml-2 text-text-primary text-sm" placeholder="Search locations..." placeholderTextColor="#64748B" value={search} onChangeText={setSearch} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 10 }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Ionicons name="location-outline" size={48} color="#334155" />
            <Text className="text-text-muted mt-3">No locations found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-surface border border-border rounded-2xl p-4 flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-green-500/20 items-center justify-center mr-3">
              <Ionicons name="location-outline" size={20} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-text-primary font-semibold">{item.name}</Text>
              <Text className="text-text-muted text-xs mt-0.5">{item.code}</Text>
            </View>
            <TouchableOpacity onPress={() => openEdit(item)} className="w-8 h-8 items-center justify-center">
              <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item)} className="w-8 h-8 items-center justify-center">
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-text-primary text-lg font-bold">
                {editingItem ? "Edit Location" : "Add Location"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            {(["code", "name"] as const).map((field) => (
              <View key={field} className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">
                  {field === "code" ? "Location Code" : "Location Name"}
                </Text>
                <TextInput
                  className={`bg-background border rounded-xl px-4 h-12 text-text-primary ${errors[field] ? "border-error" : "border-border"}`}
                  placeholder={`Enter ${field}`}
                  placeholderTextColor="#64748B"
                  value={form[field]}
                  onChangeText={(v) => setForm((p) => ({ ...p, [field]: v }))}
                  autoCapitalize={field === "code" ? "characters" : "words"}
                />
                {errors[field] && <Text className="text-error text-xs mt-1">{errors[field]}</Text>}
              </View>
            ))}
            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="flex-1 h-12 border border-border rounded-xl items-center justify-center">
                <Text className="text-text-secondary font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} className="flex-1 h-12 bg-primary rounded-xl items-center justify-center">
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}