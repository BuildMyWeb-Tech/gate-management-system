import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "gms_token";
const USER_KEY = "gms_user";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const saveUser = async (user: object) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getUser = async <T>(): Promise<T | null> => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
};

export const removeUser = async () => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

export const clearAuth = async () => {
  await Promise.all([removeToken(), removeUser()]);
};