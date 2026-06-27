import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

interface DashboardCard {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  bgColor: string;
}

const CARDS: DashboardCard[] = [
  {
    title: "Visitors",
    subtitle: "Manage visitor entries & exits",
    icon: "people-outline",
    route: "/(app)/visitor/list",
    color: "#3B82F6",
    bgColor: "#1E3A8A20",
  },
  {
    title: "Vehicles",
    subtitle: "Manage vehicle entries & exits",
    icon: "car-outline",
    route: "/(app)/vehicle/list",
    color: "#10B981",
    bgColor: "#10B98120",
  },
];

const SETUP_ITEMS = [
  {
    title: "Gates",
    icon: "git-merge-outline" as keyof typeof Ionicons.glyphMap,
    route: "/(app)/setup/gates",
  },
  {
    title: "Security",
    icon: "shield-outline" as keyof typeof Ionicons.glyphMap,
    route: "/(app)/setup/security",
  },
  {
    title: "Locations",
    icon: "location-outline" as keyof typeof Ionicons.glyphMap,
    route: "/(app)/setup/location",
  },
  {
    title: "Designations",
    icon: "briefcase-outline" as keyof typeof Ionicons.glyphMap,
    route: "/(app)/setup/designation",
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-border flex-row items-center justify-between">
        <View>
          <Text className="text-text-primary text-lg font-bold">
            MSN Gate Management
          </Text>
          <Text className="text-text-secondary text-xs mt-0.5">
            {user?.gateName || "Gate"} •{" "}
            <Text className="capitalize">{user?.name || "User"}</Text>
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          {/* Patrol shortcut */}
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-surface items-center justify-center"
            onPress={() => router.push("/(app)/patrol/index")}
          >
            <Ionicons name="walk-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
          {/* Users shortcut */}
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-surface items-center justify-center"
            onPress={() => router.push("/(app)/users/index")}
          >
            <Ionicons name="person-circle-outline" size={20} color="#94A3B8" />
          </TouchableOpacity>
          {/* Logout */}
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-surface items-center justify-center"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main action cards */}
        <View>
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            Operations
          </Text>
          <View className="gap-3">
            {CARDS.map((card) => (
              <TouchableOpacity
                key={card.title}
                onPress={() => router.push(card.route as any)}
                activeOpacity={0.85}
                className="bg-surface border border-border rounded-2xl p-5 flex-row items-center"
              >
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <Ionicons name={card.icon} size={28} color={card.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary text-lg font-bold">
                    {card.title}
                  </Text>
                  <Text className="text-text-secondary text-sm mt-0.5">
                    {card.subtitle}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#475569"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Security Patrol */}
        <View>
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            Patrol
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(app)/patrol/index")}
            activeOpacity={0.85}
            className="bg-surface border border-border rounded-2xl p-5 flex-row items-center"
          >
            <View className="w-14 h-14 rounded-xl items-center justify-center mr-4 bg-amber-500/20">
              <Ionicons name="walk-outline" size={28} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-text-primary text-lg font-bold">
                Security Patrol
              </Text>
              <Text className="text-text-secondary text-sm mt-0.5">
                Log patrol rounds & remarks
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Setup section */}
        <View>
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            Setup
          </Text>
          <View className="bg-surface border border-border rounded-2xl overflow-hidden">
            {SETUP_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.8}
                className={`flex-row items-center px-5 py-4 ${
                  index < SETUP_ITEMS.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <View className="w-9 h-9 rounded-lg bg-surface-2 items-center justify-center mr-4">
                  <Ionicons name={item.icon} size={18} color="#94A3B8" />
                </View>
                <Text className="text-text-primary text-sm font-medium flex-1">
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* User Management */}
        <View>
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            Administration
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(app)/users/index")}
            activeOpacity={0.85}
            className="bg-surface border border-border rounded-2xl p-5 flex-row items-center"
          >
            <View className="w-14 h-14 rounded-xl items-center justify-center mr-4 bg-purple-500/20">
              <Ionicons
                name="people-circle-outline"
                size={28}
                color="#A855F7"
              />
            </View>
            <View className="flex-1">
              <Text className="text-text-primary text-lg font-bold">
                User Management
              </Text>
              <Text className="text-text-secondary text-sm mt-0.5">
                Users, roles & permissions
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}