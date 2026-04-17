import { apiService } from './api';

export type ReturnStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'PICKED_UP' | 'REFUNDED';
export type ReturnReason =
  | 'WRONG_ITEM'
  | 'DAMAGED'
  | 'NOT_AS_DESCRIBED'
  | 'SIZE_FIT'
  | 'CHANGED_MIND'
  | 'OTHER';

export interface ReturnItem {
  orderItemId: string;
  productTitle: string;
  quantity: number;
  unitPrice: string;
}

export interface Return {
  id: string;
  orderId: string;
  status: ReturnStatus;
  reason: ReturnReason;
  description: string;
  images: string[];
  refundAmount: string;
  items: ReturnItem[];
  buyerName: string;
  sellerNote: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReturnInput {
  orderId: string;
  reason: ReturnReason;
  description: string;
  images?: string[];
  items: { orderItemId: string; quantity: number }[];
}

const BUYER_BASE = 'v1/buyer/returns';
const SELLER_BASE = 'v1/seller/returns';
const ADMIN_BASE = 'v1/admin/returns';

export const returnsService = {
  // Buyer
  createReturn(input: CreateReturnInput): Promise<Return> {
    return apiService.post<Return>(BUYER_BASE, input);
  },
  getBuyerReturns(): Promise<Return[]> {
    return apiService.get<Return[]>(BUYER_BASE);
  },
  getBuyerReturn(returnId: string): Promise<Return> {
    return apiService.get<Return>(`${BUYER_BASE}/${returnId}`);
  },

  // Seller
  getSellerReturns(page = 1, status?: ReturnStatus): Promise<{ data: Return[]; total: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    return apiService.get<{ data: Return[]; total: number }>(`${SELLER_BASE}?${q}`);
  },
  approveReturn(returnId: string, note?: string): Promise<Return> {
    return apiService.post<Return>(`${SELLER_BASE}/${returnId}/approve`, { note });
  },
  rejectReturn(returnId: string, note: string): Promise<Return> {
    return apiService.post<Return>(`${SELLER_BASE}/${returnId}/reject`, { note });
  },

  // Admin
  getAdminReturns(page = 1, status?: ReturnStatus): Promise<{ data: Return[]; total: number; totalPages: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    return apiService.get<{ data: Return[]; total: number; totalPages: number }>(`${ADMIN_BASE}?${q}`);
  },
  adminApproveReturn(returnId: string): Promise<Return> {
    return apiService.post<Return>(`${ADMIN_BASE}/${returnId}/approve`);
  },
  adminRejectReturn(returnId: string, reason: string): Promise<Return> {
    return apiService.post<Return>(`${ADMIN_BASE}/${returnId}/reject`, { reason });
  },
  adminProcessRefund(returnId: string): Promise<Return> {
    return apiService.post<Return>(`${ADMIN_BASE}/${returnId}/refund`);
  },
};
