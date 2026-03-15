import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { adminProductService } from '@/services/admin-product.service';
import AdminProductsClient from './client';

export default async function AdminProductsPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['admin-products', { status: 'PENDING', page: 1, limit: 50 }],
      queryFn: () =>
        adminProductService.listProducts({
          page: 1,
          limit: 50,
          status: 'PENDING',
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['admin-products', { status: 'PENDING', page: 1, limit: 1 }],
      queryFn: () =>
        adminProductService.listProducts({
          page: 1,
          limit: 1,
          status: 'PENDING',
        }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminProductsClient />
    </HydrationBoundary>
  );
}
