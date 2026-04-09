import { apiService } from './api';
import type { ListCategoriesResponse } from '@/types/category';

export type BuyerListCategoriesQuery = {
  search?: string;
  parentId?: string;
  rootsOnly?: boolean;
  page?: number;
  limit?: number;
};

export const buyerCategoryService = {
  getCategories: async (
    params?: BuyerListCategoriesQuery,
  ): Promise<ListCategoriesResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append('search', params.search);
    if (params?.parentId) searchParams.append('parentId', params.parentId);
    if (params?.rootsOnly !== undefined)
      searchParams.append('rootsOnly', params.rootsOnly.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = `/v1/buyer/categories${queryString ? `?${queryString}` : ''}`;

    return apiService.get<ListCategoriesResponse>(url);
  },
};
