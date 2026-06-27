import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const VISIT_TYPES = ["Delivery", "Pickup", "Loading", "Unloading", "Raw Material", "Finished Goods"];
const MOCK_WAREHOUSES = ["Block A", "Block B", "Cold Storage", "Warehouse C", "Admin Block"];

export default function NewVehicleScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vehicleNo: "", mobile: "", visitType: "", name: "",
    company: "", warehouse: "", remarks: "", passNo: "",
    inTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    outTime: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVisitType, setShowVisitType] = useState(false);
  const [showWarehouse, setShowWarehouse] = useState(false);
  const [warehouseSearch, setWarehouseSearch] = useState("");

  const set = (key: string, value: string) => { setForm((p) => ({ ...p, [key]: value })); setErrors((p) => ({ ...p, [key]: "" })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.vehicleNo.trim()) e.vehicleNo = "Vehicle number is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit mobile";
    if (!form.visitType) e.visitType = "Select visit type";
    if (!form.warehouse.trim()) e.warehouse = "Select warehouse";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    Toast.show({ type: "success", text1: "Vehicle entry added" });
    router.back();
  };

  const handleVehicleOut = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    Toast.show({ type: "success", text1: "Vehicle marked as out" });
    router.back();
  };

  const inputCls = (err?: string) => `bg-surface border rounded-xl px-4 h-12 text-text-primary ${err ? "border-error" : "border-border"}`;
  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <View className="mb-4">
      <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">{label}</Text>
      {children}
      {error ? <Text className="text-error text-xs mt-1">{error}</Text> : null}
    </View>
  );

  const filteredWarehouses = MOCK_WAREHOUSES.filter((w) => w.toLowerCase().includes(warehouseSearch.toLowerCase()));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View className="flex-row items-center px-5 py-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
          </TouchableOpacity>
          <Text className="text-text-primary text-lg font-bold">New Vehicle</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <Field label="Vehicle Number" error={errors.vehicleNo}>
            <TextInput className={inputCls(errors.vehicleNo)} placeholder="e.g. TN01AB1234" placeholderTextColor="#64748B" value={form.vehicleNo} onChangeText={(v) => set("vehicleNo", v.toUpperCase())} autoCapitalize="characters" />
          </Field>

          <Field label="Mobile Number" error={errors.mobile}>
            <TextInput className={inputCls(errors.mobile)} placeholder="Driver / contact mobile" placeholderTextColor="#64748B" value={form.mobile} onChangeText={(v) => set("mobile", v)} keyboardType="phone-pad" maxLength={10} />
          </Field>

          <Field label="Visit Type" error={errors.visitType}>
            <TouchableOpacity className={`flex-row items-center justify-between ${inputCls(errors.visitType)}`} onPress={() => setShowVisitType(!showVisitType)}>
              <Text className={form.visitType ? "text-text-primary" : "text-text-muted"}>{form.visitType || "Select visit type"}</Text>
              <Ionicons name={showVisitType ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
            </TouchableOpacity>
            {showVisitType && (
              <View className="bg-surface border border-border rounded-xl mt-1 overflow-hidden">
                {VISIT_TYPES.map((t) => (
                  <TouchableOpacity key={t} className="px-4 py-3 border-b border-border" onPress={() => { set("visitType", t); setShowVisitType(false); }}>
                    <Text className="text-text-primary text-sm">{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Field>

          <Field label="Driver / Person Name">
            <TextInput className={inputCls()} placeholder="Full name (optional)" placeholderTextColor="#64748B" value={form.name} onChangeText={(v) => set("name", v)} autoCapitalize="words" />
          </Field>

          <Field label="Company">
            <TextInput className={inputCls()} placeholder="Company name (optional)" placeholderTextColor="#64748B" value={form.company} onChangeText={(v) => set("company", v)} autoCapitalize="words" />
          </Field>

          <Field label="Warehouse" error={errors.warehouse}>
            <TextInput
              className={inputCls(errors.warehouse)}
              placeholder="Search warehouse..."
              placeholderTextColor="#64748B"
              value={warehouseSearch || form.warehouse}
              onChangeText={(v) => { setWarehouseSearch(v); setShowWarehouse(true); }}
              onFocus={() => setShowWarehouse(true)}
            />
            {showWarehouse && warehouseSearch.length > 0 && (
              <View className="bg-surface border border-border rounded-xl mt-1 overflow-hidden">
                {filteredWarehouses.map((w) => (
                  <TouchableOpacity key={w} className="px-4 py-3 border-b border-border" onPress={() => { set("warehouse", w); setWarehouseSearch(""); setShowWarehouse(false); }}>
                    <Text className="text-text-primary text-sm">{w}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Field>

          <Field label="Remarks">
            <TextInput className="bg-surface border border-border rounded-xl px-4 py-3 text-text-primary" placeholder="Purpose (optional)" placeholderTextColor="#64748B" value={form.remarks} onChangeText={(v) => set("remarks", v)} multiline numberOfLines={2} />
          </Field>

          <Field label="Pass Number">
            <TextInput className={inputCls()} placeholder="Pass / ID number (optional)" placeholderTextColor="#64748B" value={form.passNo} onChangeText={(v) => set("passNo", v)} />
          </Field>

          {/* In/Out Time */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">In Time</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-12">
                <Ionicons name="log-in-outline" size={16} color="#10B981" />
                <Text className="text-text-primary ml-2 text-sm">{form.inTime}</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Out Time</Text>
              <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-12">
                <Ionicons name="log-out-outline" size={16} color="#94A3B8" />
                <Text className="text-text-muted ml-2 text-sm">{form.outTime || "Not yet"}</Text>
              </View>
            </View>
          </View>

          {/* Photo */}
          <View className="mb-6">
            <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-2">Photo</Text>
            <TouchableOpacity className="bg-surface border border-dashed border-border rounded-2xl h-32 items-center justify-center">
              <Ionicons name="camera-outline" size={32} color="#475569" />
              <Text className="text-text-muted text-sm mt-2">Tap to capture photo</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View className="gap-3 mb-8">
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => router.back()} className="flex-1 h-12 border border-border rounded-xl items-center justify-center">
                <Text className="text-text-secondary font-semibold">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} disabled={loading} className="flex-1 h-12 bg-primary rounded-xl items-center justify-center">
                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Save</Text>}
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleVehicleOut} className="h-12 bg-success/20 border border-success/30 rounded-xl items-center justify-center flex-row gap-2">
              <Ionicons name="log-out-outline" size={18} color="#10B981" />
              <Text className="text-success font-semibold">Vehicle Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}