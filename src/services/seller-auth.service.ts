import { apiService } from "./api";
import { AuthResponse } from "@/types/auth";

export const sellerAuthService = {
  register: async (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
  }) => {
    return apiService.post("/v1/seller/auth/register", data);
  },

  login: async (data: any) => {
    return apiService.post<AuthResponse>("/v1/seller/auth/login", data);
  },

  verifyEmailOtp: async (data: { email: string; otp: string }) => {
    return apiService.post<AuthResponse>(
      "/v1/seller/auth/verify-email-otp",
      data,
    );
  },

  getProfile: async () => {
    return apiService.get<any>("/v1/seller/profile");
  },
};
