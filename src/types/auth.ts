export interface AdminUser {
    id: string;
    role: 'ADMIN' | 'USER' | 'SELLER'; // Adjust roles as needed based on your system
    email: string;
    phone: string | null;
    isActive: boolean;
    isVerified: boolean;
}

export interface AuthResponse {
    user: AdminUser;
    accessToken: string;
    refreshToken: string;
}
