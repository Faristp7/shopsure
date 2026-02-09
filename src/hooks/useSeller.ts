'use client';

import { useAuth } from './useAuth';

export function useSeller() {
    const { user, loading } = useAuth();

    const isSeller = user?.role === 'seller';

    return { isSeller, loading, sellerId: user?.id };
}
