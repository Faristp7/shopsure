import { apiService } from "./api";

export type DiscountType = "FIXED_AMOUNT" | "PERCENTAGE";
export type CouponStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: DiscountType;
  value: number;
  minimumOrderValue: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  status: CouponStatus;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CouponsListResponse {
  items: Coupon[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCouponInput {
  code: string;
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  minimumOrderValue?: number;
  usageLimit?: number;
  startsAt?: string;
  expiresAt?: string;
}

export interface ValidateCouponInput {
  code: string;
  orderAmount: number;
}

export interface CouponValidationResult {
  code: string;
  couponId: string;
  couponName: string;
  type: DiscountType;
  value: number;
  orderAmount: number;
  discountAmount: number;
  finalAmount: number;
  minimumOrderValue: number | null;
  expiresAt: string | null;
}

const ADMIN_BASE = "/v1/admin/coupons";
const PUBLIC_BASE = "/v1/coupons";

export const couponsService = {
  getCoupons(params?: {
    page?: number;
    limit?: number;
    status?: CouponStatus;
    search?: string;
  }): Promise<CouponsListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiService.get<CouponsListResponse>(`${ADMIN_BASE}${suffix}`);
  },

  getCoupon(couponId: string): Promise<Coupon> {
    return apiService.get<Coupon>(`${ADMIN_BASE}/${couponId}`);
  },

  createCoupon(input: CreateCouponInput): Promise<Coupon> {
    return apiService.post<Coupon>(ADMIN_BASE, input);
  },

  updateCoupon(
    couponId: string,
    input: Partial<CreateCouponInput>,
  ): Promise<Coupon> {
    return apiService.patch<Coupon>(`${ADMIN_BASE}/${couponId}`, input);
  },

  updateCouponStatus(couponId: string, isActive: boolean): Promise<Coupon> {
    return apiService.patch<Coupon>(`${ADMIN_BASE}/${couponId}/status`, {
      isActive,
    });
  },

  deleteCoupon(couponId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`${ADMIN_BASE}/${couponId}`);
  },

  generateCouponCode(input?: {
    prefix?: string;
    length?: number;
  }): Promise<{ code: string }> {
    return apiService.post<{ code: string }>(`${ADMIN_BASE}/generate`, input);
  },

  validateCoupon(
    input: ValidateCouponInput,
    adminPreview = false,
  ): Promise<CouponValidationResult> {
    const base = adminPreview ? ADMIN_BASE : PUBLIC_BASE;
    return apiService.post<CouponValidationResult>(`${base}/validate`, input);
  },
};
