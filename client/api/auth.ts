import api from "./index";
import type { LoginResponse, ApiResponse } from "@/types";

export const loginApi = async (
  companyCode: string,
  username: string,
  password: string,
  gateId: number
): Promise<ApiResponse<LoginResponse>> => {
  const { data } = await api.post("/auth/login", {
    companyCode,
    username,
    password,
    gateId,
  });
  return data;
};

export const getMeApi = async (): Promise<ApiResponse<LoginResponse["user"]>> => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const getGatesApi = async (
  companyCode: string
): Promise<ApiResponse<{ id: number; name: string }[]>> => {
  const { data } = await api.get(`/auth/gates?companyCode=${companyCode}`);
  return data;
};