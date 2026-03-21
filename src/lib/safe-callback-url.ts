/**
 * Validates post-login redirect targets to prevent open redirects.
 * Only same-origin relative paths are allowed; role-specific prefixes optional.
 */

const MAX_CALLBACK_LEN = 2048;

function isSafeRelativePath(path: string): boolean {
  if (!path || path.length > MAX_CALLBACK_LEN) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("\\")) return false;
  if (path.includes("://")) return false;
  if (path.includes("@")) return false;
  return true;
}

export function getSafeCallbackUrlForAdmin(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (!raw) return fallback;
  try {
    const decoded = decodeURIComponent(raw);
    if (!isSafeRelativePath(decoded)) return fallback;
    if (!decoded.startsWith("/admin")) return fallback;
    if (decoded === "/admin" || decoded.startsWith("/admin/auth")) {
      return fallback;
    }
    return decoded;
  } catch {
    return fallback;
  }
}

export function getSafeCallbackUrlForSeller(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (!raw) return fallback;
  try {
    const decoded = decodeURIComponent(raw);
    if (!isSafeRelativePath(decoded)) return fallback;
    if (!decoded.startsWith("/seller")) return fallback;
    return decoded;
  } catch {
    return fallback;
  }
}

export function getSafeCallbackUrlForShop(
  raw: string | null | undefined,
  fallback: string,
): string {
  if (!raw) return fallback;
  try {
    const decoded = decodeURIComponent(raw);
    if (!isSafeRelativePath(decoded)) return fallback;
    if (decoded.startsWith("/admin") || decoded.startsWith("/seller")) {
      return fallback;
    }
    return decoded;
  } catch {
    return fallback;
  }
}

export function buildReturnPath(pathname: string, search: string): string {
  return pathname + (search || "");
}

/** After seller login API: onboarding/verification routes override return URL. */
export function resolveSellerPostLoginDestination(
  apiRedirectTo: string,
  callbackUrl: string | null | undefined,
): string {
  if (
    apiRedirectTo === "waiting-approval" ||
    apiRedirectTo === "onboarding" ||
    apiRedirectTo === "rejected"
  ) {
    return "/seller/onboarding";
  }
  if (apiRedirectTo === "verify-email") {
    return "/seller/verify-email";
  }
  return getSafeCallbackUrlForSeller(callbackUrl, "/seller/dashboard");
}
