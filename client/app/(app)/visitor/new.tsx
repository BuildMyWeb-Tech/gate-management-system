import { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";

const VISITOR_TYPES = ["Official", "Personal", "Interview", "Vendor", "Contractor"];
const MOCK_EMPLOYEES = ["Rajesh Kumar", "Priya S", "HR Dept", "Accounts", "Admin", "Security Head"];

export default function NewVisitorScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    mobile: "", visitorType: "", name: "", company: "",
    toMeet: "", remarks: "", vehicleNo: "", passNo: "",
    inTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    outTime: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showToMeetDropdown, setShowToMeetDropdown] = useState(false);
  const [toMeetSearch, setToMeetSearch] = useState("");

  const filteredEmployees = MOCK_EMPLOYEES.filter((e) =>
    e.toLowerCase().includes(toMeetSearch.toLowerCase())
  );

  const set = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit mobile";
    if (!form.visitorType) e.visitorType = "Select visitor type";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.toMeet.trim()) e.toMeet = "Select who to meet";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    Toast.show({ type: "success", text1: "Visitor added successfully" });
    router.back();
  };

  const handleVisitorOut = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    Toast.show({ type: "success", text1: "Visitor marked as out" });
    router.back();
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <View className="mb-4">
      <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">{label}</Text>
      {children}
      {error ? <Text className="text-error text-xs mt-1">{error}</Text> : null}
    </View>
  );

  const inputCls = (err?: string) =>
    `bg-surface border rounded-xl px-4 h-12 text-text-primary ${err ? "border-error" : "border-border"}`;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
          </TouchableOpacity>
          <Text className="text-text-primary text-lg font-bold">New Visitor</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Mobile */}
          <Field label="Mobile Number" error={errors.mobile}>
            <View className="flex-row gap-2">
              <TextInput className={`flex-1 ${inputCls(errors.mobile)}`} placeholder="10-digit mobile" placeholderTextColor="#64748B" value={form.mobile} onChangeText={(v) => set("mobile", v)} keyboardType="phone-pad" maxLength={10} />
              <TouchableOpacity className="bg-primary h-12 px-4 rounded-xl items-center justify-center">
                <Text className="text-white font-semibold text-sm">Get</Text>
              </TouchableOpacity>
            </View>
          </Field>

          {/* Visitor Type */}
          <Field label="Visitor Type" error={errors.visitorType}>
            <TouchableOpacity className={`flex-row items-center justify-between ${inputCls(errors.visitorType)}`} onPress={() => setShowTypeDropdown(!showTypeDropdown)}>
              <Text className={form.visitorType ? "text-text-primary" : "text-text-muted"}>{form.visitorType || "Select type"}</Text>
              <Ionicons name={showTypeDropdown ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
            </TouchableOpacity>
            {showTypeDropdown && (
              <View className="bg-surface border border-border rounded-xl mt-1 overflow-hidden">
                {VISITOR_TYPES.map((t) => (
                  <TouchableOpacity key={t} className="px-4 py-3 border-b border-border" onPress={() => { set("visitorType", t); setShowTypeDropdown(false); }}>
                    <Text className="text-text-primary text-sm">{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Field>

          {/* Name */}
          <Field label="Visitor Name" error={errors.name}>
            <TextInput className={inputCls(errors.name)} placeholder="Full name" placeholderTextColor="#64748B" value={form.name} onChangeText={(v) => set("name", v)} autoCapitalize="words" />
          </Field>

          {/* Company */}
          <Field label="Company">
            <TextInput className={inputCls()} placeholder="Company name (optional)" placeholderTextColor="#64748B" value={form.company} onChangeText={(v) => set("company", v)} autoCapitalize="words" />
          </Field>

          {/* To Meet */}
          <Field label="To Meet" error={errors.toMeet}>
            <TextInput
              className={inputCls(errors.toMeet)}
              placeholder="Search employee..."
              placeholderTextColor="#64748B"
              value={toMeetSearch || form.toMeet}
              onChangeText={(v) => { setToMeetSearch(v); setShowToMeetDropdown(true); }}
              onFocus={() => setShowToMeetDropdown(true)}
            />
            {showToMeetDropdown && toMeetSearch.length > 0 && (
              <View className="bg-surface border border-border rounded-xl mt-1 overflow-hidden">
                {filteredEmployees.map((e) => (
                  <TouchableOpacity key={e} className="px-4 py-3 border-b border-border" onPress={() => { set("toMeet", e); setToMeetSearch(""); setShowToMeetDropdown(false); }}>
                    <Text className="text-text-primary text-sm">{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Field>

          {/* Remarks */}
          <Field label="Remarks">
            <TextInput className="bg-surface border border-border rounded-xl px-4 py-3 text-text-primary" placeholder="Purpose of visit (optional)" placeholderTextColor="#64748B" value={form.remarks} onChangeText={(v) => set("remarks", v)} multiline numberOfLines={2} />
          </Field>

          {/* Vehicle No */}
          <Field label="Vehicle Number">
            <TextInput className={inputCls()} placeholder="e.g. TN01AB1234 (optional)" placeholderTextColor="#64748B" value={form.vehicleNo} onChangeText={(v) => set("vehicleNo", v.toUpperCase())} autoCapitalize="characters" />
          </Field>

          {/* Pass No */}
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

          {/* Photo placeholder */}
          <View className="mb-6">
            <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-2">Photo</Text>
            <TouchableOpacity className="bg-surface border border-dashed border-border rounded-2xl h-32 items-center justify-center">
              <Ionicons name="camera-outline" size={32} color="#475569" />
              <Text className="text-text-muted text-sm mt-2">Tap to capture photo</Text>
              <Text className="text-text-muted text-xs">(Camera — Phase 10)</Text>
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
            <TouchableOpacity onPress={handleVisitorOut} className="h-12 bg-success/20 border border-success/30 rounded-xl items-center justify-center flex-row gap-2">
              <Ionicons name="log-out-outline" size={18} color="#10B981" />
              <Text className="text-success font-semibold">Visitor Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}