import { ListCategoriesResponse } from "@/types/category";
import { apiService } from "./api";

/** Query params accepted by `GET v1/seller/categories` (stricter than admin). */
export type SellerListCategoriesQuery = {
    page?: number;
    limit?: number;
    search?: string;
    rootsOnly?: boolean;
};

export const sellerCategoryService = {
    getCategories: async (params?: SellerListCategoriesQuery) => {
        const searchParams = new URLSearchParams();

        if (params?.rootsOnly !== undefined) searchParams.append('rootsOnly', params.rootsOnly.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());

        const queryString = searchParams.toString();
        const url = `v1/seller/categories${queryString ? `?${queryString}` : ''}`;

        return apiService.get<ListCategoriesResponse>(url);
    },
};