import { apiService } from './api';

export type DiscountType = 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
export type CouponStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

export interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  startDate: string | null;
  endDate: string | null;
  status: CouponStatus;
  createdAt: string;
}

export interface CreateCouponInput {
  code: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  startDate?: string;
  endDate?: string;
}

const BASE = 'v1/admin/coupons';

export const couponsService = {
  getCoupons(page = 1, status?: CouponStatus, search?: string): Promise<{ data: Coupon[]; total: number; totalPages: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    if (search) q.set('search', search);
    return apiService.get(`${BASE}?${q}`);
  },

  createCoupon(input: CreateCouponInput): Promise<Coupon> {
    return apiService.post(BASE, input);
  },

  updateCoupon(couponId: string, input: Partial<CreateCouponInput>): Promise<Coupon> {
    return apiService.patch(`${BASE}/${couponId}`, input);
  },

  deactivateCoupon(couponId: string): Promise<Coupon> {
    return apiService.post(`${BASE}/${couponId}/deactivate`);
  },

  deleteCoupon(couponId: string): Promise<void> {
    return apiService.delete(`${BASE}/${couponId}`);
  },
};
