import { apiService } from './api';

export interface WishlistItem {
  id: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  price: string;
  originalPrice: string | null;
  coverImage: string | null;
  sellerName: string;
  isInStock: boolean;
  addedAt: string;
}

const BASE = 'v1/buyer/wishlist';

export const wishlistService = {
  getWishlist(): Promise<WishlistItem[]> {
    return apiService.get<WishlistItem[]>(BASE);
  },

  addToWishlist(productId: string): Promise<WishlistItem> {
    return apiService.post<WishlistItem>(BASE, { productId });
  },

  removeFromWishlist(productId: string): Promise<void> {
    return apiService.delete<void>(`${BASE}/${productId}`);
  },

  isInWishlist(productId: string): Promise<{ inWishlist: boolean }> {
    return apiService.get<{ inWishlist: boolean }>(`${BASE}/${productId}/check`);
  },
};
