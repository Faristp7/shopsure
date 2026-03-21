"use client";

import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, setShowLogin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) {
      const search =
        typeof window !== "undefined" ? window.location.search : "";
      const returnPath = pathname + search;
      router.replace(
        `/?callbackUrl=${encodeURIComponent(returnPath)}`,
      );
      setShowLogin(true);
    }
  }, [isLoggedIn, router, setShowLogin, pathname]);

  if (!isLoggedIn) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
