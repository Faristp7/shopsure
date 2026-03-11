export interface AdminUser {
    id: string;
    role: 'ADMIN' | 'USER' | 'SELLER';
    email: string;
    phone: string | null;
    isActive: boolean;
    isVerified: boolean;
}

type RedirectType =
  | 'verify-email'
  | 'onboarding'
  | 'waiting-approval'
  | 'dashboard'
  | 'rejected';

export interface Seller {
    id: string;
    status: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    seller: Seller;
    redirectTo: RedirectType;
}

export interface AuthResponse {
    user: AdminUser;
    accessToken: string;
    refreshToken: string;
}
