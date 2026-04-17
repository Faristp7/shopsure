import { apiService } from './api';

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';

export interface DisputeMessage {
  id: string;
  authorName: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  body: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  resolution: string | null;
  refundAmount: string | null;
  messages: DisputeMessage[];
  createdAt: string;
  updatedAt: string;
}

const BASE = 'v1/admin/disputes';

export const disputesService = {
  getDisputes(page = 1, status?: DisputeStatus, search?: string): Promise<{ data: Dispute[]; total: number; totalPages: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    if (search) q.set('search', search);
    return apiService.get(`${BASE}?${q}`);
  },

  getDispute(disputeId: string): Promise<Dispute> {
    return apiService.get(`${BASE}/${disputeId}`);
  },

  replyToDispute(disputeId: string, message: string): Promise<Dispute> {
    return apiService.post(`${BASE}/${disputeId}/reply`, { message });
  },

  resolveDispute(disputeId: string, resolution: string, refundAmount?: string): Promise<Dispute> {
    return apiService.post(`${BASE}/${disputeId}/resolve`, { resolution, refundAmount });
  },

  escalateDispute(disputeId: string): Promise<Dispute> {
    return apiService.post(`${BASE}/${disputeId}/escalate`);
  },

  closeDispute(disputeId: string): Promise<Dispute> {
    return apiService.post(`${BASE}/${disputeId}/close`);
  },
};
