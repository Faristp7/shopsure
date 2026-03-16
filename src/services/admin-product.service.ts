import { apiService } from './api';
import type {
  ListAdminProductsQuery,
  ListAdminProductsResponse,
  AdminProduct,
} from '@/types/product';

export const adminProductService = {
  listProducts: async (
    params?: ListAdminProductsQuery,
  ): Promise<ListAdminProductsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params?.sellerId) searchParams.append('sellerId', params.sellerId);
    if (params?.minPrice != null) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice != null) searchParams.append('maxPrice', params.maxPrice.toString());

    const queryString = searchParams.toString();
    const url = `v1/admin/products${queryString ? `?${queryString}` : ''}`;

    return apiService.get<ListAdminProductsResponse>(url);
  },

  getProductById: async (id: string): Promise<AdminProduct> => {
    return apiService.get<AdminProduct>(`v1/admin/products/${id}`);
  },

  approveProduct: async (id: string): Promise<void> => {
    return apiService.post(`v1/admin/products/${id}/approve`);
  },

  rejectProduct: async (id: string, reason?: string): Promise<void> => {
    return apiService.post(`v1/admin/products/${id}/reject`, { reason });
  },

  disableProduct: async (id: string): Promise<void> => {
    return apiService.post(`v1/admin/products/${id}/disable`);
  },

  enableProduct: async (id: string): Promise<void> => {
    return apiService.post(`v1/admin/products/${id}/enable`);
  },

  deleteProduct: async (id: string): Promise<void> => {
    return apiService.delete(`v1/admin/products/${id}`);
  },
};
