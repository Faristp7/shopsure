import { apiService } from './api';
import type {
  BuyerProduct,
  BuyerProductDetail,
  ListBuyerProductsQuery,
  ListBuyerProductsResponse,
  SearchBuyerProductsResponse,
} from '@/types/product';

export const buyerProductService = {
  listProducts: async (
    params?: ListBuyerProductsQuery,
  ): Promise<ListBuyerProductsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId);

    const queryString = searchParams.toString();
    const url = `/v1/buyer/products${queryString ? `?${queryString}` : ''}`;

    return apiService.get<ListBuyerProductsResponse>(url);
  },

  getProductById: async (id: string): Promise<BuyerProductDetail> => {
    return apiService.get<BuyerProductDetail>(`/v1/buyer/products/${id}`);
  },

  searchSuggestions: async (q: string, limit = 8): Promise<SearchBuyerProductsResponse> => {
    const params = new URLSearchParams({ q, limit: limit.toString() });
    return apiService.get<SearchBuyerProductsResponse>(`/v1/buyer/products/search?${params}`);
  },
};
