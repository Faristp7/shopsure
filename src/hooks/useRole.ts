'use client';

import { useAuth } from './useAuth';
import { Role } from '@/lib/roles';

export function useRole(requiredRole: Role) {
    const { user, loading } = useAuth();

    const isAuthorized = !loading && user?.role === requiredRole;

    return { isAuthorized, loading };
}
