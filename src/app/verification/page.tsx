import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { apiService } from '@/services/api';
import VerificationClient from './client';

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export default async function VerificationPage() {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['posts'],
        queryFn: () => apiService.get<Post>('https://jsonplaceholder.typicode.com/posts/1'),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="p-10">
                <h1 className="text-2xl font-bold mb-4">Verification Page</h1>
                <p className="mb-4">
                    This page verifies that SSR hydration works correctly for SEO.
                    The data below should be visible in the page source.
                </p>
                <VerificationClient />
            </div>
        </HydrationBoundary>
    );
}
