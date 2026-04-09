"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  useEffect(() => {
    console.error("404 Error: Page not found");
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-foreground">404</h1>
        <p className="mb-8 text-lg text-muted-foreground">We couldn't find the page you're looking for.</p>
        <Link href="/">
          <Button className="rounded-full px-8 gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
