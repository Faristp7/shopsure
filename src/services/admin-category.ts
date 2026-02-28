import { apiService } from './api';
import { Category, ListCategoriesQuery, ListCategoriesResponse } from '@/types/category';

export const adminCategoryService = {
    getCategories: async (params?: ListCategoriesQuery) => {
        const searchParams = new URLSearchParams();

        if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());

        const queryString = searchParams.toString();
        const url = `v1/admin/categories${queryString ? `?${queryString}` : ''}`;

        return apiService.get<ListCategoriesResponse>(url);
    },

    getCategoryById: async (id: string) => {
        return apiService.get<Category>(`v1/admin/categories/${id}`);
    },

    createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
        return apiService.post<Category>('v1/admin/categories', data);
    },

    updateCategory: async (id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => {
        return apiService.put<Category>(`v1/admin/categories/${id}`, data);
    },

    deleteCategory: async (id: string) => {
        return apiService.delete<void>(`v1/admin/categories/${id}`);
    }
};
