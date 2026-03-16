import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { adminProductService } from '@/services/admin-product.service';
import AdminProductsClient from './client';

export default async function AdminProductsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['admin-products', { page: 1, limit: 10 }],
    queryFn: () =>
      adminProductService.listProducts({
        page: 1,
        limit: 10,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminProductsClient />
    </HydrationBoundary>
  );
}
