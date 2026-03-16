"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, setShowLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/user");
      setShowLogin(true);
    }
  }, [isLoggedIn, router, setShowLogin]);

  if (!isLoggedIn) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
