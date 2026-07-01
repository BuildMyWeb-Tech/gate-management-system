import axios from "axios";
import { getToken, removeToken } from "@/utils/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  console.warn("⚠️ EXPO_PUBLIC_API_URL is not defined.");
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        `📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );

      return config;
    } catch (error) {
      console.error("Request Interceptor Error:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`
    );

    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: "Network error. Please check your internet connection.",
      });
    }

    if (error.response.status === 401) {
      console.warn("Unauthorized - clearing token");
      await removeToken();
    }

    return Promise.reject(
      error.response.data || {
        success: false,
        message: "Something went wrong.",
      }
    );
  }
);

export default api;