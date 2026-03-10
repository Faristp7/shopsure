import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("accessToken")?.value;

  let userRole: string | null = null;
  let sellerStatus: string | null = null;
  if (token) {
    try {
      const decoded = decodeJwt(token);
      userRole = decoded.role as string;
      sellerStatus = decoded.status as string;
    } catch (e) {
      // Invalid token
    }
  }

  // Admin Route Protection
  if (path.startsWith("/admin")) {
    // 1. If trying to access login page AND already logged in as ADMIN -> Redirect to Dashboard
    if (path === "/admin/auth") {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // 2. If trying to access protected admin routes AND (not logged in OR not ADMIN) -> Redirect to Login
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
  }

  // Seller Route Protection
  if (path.startsWith("/seller")) {
    // 1. Landing page /seller: If already logged in as SELLER -> Redirect to logic
    if (path === "/seller") {
      if (userRole === "SELLER") {
        if (sellerStatus === "ONBOARDING_INCOMPLETE") {
          return NextResponse.redirect(new URL("/seller/onboarding", request.url));
        }
        return NextResponse.redirect(new URL("/seller/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // 2. Protected seller routes: If not logged in OR not SELLER -> Redirect to Landing/Login
    // Note: We exclude static assets and basic public seller paths if any
    if (userRole !== "SELLER") {
      return NextResponse.redirect(new URL("/seller", request.url));
    }

    // 3. User is SELLER. Handle Onboarding routing logic.
    if (sellerStatus === "ONBOARDING_INCOMPLETE") {
      // If not already on onboarding page, force them to onboarding
      if (path !== "/seller/onboarding") {
        return NextResponse.redirect(new URL("/seller/onboarding", request.url));
      }
    } else {
      // If Onboarding is COMPLETE, prevent them from accessing the onboarding page
      if (path === "/seller/onboarding") {
        return NextResponse.redirect(new URL("/seller/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*"],
};
