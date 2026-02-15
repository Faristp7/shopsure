'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export default function VerificationClient() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: () => apiService.get<Post>('https://jsonplaceholder.typicode.com/posts/1'),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return null;

    return (
        <div className="border p-4 rounded bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold">{data.title}</h2>
            <p className="mt-2">{data.body}</p>
            <div className="mt-4 text-xs text-green-600 font-mono">
                Data fetched successfully via React Query!
            </div>
        </div>
    );
}
