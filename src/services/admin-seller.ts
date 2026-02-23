import { apiService } from './api';
import { ListSellersQuery, ListSellersResponse } from '@/types/seller';

export const adminSellerService = {
    getSellers: async (params?: ListSellersQuery) => {
        const searchParams = new URLSearchParams();

        if (params?.status) searchParams.append('status', params.status);
        if (params?.search) searchParams.append('search', params.search);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());

        const queryString = searchParams.toString();
        const url = `v1/admin/sellers${queryString ? `?${queryString}` : ''}`;

        return apiService.get<ListSellersResponse>(url);
    },
    getSellerById: async (id: string) => {
        return apiService.get<import('@/types/seller').SellerDetail>(`v1/admin/sellers/${id}`);
    },
};
