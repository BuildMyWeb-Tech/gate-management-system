// Rewritten from OTT AuthContext.tsx
// Key changes: SecureStore instead of AsyncStorage, GMS login fields
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginApi, getMeApi } from "@/api/auth";
import { saveToken, saveUser, clearAuth, getToken, getUser } from "@/utils/storage";
import type { User, LoginResponse } from "@/types";

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
    try {
      const result = await loginApi(companyCode, username, password, gateId);
      if (result.success && result.data) {
        await saveToken(result.data.token);
        await saveUser(result.data.user);
        setToken(result.data.token);
        setUser(result.data.user);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const result = await getMeApi();
      if (result.success && result.data) {
        setUser(result.data);
        await saveUser(result.data);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
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