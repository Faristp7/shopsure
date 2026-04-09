"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const Breadcrumb = ({ label = "Product details" }: { label?: string }) => (
  <nav className="py-4">
    <ol className="flex items-center gap-2 text-sm text-muted-foreground">
      <li>
        <Link href="/" className="hover:text-foreground transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Home
        </Link>
      </li>
      <li className="text-muted-foreground/50">›</li>
      <li className="text-foreground font-semibold">{label}</li>
    </ol>
  </nav>
);

export default Breadcrumb;
