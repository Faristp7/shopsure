import { apiService } from './api';
import { CreateProductPayload } from '@/types/product';

export const sellerProductService = {
  createProduct: async (data: CreateProductPayload) => {
    return apiService.post('/v1/seller/products', data);
  },
};
