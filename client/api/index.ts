// Adapted from OTT client/constants/api.ts
// Swapped: AsyncStorage → Expo Secure Store, token key gms_token
import axios from "axios";
import { getToken } from "@/utils/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error shape so callers always get error.response.data.message
    if (!error.response) {
      error.response = {
        data: { success: false, message: "Network error. Check your connection." },
      };
    }
    return Promise.reject(error);
  }
);

export default api;