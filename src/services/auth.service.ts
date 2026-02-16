import { apiService } from './api';
import { AuthResponse } from '@/types/auth';

export const authService = {
    login: async (data: any) => {
        return apiService.post<AuthResponse>('v1/auth/admin/login', data);
    },

    logout: async () => {
        return apiService.post('v1/auth/logout');
    },

    refreshToken: async (refreshToken: string) => {
        return apiService.post<{ accessToken: string, refreshToken: string }>('v1/auth/refresh', { refreshToken });
    }
};
