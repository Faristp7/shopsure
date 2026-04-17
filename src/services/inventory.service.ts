import { apiService } from './api';

export interface InventoryItem {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastUpdated: string;
}

export interface StockHistory {
  id: string;
  sku: string;
  productTitle: string;
  changeType: 'SALE' | 'RESTOCK' | 'ADJUSTMENT' | 'RETURN';
  quantityChange: number;
  stockAfter: number;
  note: string | null;
  createdAt: string;
}

export interface AdjustStockInput {
  productId: string;
  quantity: number;
  note?: string;
}

export interface InventorySettings {
  lowStockAlerts: boolean;
  lowStockThreshold: number;
  autoHideOutOfStock: boolean;
}

const BASE = 'v1/seller/inventory';

export const inventoryService = {
  getInventory(page = 1, status?: string, search?: string): Promise<{ data: InventoryItem[]; total: number; totalPages: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    if (search) q.set('search', search);
    return apiService.get(`${BASE}?${q}`);
  },

  adjustStock(input: AdjustStockInput): Promise<InventoryItem> {
    return apiService.post(`${BASE}/adjust`, input);
  },

  getHistory(page = 1): Promise<{ data: StockHistory[]; total: number }> {
    return apiService.get(`${BASE}/history?page=${page}`);
  },

  getSettings(): Promise<InventorySettings> {
    return apiService.get(`${BASE}/settings`);
  },

  updateSettings(settings: Partial<InventorySettings>): Promise<InventorySettings> {
    return apiService.put(`${BASE}/settings`, settings);
  },
};
