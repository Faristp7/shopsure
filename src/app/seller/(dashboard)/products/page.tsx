import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { sellerProductService } from '@/services/seller-product.service';
import ProductsClient from './client';

export default async function ProductsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['seller-products', { page: 1, limit: 20 }],
    queryFn: () =>
      sellerProductService.listProducts({
        page: 1,
        limit: 20,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsClient />
    </HydrationBoundary>
  );
}

