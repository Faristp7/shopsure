import { apiService } from "./api";

export interface SellerSettings {
  account: {
    name: string;
    email: string;
    mobile: string;
    emailVerified: boolean;
    mobileVerified: boolean;
    status: string;
  };
  brand: {
    brandName: string;
    brandDescription: string;
    instagramUrl: string;
    logoUrl: string;
    publicEmail: string;
    publicPhone: string;
  };
  business: {
    businessType: string;
    legalBusinessName: string;
    panNumber: string;
    gstRegistered: boolean;
    gstNumber: string;
    businessRegistrationNumber: string | null;
  };
  pickupAddress: {
    addressLine1: string;
    addressLine2: string;
    landmark: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    bankAccountNumberMasked: string;
    ifscCode: string;
    upiId: string;
  };
}

export const sellerSettingsService = {
  getSettings: () => apiService.get<SellerSettings>("/v1/seller/settings"),
};
