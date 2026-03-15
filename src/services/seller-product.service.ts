import { apiService } from './api';
import {
  CreateProductPayload,
  ListSellerProductsQuery,
  ListSellerProductsResponse,
  SellerProduct,
} from '@/types/product';

export const sellerProductService = {
  createProduct: async (data: CreateProductPayload) => {
    return apiService.post('/v1/seller/products', data);
  },

  updateProduct: async (id: string, data: CreateProductPayload) => {
    return apiService.patch(`/v1/seller/products/${id}`, data);
  },

  listProducts: async (
    params?: ListSellerProductsQuery,
  ): Promise<ListSellerProductsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const url = `/v1/seller/products${queryString ? `?${queryString}` : ''}`;

    return apiService.get<ListSellerProductsResponse>(url);
  },

  getProductById: async (id: string): Promise<SellerProduct> => {
    return apiService.get<SellerProduct>(`/v1/buyer/products/${id}`);
  },
};
