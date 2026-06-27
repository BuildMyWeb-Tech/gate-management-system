// MOCK MODE — real API calls disabled until Oracle SPs are ready
import type { ApiResponse } from "@/types";

// Mock gate list — replace with real API call when SP is ready
export const getGatesApi = async (
  _companyCode: string
): Promise<ApiResponse<{ id: number; name: string }[]>> => {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400));
  return {
    success: true,
    data: [
      { id: 1, name: "Main Gate" },
      { id: 2, name: "North Gate" },
      { id: 3, name: "South Gate" },
      { id: 4, name: "Warehouse Gate" },
    ],
  };
};

export const loginApi = async (
  _companyCode: string,
  _username: string,
  _password: string,
  _gateId: number
): Promise<ApiResponse<any>> => {
  return { success: true };
};

export const getMeApi = async (): Promise<ApiResponse<any>> => {
  return { success: true };
};