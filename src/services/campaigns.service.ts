import { apiService } from './api';

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
export type CampaignType = 'FLASH_SALE' | 'SEASONAL' | 'CLEARANCE' | 'BUNDLE' | 'LOYALTY';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  discountPercent: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  productCount: number;
  totalRevenue: number | null;
  createdAt: string;
}

export interface CreateCampaignInput {
  name: string;
  type: CampaignType;
  discountPercent: number;
  startDate: string;
  endDate: string;
  productIds: string[];
}

const BASE = 'v1/admin/campaigns';

export const campaignsService = {
  getCampaigns(page = 1, status?: CampaignStatus): Promise<{ data: Campaign[]; total: number; totalPages: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    return apiService.get(`${BASE}?${q}`);
  },

  getCampaign(campaignId: string): Promise<Campaign> {
    return apiService.get(`${BASE}/${campaignId}`);
  },

  createCampaign(input: CreateCampaignInput): Promise<Campaign> {
    return apiService.post(BASE, input);
  },

  updateCampaign(campaignId: string, input: Partial<CreateCampaignInput>): Promise<Campaign> {
    return apiService.patch(`${BASE}/${campaignId}`, input);
  },

  cancelCampaign(campaignId: string): Promise<Campaign> {
    return apiService.post(`${BASE}/${campaignId}/cancel`);
  },

  deleteCampaign(campaignId: string): Promise<void> {
    return apiService.delete(`${BASE}/${campaignId}`);
  },
};
