import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('accessToken')?.value;

    // Admin Route Protection
    if (path.startsWith('/admin')) {
        let userRole: string | null = null;

        if (token) {
            try {
                const decoded = decodeJwt(token);
                userRole = decoded.role as string;
            } catch (e) {
                // Invalid token
            }
        }

        // 1. If trying to access login page AND already logged in as ADMIN -> Redirect to Dashboard
        if (path === '/admin/auth') {
            if (userRole === 'ADMIN') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            // Allow access to login page if not logged in or not admin
            return NextResponse.next();
        }

        // 2. If trying to access protected admin routes AND (not logged in OR not ADMIN) -> Redirect to Login
        if (userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/auth', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/seller/:path*',
    ],
}
