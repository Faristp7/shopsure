import { apiService } from "./api";

export interface OnboardingSubmitData {
  brand_name: string;
  brand_description: string;
  instagram_url?: string;
  logo_url?: string;
  public_email: string;
  public_phone: string;
  business_type: string;
  legal_business_name: string;
  pan_number: string;
  gst_registered: boolean;
  gst_number?: string;
  business_registration_number?: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  confirm_account_number: string;
  upi_id?: string;
  agreed_terms: boolean;
  agreed_commission: boolean;
  agreed_authenticity: boolean;
  agreed_return_policy: boolean;
}

export const sellerOnboardingService = {
  submit: async (data: OnboardingSubmitData) => {
    return apiService.post("/v1/seller/onboarding/submit", data);
  },
};
