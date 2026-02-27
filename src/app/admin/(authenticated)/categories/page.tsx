import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { adminCategoryService } from '@/services/admin-category';
import CategoriesClient from './client';

export default async function AdminCategoriesPage() {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['admin-categories', ''],
        queryFn: () => adminCategoryService.getCategories(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CategoriesClient />
        </HydrationBoundary>
    );
}
