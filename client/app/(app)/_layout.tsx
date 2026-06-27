import { useEffect } from "react";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function AppLayout() {
  const { isSignedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.replace("/(auth)/login");
    }
  }, [isSignedIn, isLoading]);

  // Show spinner while checking stored token
  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!isSignedIn) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="visitor/list" />
      <Stack.Screen name="visitor/new" />
      <Stack.Screen name="visitor/[id]" />
      <Stack.Screen name="vehicle/list" />
      <Stack.Screen name="vehicle/new" />
      <Stack.Screen name="vehicle/[id]" />
      <Stack.Screen name="setup/gates" />
      <Stack.Screen name="setup/security" />
      <Stack.Screen name="setup/designation" />
      <Stack.Screen name="setup/location" />
      <Stack.Screen name="patrol/index" />
      <Stack.Screen name="users/index" />
    </Stack>
  );
}