"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { BuyerProduct } from "@/types/product";
import { buyerProductService } from "@/services/buyer-product.service";
import { WishlistButton } from "./WishlistButton";

interface SimilarProductsProps {
  /** The current product — used to derive category for fetching similar items */
  currentProduct: {
    id: string;
    category?: { id: string; name: string; slug: string } | null;
    brand?: string | null;
    title: string;
  };
  /** Optional pre-fetched products (when API provides similar products directly) */
  products?: BuyerProduct[];
  /** Max items to display */
  limit?: number;
}

/**
 * Displays a horizontal scrollable carousel of "Similar Products"
 * based on the current product's category. Falls back to API listing
 * filtered by category. Ready for a dedicated /similar-products API.
 */
export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  currentProduct,
  products: externalProducts,
  limit = 12,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<BuyerProduct[]>(externalProducts || []);
  const [isLoading, setIsLoading] = useState(!externalProducts);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch similar products by category if not externally provided
  useEffect(() => {
    if (externalProducts && externalProducts.length > 0) {
      setProducts(externalProducts);
      setIsLoading(false);
      return;
    }
    if (!currentProduct.category?.id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await buyerProductService.listProducts({
          categoryId: currentProduct.category!.id,
          limit: limit + 1, // fetch extra in case current product is in list
        });
        if (!cancelled) {
          const filtered = res.items.filter((p) => p.id !== currentProduct.id);
          setProducts(filtered.slice(0, limit));
        }
      } catch {
        // Silent fail — section just won't render
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [currentProduct.id, currentProduct.category?.id, externalProducts, limit]);

  // Update scroll button visibility
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 220;
    el.scrollBy({ left: direction === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-muted rounded animate-pulse" />
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-52 shrink-0 space-y-3">
              <div className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Similar Products</h3>
          {currentProduct.category && (
            <span className="text-xs text-muted-foreground ml-1">
              in {currentProduct.category.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scroll-smooth snap-x snap-mandatory"
      >
        {products.map((p) => {
          const imageUrl =
            Array.isArray(p.images) && p.images.length > 0
              ? (p.images.find((img) => img.isCover) ?? p.images[0]).url
              : null;
          const price = parseFloat(p.price);
          const original = p.originalPrice ? parseFloat(p.originalPrice) : null;
          const discountPct =
            original && original > price
              ? Math.round(((original - price) / original) * 100)
              : null;

          return (
            <div
              key={p.id}
              className="w-52 shrink-0 snap-start bg-card rounded-2xl border border-border/40 shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300"
            >
              <Link href={`/product/${p.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  {discountPct && (
                    <span className="absolute top-2 left-2 bg-discount text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {discountPct}% OFF
                    </span>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <WishlistButton productId={p.id} />
                  </div>
                </div>
              </Link>
              <div className="p-3 space-y-1.5">
                <Link href={`/product/${p.id}`}>
                  <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {p.title}
                  </p>
                </Link>
                {p.brand && (
                  <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                )}
                {p.averageRating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-star text-star" />
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {parseFloat(p.averageRating).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      ({p.ratingCount})
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    ₹{price.toFixed(2)}
                  </span>
                  {original && (
                    <span className="text-[11px] text-muted-foreground line-through">
                      ₹{original.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
