import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { adminSellerService } from '@/services/admin-seller';
import { SellerStatus } from '@/types/seller';
import SellersClient from './client';

export default async function AdminSellersPage() {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['admin-sellers', SellerStatus.PENDING_ADMIN_APPROVAL, ''],
        queryFn: () => adminSellerService.getSellers({ status: SellerStatus.PENDING_ADMIN_APPROVAL }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SellersClient />
        </HydrationBoundary>
    );
}
