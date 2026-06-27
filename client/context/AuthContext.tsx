// MOCK MODE — Oracle SP will be wired in later
// Login accepts any company code + username + password + gate
// and returns a mock user so all screens are accessible
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { saveToken, saveUser, clearAuth, getToken, getUser } from "@/utils/storage";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isSignedIn: boolean;
  isLoading: boolean;
  login: (
    companyCode: string,
    username: string,
    password: string,
    gateId: number
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_TOKEN = "mock_jwt_token_gms_2026";

const buildMockUser = (
  companyCode: string,
  username: string,
  gateId: number
): User => ({
  id: 1,
  username,
  name: username.charAt(0).toUpperCase() + username.slice(1),
  role: "admin",
  companyCode: companyCode.toUpperCase(),
  gateId,
  gateName: `Gate ${gateId}`,
  permissions: ["VISITOR_VIEW", "VISITOR_ADD", "VEHICLE_VIEW", "VEHICLE_ADD"],
});
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await getToken();
      const storedUser = await getUser<User>();
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to load stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    companyCode: string,
    username: string,
    password: string,
    gateId: number
  ) => {
    // Basic validation only — no Oracle call yet
    if (!companyCode.trim() || !username.trim() || !password.trim()) {
      return { success: false, message: "All fields are required" };
    }
    if (!gateId) {
      return { success: false, message: "Please select a gate" };
    }

    const mockUser = buildMockUser(companyCode, username, gateId);
    await saveToken(MOCK_TOKEN);
    await saveUser(mockUser);
    setToken(MOCK_TOKEN);
    setUser(mockUser);
    return { success: true };
  };

  const logout = async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    // No-op in mock mode
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isSignedIn: !!token,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}