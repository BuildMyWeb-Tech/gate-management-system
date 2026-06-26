// Protected shell — redirects to login if not authenticated
// Full guard logic implemented in Phase 3
import { Stack } from "expo-router";

export default function AppLayout() {
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