import { apiService } from "./api";
import { AuthResponse, LoginResponse } from "@/types/auth";
import { OnboardingSubmitData } from "./seller-onboarding.service";
import { SellerStatus } from "@/types/seller";

interface SellerProfileResponse {
  status: SellerStatus;
  rejectionReason: any;
  redirectTo: string;
  onboarding: OnboardingSubmitData | null;
}

export const sellerAuthService = {
  register: async (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
  }) => {
    return apiService.post("/v1/seller/auth/register", data);
  },

  login: async (data: { email: string; password: string }) => {
    return apiService.post<LoginResponse>("/v1/seller/auth/login", data);
  },

  verifyEmailOtp: async (data: { email: string; otp: string }) => {
    return apiService.post<AuthResponse>(
      "/v1/seller/auth/verify-email-otp",
      data,
    );
  },

  getProfile: async () => {
    return apiService.get<SellerProfileResponse>("/v1/seller/onboarding/details");
  },
};
