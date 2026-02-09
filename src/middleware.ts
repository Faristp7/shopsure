import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This would typically come from your auth lib, but middleware runs on Edge runtime
// so we might need a separate lightweight auth check or just use session cookies.
// For this template, we'll demonstrate the logic structure.

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Mock auth check - in production use real session/token validation
    // const token = request.cookies.get('session');
    // const userRole = decodeToken(token).role; 

    // For demonstration, let's assume we can't easily get the role in middleware without
    // an actual auth provider setup (like NextAuth). 
    // ensuring the file exists and is ready for logic injection.

    // Example protection logic:

    // if (path.startsWith('/admin') && userRole !== 'admin') {
    //   return NextResponse.redirect(new URL('/auth/login', request.url));
    // }

    // if (path.startsWith('/seller') && userRole !== 'seller') {
    //   return NextResponse.redirect(new URL('/auth/login', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/seller/:path*',
    ],
}
