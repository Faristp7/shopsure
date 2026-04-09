import { apiService } from './api';

export interface ServerCartItem {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  price: string;
  originalPrice: string | null;
  quantity: number;
  variant: string | undefined;
  image: string | null;
  stock: number;
  isAvailable: boolean;
}

export interface ServerCartResponse {
  id: string | null;
  items: ServerCartItem[];
  total: number;
  itemCount: number;
}

export interface GuestCartItemPayload {
  productId: string;
  quantity: number;
  variant?: string;
}

const BASE = '/v1/buyer/cart';

export const cartService = {
  getCart(): Promise<ServerCartResponse> {
    return apiService.get<ServerCartResponse>(BASE);
  },

  addItem(productId: string, quantity: number, variant?: string): Promise<ServerCartResponse> {
    return apiService.post<ServerCartResponse>(`${BASE}/items`, {
      productId,
      quantity,
      variant: variant || undefined,
    });
  },

  updateItem(itemId: string, quantity: number): Promise<ServerCartResponse> {
    return apiService.patch<ServerCartResponse>(`${BASE}/items/${itemId}`, { quantity });
  },

  removeItem(itemId: string): Promise<ServerCartResponse> {
    return apiService.delete<ServerCartResponse>(`${BASE}/items/${itemId}`);
  },

  clearCart(): Promise<ServerCartResponse> {
    return apiService.delete<ServerCartResponse>(BASE);
  },

  mergeCart(items: GuestCartItemPayload[]): Promise<ServerCartResponse> {
    return apiService.post<ServerCartResponse>(`${BASE}/merge`, { items });
  },
};
