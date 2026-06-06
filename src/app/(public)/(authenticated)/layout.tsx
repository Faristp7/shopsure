"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isInitialized, setShowLogin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      // Save current pathname to return to after login
      localStorage.setItem("auth_redirect", pathname);
      // Trigger login modal
      setShowLogin(true);
      // Redirect to home page
      router.push("/");
    }
  }, [isInitialized, isLoggedIn, pathname, router, setShowLogin]);

  if (!isInitialized) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will trigger redirect in useEffect
  }

  return <>{children}</>;
}