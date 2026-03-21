import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import {
  getSafeCallbackUrlForAdmin,
  getSafeCallbackUrlForSeller,
} from "@/lib/safe-callback-url";

const MAX_CALLBACK_LEN = 2048;

type SellerStatus =
  | "PENDING_EMAIL_VERIFICATION"
  | "ONBOARDING_INCOMPLETE"
  | "PENDING_ADMIN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

function redirectToLoginWithCallback(
  request: NextRequest,
  loginPath: string,
) {
  const url = new URL(loginPath, request.url);
  const returnPath = request.nextUrl.pathname + request.nextUrl.search;
  const safeReturn =
    returnPath.length > MAX_CALLBACK_LEN
      ? request.nextUrl.pathname
      : returnPath;
  url.searchParams.set("callbackUrl", safeReturn);
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("accessToken")?.value;

  let userRole: string | null = null;
  let sellerStatus: SellerStatus | null = null;
  if (token) {
    try {
      const decoded = decodeJwt(token);
      userRole = decoded.role as string;
      sellerStatus = decoded.status as SellerStatus;
    } catch (e) {
      // Invalid token
    }
  }

  // Admin Route Protection
  if (path.startsWith("/admin")) {
    // 1. If trying to access login page AND already logged in as ADMIN -> Redirect to Dashboard or callback
    if (path === "/admin" || path === "/admin/auth") {
      if (userRole === "ADMIN") {
        const raw = request.nextUrl.searchParams.get("callbackUrl");
        const target = getSafeCallbackUrlForAdmin(raw, "/admin/dashboard");
        return NextResponse.redirect(new URL(target, request.url));
      }
      return NextResponse.next();
    }

    // 2. If trying to access protected admin routes AND (not logged in OR not ADMIN) -> Redirect to Login
    if (userRole !== "ADMIN") {
      return redirectToLoginWithCallback(request, "/admin/auth");
    }
  }

  // Seller Route Protection
  if (path.startsWith("/seller")) {
    // 1. Landing page /seller: If already logged in as SELLER -> Redirect to logic
    if (path === "/seller") {
      if (userRole === "SELLER") {
        if (sellerStatus === "ONBOARDING_INCOMPLETE" || sellerStatus === "PENDING_ADMIN_APPROVAL") {
          return NextResponse.redirect(new URL("/seller/onboarding", request.url));
        }
        const raw = request.nextUrl.searchParams.get("callbackUrl");
        const target = getSafeCallbackUrlForSeller(raw, "/seller/dashboard");
        return NextResponse.redirect(new URL(target, request.url));
      }
      return NextResponse.next();
    }

    // 2. Protected seller routes: If not logged in OR not SELLER -> Redirect to Landing/Login
    // Note: We exclude static assets and basic public seller paths if any
    if (userRole !== "SELLER") {
      return redirectToLoginWithCallback(request, "/seller");
    }

    // 3. User is SELLER. Handle Onboarding routing logic.
    if (sellerStatus === "ONBOARDING_INCOMPLETE") {
      // If not already on onboarding page, force them to onboarding
      if (path !== "/seller/onboarding") {
        return NextResponse.redirect(new URL("/seller/onboarding", request.url));
      }
    } else if (sellerStatus === "PENDING_ADMIN_APPROVAL") {
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
  matcher: ["/admin", "/admin/:path*", "/seller", "/seller/:path*"],
};
