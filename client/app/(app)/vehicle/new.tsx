import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NewVehicleScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold">New Vehicle</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-text-secondary">Phase 6</Text>
      </View>
    </SafeAreaView>
  );
}