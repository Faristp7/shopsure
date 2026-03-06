export interface Category {
    id: string;
    name: string;
    description?: string;
    slug?: string;
    imageUrl?: string;
    isActive: boolean;
    sortOrder?: number;
    metadata?: {
        seoTitle?: string;
        seoDescription?: string;
    };
    parentId?: string | null;
    parent?: Category;
    subCategories?: Category[];
    createdAt: string;
    updatedAt: string;
}

export interface ListCategoriesQuery {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    rootsOnly?: boolean;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface ListCategoriesResponse {
    items: Category[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
