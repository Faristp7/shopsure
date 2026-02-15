// 'use client'; is not needed here if we are importing this in a layout.tsx which is a server component by default, BUT context providers must be client components.
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { getQueryClient } from '@/lib/query-client';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    // NOTE: Avoid useState when initializing the query client if you don't
    // have a suspense boundary between this component and the code that may
    // suspend because React will throw away the client on the initial
    // render if it suspends and there is no boundary
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
