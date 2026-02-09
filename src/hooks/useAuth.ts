'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/auth';

// This is a mock hook. Integrate with your actual auth provider (e.g., NextAuth, Clerk)
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user
        const fetchUser = async () => {
            try {
                // In a client component, you'd typically verify a session token here
                // For now, we'll just set a mock user after a delay
                setTimeout(() => {
                    setUser({
                        id: '1',
                        email: 'user@example.com',
                        role: 'user',
                        name: 'John Doe',
                    });
                    setLoading(false);
                }, 500);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
}
