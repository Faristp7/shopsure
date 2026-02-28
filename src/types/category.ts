export interface Category {
    id: string;
    name: string;
    description?: string;
    slug?: string;
    imageUrl?: string;
    isActive: boolean;
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
}

export interface ListCategoriesResponse {
    items: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
