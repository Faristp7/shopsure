import { apiService } from './api';

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalViews: number;
  viewsChange: number;
  conversionRate: number;
  conversionChange: number;
}

export interface RevenuePoint {
  period: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  views: number;
  orders: number;
  conversionRate: string;
  revenue: string;
}

export interface DeviceStat {
  device: string;
  percentage: number;
  sessions: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
}

export interface SellerAnalytics {
  summary: AnalyticsSummary;
  revenueChart: RevenuePoint[];
  topProducts: TopProduct[];
  deviceStats: DeviceStat[];
  trafficSources: TrafficSource[];
}

// Admin analytics types
export interface AdminAnalyticsSummary {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  activeSellers: number;
  sellersChange: number;
  totalUsers: number;
  usersChange: number;
  pendingApprovals: number;
  openDisputes: number;
}

export interface AdminRevenuePoint {
  month: string;
  revenue: number;
  commission: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  buyerName: string;
  buyerEmail: string;
  total: string;
  status: string;
  createdAt: string;
}

const SELLER_BASE = 'v1/seller/analytics';
const ADMIN_BASE = 'v1/admin/analytics';

export const analyticsService = {
  // Seller
  getSellerAnalytics(days = 30): Promise<SellerAnalytics> {
    return apiService.get<SellerAnalytics>(`${SELLER_BASE}?days=${days}`);
  },

  // Admin
  getAdminSummary(): Promise<AdminAnalyticsSummary> {
    return apiService.get<AdminAnalyticsSummary>(`${ADMIN_BASE}/summary`);
  },
  getAdminRevenueChart(): Promise<AdminRevenuePoint[]> {
    return apiService.get<AdminRevenuePoint[]>(`${ADMIN_BASE}/revenue-chart`);
  },
  getRecentOrders(): Promise<RecentOrder[]> {
    return apiService.get<RecentOrder[]>(`${ADMIN_BASE}/recent-orders`);
  },
};
