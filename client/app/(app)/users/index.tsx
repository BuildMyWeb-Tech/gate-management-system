import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface AppUser {
  id: number;
  username: string;
  name: string;
  role: string;
  mobile: string;
  gateName: string;
  isActive: boolean;
}

const ROLES = ["admin", "operator", "supervisor", "viewer"];
const MOCK_GATES = ["Main Gate", "North Gate", "South Gate", "Warehouse Gate"];

const MOCK_USERS: AppUser[] = [
  { id: 1, username: "admin01", name: "Ajaykumar", role: "admin", mobile: "9876543210", gateName: "Main Gate", isActive: true },
  { id: 2, username: "op_north", name: "Senthil Kumar", role: "operator", mobile: "9876543211", gateName: "North Gate", isActive: true },
  { id: 3, username: "sup_main", name: "Vijaya Lakshmi", role: "supervisor", mobile: "9876543212", gateName: "Main Gate", isActive: true },
  { id: 4, username: "op_south", name: "Mani Raja", role: "operator", mobile: "9876543213", gateName: "South Gate", isActive: false },
];

const EMPTY_FORM = { username: "", name: "", mobile: "", role: "operator", gateName: "Main Gate", password: "" };

const roleColor = (role: string) => {
  const map: Record<string, string> = { admin: "#EF4444", supervisor: "#F59E0B", operator: "#3B82F6", viewer: "#10B981" };
  return map[role] || "#94A3B8";
};

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRoleDrop, setShowRoleDrop] = useState(false);
  const [showGateDrop, setShowGateDrop] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.role.includes(search.toLowerCase())
  );

  const openAdd = () => { setEditingUser(null); setForm(EMPTY_FORM); setErrors({}); setModalVisible(true); };
  const openEdit = (u: AppUser) => {
    setEditingUser(u);
    setForm({ username: u.username, name: u.name, mobile: u.mobile, role: u.role, gateName: u.gateName, password: "" });
    setErrors({});
    setModalVisible(true);
  };

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit mobile";
    if (!editingUser && !form.password.trim()) e.password = "Password is required for new user";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingUser) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...form } : u));
      Toast.show({ type: "success", text1: "User updated" });
    } else {
      setUsers((prev) => [{ id: Date.now(), ...form, isActive: true }, ...prev]);
      Toast.show({ type: "success", text1: "User added" });
    }
    setModalVisible(false);
  };

  const handleDelete = (u: AppUser) => {
    Alert.alert("Delete User", `Delete "${u.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { setUsers((prev) => prev.filter((x) => x.id !== u.id)); Toast.show({ type: "success", text1: "User deleted" }); } },
    ]);
  };

  const toggleActive = (u: AppUser) => setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, isActive: !x.isActive } : x));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold flex-1">User Management</Text>
        <TouchableOpacity onPress={openAdd} className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1">
          <Ionicons name="add" size={18} color="#fff" />
          <Text className="text-white font-semibold text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className="flex-row px-5 py-3 gap-3">
        {[
          { label: "Total", value: users.length, color: "text-text-primary" },
          { label: "Active", value: users.filter((u) => u.isActive).length, color: "text-success" },
          { label: "Inactive", value: users.filter((u) => !u.isActive).length, color: "text-error" },
        ].map((s) => (
          <View key={s.label} className="flex-1 bg-surface border border-border rounded-xl p-3 items-center">
            <Text className={`text-lg font-bold ${s.color}`}>{s.value}</Text>
            <Text className="text-text-muted text-xs">{s.label}</Text>
          </View>
        ))}
      </View>

      <View className="px-5 pb-3">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-11">
          <Ionicons name="search-outline" size={16} color="#64748B" />
          <TextInput className="flex-1 ml-2 text-text-primary text-sm" placeholder="Search users..." placeholderTextColor="#64748B" value={search} onChangeText={setSearch} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 10 }}
        ListEmptyComponent={<View className="items-center py-20"><Ionicons name="people-outline" size={48} color="#334155" /><Text className="text-text-muted mt-3">No users found</Text></View>}
        renderItem={({ item }) => (
          <View className="bg-surface border border-border rounded-2xl p-4">
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-full items-center justify-center mr-3" style={{ backgroundColor: roleColor(item.role) + "25" }}>
                <Text className="font-bold text-base" style={{ color: roleColor(item.role) }}>{item.name.charAt(0)}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2 flex-wrap">
                  <Text className="text-text-primary font-semibold">{item.name}</Text>
                  <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: roleColor(item.role) + "25" }}>
                    <Text className="text-xs font-semibold capitalize" style={{ color: roleColor(item.role) }}>{item.role}</Text>
                  </View>
                </View>
                <Text className="text-text-muted text-xs mt-0.5">@{item.username} • {item.gateName}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <TouchableOpacity onPress={() => toggleActive(item)} className="mr-1">
                  <View className={`px-2 py-1 rounded-lg ${item.isActive ? "bg-success/20" : "bg-error/20"}`}>
                    <Text className={`text-xs font-semibold ${item.isActive ? "text-success" : "text-error"}`}>{item.isActive ? "Active" : "Off"}</Text>
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
          <ScrollView>
            <View className="bg-surface rounded-t-3xl p-6 mt-20">
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-text-primary text-lg font-bold">{editingUser ? "Edit User" : "Add User"}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color="#94A3B8" /></TouchableOpacity>
              </View>

              {/* Name */}
              <View className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Full Name</Text>
                <TextInput className={`bg-background border rounded-xl px-4 h-12 text-text-primary ${errors.name ? "border-error" : "border-border"}`} placeholder="Full name" placeholderTextColor="#64748B" value={form.name} onChangeText={(v) => set("name", v)} autoCapitalize="words" />
                {errors.name && <Text className="text-error text-xs mt-1">{errors.name}</Text>}
              </View>

              {/* Username */}
              <View className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Username</Text>
                <TextInput className={`bg-background border rounded-xl px-4 h-12 text-text-primary ${errors.username ? "border-error" : "border-border"}`} placeholder="Login username" placeholderTextColor="#64748B" value={form.username} onChangeText={(v) => set("username", v)} autoCapitalize="none" />
                {errors.username && <Text className="text-error text-xs mt-1">{errors.username}</Text>}
              </View>

              {/* Mobile */}
              <View className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Mobile</Text>
                <TextInput className={`bg-background border rounded-xl px-4 h-12 text-text-primary ${errors.mobile ? "border-error" : "border-border"}`} placeholder="10-digit mobile" placeholderTextColor="#64748B" value={form.mobile} onChangeText={(v) => set("mobile", v)} keyboardType="phone-pad" maxLength={10} />
                {errors.mobile && <Text className="text-error text-xs mt-1">{errors.mobile}</Text>}
              </View>

              {/* Password */}
              {!editingUser && (
                <View className="mb-4">
                  <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Password</Text>
                  <View className={`flex-row items-center bg-background border rounded-xl px-4 h-12 ${errors.password ? "border-error" : "border-border"}`}>
                    <TextInput className="flex-1 text-text-primary" placeholder="Set password" placeholderTextColor="#64748B" value={form.password} onChangeText={(v) => set("password", v)} secureTextEntry={!showPassword} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text className="text-error text-xs mt-1">{errors.password}</Text>}
                </View>
              )}

              {/* Role */}
              <View className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Role</Text>
                <TouchableOpacity className="flex-row items-center justify-between bg-background border border-border rounded-xl px-4 h-12" onPress={() => setShowRoleDrop(!showRoleDrop)}>
                  <Text className="text-text-primary capitalize">{form.role}</Text>
                  <Ionicons name={showRoleDrop ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
                </TouchableOpacity>
                {showRoleDrop && (
                  <View className="bg-background border border-border rounded-xl mt-1 overflow-hidden">
                    {ROLES.map((r) => (
                      <TouchableOpacity key={r} className="px-4 py-3 border-b border-border flex-row items-center gap-2" onPress={() => { set("role", r); setShowRoleDrop(false); }}>
                        <View className="w-3 h-3 rounded-full" style={{ backgroundColor: roleColor(r) }} />
                        <Text className="text-text-primary text-sm capitalize">{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Gate */}
              <View className="mb-6">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Gate Assignment</Text>
                <TouchableOpacity className="flex-row items-center justify-between bg-background border border-border rounded-xl px-4 h-12" onPress={() => setShowGateDrop(!showGateDrop)}>
                  <Text className="text-text-primary">{form.gateName}</Text>
                  <Ionicons name={showGateDrop ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
                </TouchableOpacity>
                {showGateDrop && (
                  <View className="bg-background border border-border rounded-xl mt-1 overflow-hidden">
                    {MOCK_GATES.map((g) => (
                      <TouchableOpacity key={g} className="px-4 py-3 border-b border-border" onPress={() => { set("gateName", g); setShowGateDrop(false); }}>
                        <Text className="text-text-primary text-sm">{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View className="flex-row gap-3 mb-4">
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