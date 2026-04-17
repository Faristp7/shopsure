import { apiService } from './api';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'USER' | 'SELLER' | 'ADMIN';
  isActive: boolean;
  isVerified: boolean;
  joinedAt: string;
  ordersCount: number;
}

const BASE = 'v1/admin/users';

export const adminUsersService = {
  getUsers(page = 1, search?: string, role?: string): Promise<{ data: AdminUserRecord[]; total: number; totalPages: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (search) q.set('search', search);
    if (role) q.set('role', role);
    return apiService.get(`${BASE}?${q}`);
  },

  getUser(userId: string): Promise<AdminUserRecord> {
    return apiService.get(`${BASE}/${userId}`);
  },

  suspendUser(userId: string): Promise<AdminUserRecord> {
    return apiService.post(`${BASE}/${userId}/suspend`);
  },

  activateUser(userId: string): Promise<AdminUserRecord> {
    return apiService.post(`${BASE}/${userId}/activate`);
  },

  deleteUser(userId: string): Promise<void> {
    return apiService.delete(`${BASE}/${userId}`);
  },
};
