import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { getGatesApi } from "@/api/auth";

const schema = z.object({
  companyCode: z.string().min(1, "Company code is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  gateId: z.number({ invalid_type_error: "Please select a gate" }),
});

type FormData = z.infer<typeof schema>;

interface GateOption {
  id: number;
  name: string;
}

export default function LoginScreen() {
  const { login, isSignedIn } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gates, setGates] = useState<GateOption[]>([]);
  const [gatesLoading, setGatesLoading] = useState(false);
  const [showGateDropdown, setShowGateDropdown] = useState(false);
  const [selectedGateName, setSelectedGateName] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyCode: "",
      username: "",
      password: "",
    },
  });

  const companyCode = watch("companyCode");

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(app)/dashboard");
    }
  }, [isSignedIn]);

  // Fetch gates when company code is entered (debounced)
  useEffect(() => {
    if (companyCode.trim().length < 2) {
      setGates([]);
      return;
    }
    const timer = setTimeout(() => {
      fetchGates(companyCode.trim());
    }, 600);
    return () => clearTimeout(timer);
  }, [companyCode]);

  const fetchGates = async (code: string) => {
    setGatesLoading(true);
    try {
      const result = await getGatesApi(code);
      if (result.success && result.data) {
        setGates(result.data);
      } else {
        setGates([]);
      }
    } catch {
      setGates([]);
    } finally {
      setGatesLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await login(
        data.companyCode,
        data.username,
        data.password,
        data.gateId
      );
      if (result.success) {
        router.replace("/(app)/dashboard");
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: result.message || "Invalid credentials",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center pt-16 pb-10 px-6">
            <View className="w-20 h-20 rounded-2xl bg-primary items-center justify-center mb-4">
              <Ionicons name="shield-checkmark" size={40} color="#fff" />
            </View>
            <Text className="text-text-primary text-2xl font-bold">
              MSN Gate Management
            </Text>
            <Text className="text-text-secondary text-sm mt-1">
              Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 gap-4">
            {/* Company Code */}
            <View>
              <Text className="text-text-secondary text-xs font-semibold mb-1 uppercase tracking-wide">
                Company Code
              </Text>
              <Controller
                control={control}
                name="companyCode"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-14">
                    <Ionicons
                      name="business-outline"
                      size={18}
                      color="#64748B"
                    />
                    <TextInput
                      className="flex-1 ml-3 text-text-primary text-base"
                      placeholder="Enter company code"
                      placeholderTextColor="#64748B"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="characters"
                    />
                    {gatesLoading && (
                      <ActivityIndicator size="small" color="#3B82F6" />
                    )}
                  </View>
                )}
              />
              {errors.companyCode && (
                <Text className="text-error text-xs mt-1">
                  {errors.companyCode.message}
                </Text>
              )}
            </View>

            {/* Gate Dropdown */}
            <View>
              <Text className="text-text-secondary text-xs font-semibold mb-1 uppercase tracking-wide">
                Gate
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-14"
                onPress={() => {
                  if (gates.length > 0) setShowGateDropdown(!showGateDropdown);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="git-merge-outline" size={18} color="#64748B" />
                <Text
                  className={`flex-1 ml-3 text-base ${
                    selectedGateName ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {selectedGateName || "Select gate"}
                </Text>
                <Ionicons
                  name={showGateDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>

              {/* Dropdown list */}
              {showGateDropdown && gates.length > 0 && (
                <View className="bg-surface border border-border rounded-xl mt-1 overflow-hidden">
                  {gates.map((gate) => (
                    <TouchableOpacity
                      key={gate.id}
                      className="px-4 py-3 border-b border-border last:border-b-0"
                      onPress={() => {
                        setValue("gateId", gate.id, {
                          shouldValidate: true,
                        });
                        setSelectedGateName(gate.name);
                        setShowGateDropdown(false);
                      }}
                    >
                      <Text className="text-text-primary text-sm">
                        {gate.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {gates.length === 0 && companyCode.length >= 2 && !gatesLoading && (
                <Text className="text-text-muted text-xs mt-1">
                  No gates found for this company code
                </Text>
              )}
              {errors.gateId && (
                <Text className="text-error text-xs mt-1">
                  {errors.gateId.message}
                </Text>
              )}
            </View>

            {/* Username */}
            <View>
              <Text className="text-text-secondary text-xs font-semibold mb-1 uppercase tracking-wide">
                Username
              </Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-14">
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color="#64748B"
                    />
                    <TextInput
                      className="flex-1 ml-3 text-text-primary text-base"
                      placeholder="Enter username"
                      placeholderTextColor="#64748B"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                    />
                  </View>
                )}
              />
              {errors.username && (
                <Text className="text-error text-xs mt-1">
                  {errors.username.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View>
              <Text className="text-text-secondary text-xs font-semibold mb-1 uppercase tracking-wide">
                Password
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-14">
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color="#64748B"
                    />
                    <TextInput
                      className="flex-1 ml-3 text-text-primary text-base"
                      placeholder="Enter password"
                      placeholderTextColor="#64748B"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text className="text-error text-xs mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary rounded-xl h-14 items-center justify-center mt-2"
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-bold">Login</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center pb-8 pt-6">
            <Text className="text-text-muted text-xs">
              MSN Gate Management System v1.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}