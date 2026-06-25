"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Clock } from "lucide-react";
import type { BuyerProduct } from "@/types/product";

interface RecentlyViewedProps {
  currentProductId?: string;
  limit?: number;
}

const STORAGE_KEY = "shopsure_recently_viewed";

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  currentProductId,
  limit = 5,
}) => {
  const [products, setProducts] = useState<BuyerProduct[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: BuyerProduct[] = raw ? JSON.parse(raw) : [];
      
      // Filter out current product if showing on detail page
      const filtered = currentProductId
        ? list.filter((p) => p.id !== currentProductId)
        : list;
        
      setProducts(filtered.slice(0, limit));
    } catch {
      setProducts([]);
    }
  }, [currentProductId, limit]);

  // Track product view if currentProductId & matching product details are loaded
  // (Caller will trigger trackProductView separately or we can listen for product prop updates)
  if (products.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5 space-y-4">
      <div className="flex items-center gap-2 text-foreground font-bold text-sm border-b border-border/40 pb-2.5">
        <Clock className="w-4 h-4 text-primary" />
        <h4>Recently Viewed</h4>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {products.map((p) => {
          const imageUrl =
            Array.isArray(p.images) && p.images.length > 0
              ? p.images.find((img) => img.isCover)?.url ?? p.images[0].url
              : null;
          
          return (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="flex items-center gap-3 shrink-0 bg-secondary/30 hover:bg-secondary/60 p-2.5 rounded-xl border border-border/30 transition-all w-64 group"
            >
              <div className="w-14 h-14 bg-secondary rounded-lg overflow-hidden shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {p.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-bold">
                  ₹{parseFloat(p.price).toFixed(2)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// Utility function to add a product to the list
export const trackProductView = (product: BuyerProduct) => {
  if (typeof window === "undefined" || !product) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list: BuyerProduct[] = raw ? JSON.parse(raw) : [];

    // Filter out duplicates
    list = list.filter((p) => p.id !== product.id);
    
    // Add to front of list
    list.unshift(product);

    // Keep top 10 items max
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 10)));
  } catch (err) {
    console.error("Failed to update recently viewed products", err);
  }
};
