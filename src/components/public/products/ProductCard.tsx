import Image from "next/image";
import React from "react";
import type { BuyerProduct } from "@/types/product";
import { RatingStars } from "./RatingStars";
import { DeliveryBadge } from "./DeliveryBadge";
import { WishlistButton } from "./WishlistButton";
import Link from "next/link";
import { Eye, ShoppingCart, Percent } from "lucide-react";

export interface ProductCardLegacyProps {
  id: string;
  brand: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
}

interface ProductCardProps {
  product: BuyerProduct | ProductCardLegacyProps;
  layout?: "grid" | "list";
  onQuickView?: (product: BuyerProduct) => void;
  onAddToCart?: (product: BuyerProduct, e: React.MouseEvent) => void;
}

// Helper to check if it's the legacy prop format
function isLegacyProps(product: any): product is ProductCardLegacyProps {
  return product && typeof product.name === "string" && typeof product.image === "string";
}

function getCoverImage(product: BuyerProduct | ProductCardLegacyProps): string | null {
  if (isLegacyProps(product)) {
    return product.image;
  }
  if (!Array.isArray(product.images) || product.images.length === 0) return null;
  const cover = product.images.find((img) => img.isCover) ?? product.images[0];
  return cover?.url ?? null;
}

function getDiscountPct(product: BuyerProduct | ProductCardLegacyProps): number {
  if (isLegacyProps(product)) return 0;
  const price = parseFloat(product.price);
  const original = product.originalPrice ? parseFloat(product.originalPrice) : null;
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = "grid",
  onQuickView,
  onAddToCart,
}) => {
  const imageUrl = getCoverImage(product);
  const discountPct = getDiscountPct(product);
  const isList = layout === "list";

  // Normalize fields for layout rendering
  const id = isLegacyProps(product) ? product.id : product.id;
  const title = isLegacyProps(product) ? product.name : product.title;
  const brand = product.brand;
  const displayPrice = isLegacyProps(product) 
    ? product.price 
    : `₹${parseFloat(product.price).toFixed(2)}`;
  const originalPrice = !isLegacyProps(product) && product.originalPrice 
    ? `₹${parseFloat(product.originalPrice).toFixed(2)}` 
    : null;
  const rating = isLegacyProps(product) ? product.rating : product.averageRating;
  const reviewsCount = isLegacyProps(product) ? product.reviews : product.ratingCount;
  const status = isLegacyProps(product) ? "ACTIVE" : product.status;
  const categoryName = !isLegacyProps(product) && product.category ? product.category.name : null;

  // Schema structured data markup for Google crawler SEO support
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "image": imageUrl || undefined,
    "brand": brand ? { "@type": "Brand", "name": brand } : undefined,
    "offers": {
      "@type": "Offer",
      "priceCurrency": isLegacyProps(product) ? "USD" : "INR",
      "price": isLegacyProps(product) ? parseFloat(product.price.replace(/[^0-9.]/g, "")) : parseFloat(product.price).toFixed(2),
      "availability": status === "ACTIVE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(rating
      ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": parseFloat(rating.toString()).toFixed(1),
            "reviewCount": reviewsCount || 1,
          },
        }
      : {}),
  };

  if (isList) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden flex group hover:shadow-card-hover transition-all duration-300 relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Gallery / Image Section */}
        <div className="w-40 sm:w-52 shrink-0 overflow-hidden relative bg-secondary">
          <Link href={`/product/${id}`} className="block w-full h-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No image
              </div>
            )}
          </Link>
          {discountPct > 0 && (
            <span className="absolute top-3 left-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <Percent className="w-2.5 h-2.5" />
              {discountPct}% OFF
            </span>
          )}
          <WishlistButton productId={id} className="absolute top-3 right-3 z-10" />
        </div>

        {/* Info Section */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              {brand && (
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  {brand}
                </span>
              )}
              {categoryName && (
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {categoryName}
                </span>
              )}
            </div>
            
            <Link href={`/product/${id}`}>
              <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>

            {/* Ratings & reviews */}
            <div className="flex items-center gap-1.5 mt-2">
              <RatingStars rating={rating} count={reviewsCount} />
            </div>

            {/* Delivery badge */}
            <DeliveryBadge productId={id} className="mt-2.5" />
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-border/40">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-foreground">
                {displayPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onQuickView && !isLegacyProps(product) && (
                <button
                  onClick={() => onQuickView(product)}
                  className="flex items-center justify-center p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {onAddToCart && !isLegacyProps(product) && (
                <button
                  onClick={(e) => onAddToCart(product, e)}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Top Media Block */}
      <div className="aspect-square overflow-hidden relative bg-secondary">
        <Link href={`/product/${id}`} className="block w-full h-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </Link>
        
        {discountPct > 0 && (
          <span className="absolute top-3 left-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
            <Percent className="w-2.5 h-2.5" />
            {discountPct}% OFF
          </span>
        )}
        <WishlistButton productId={id} className="absolute top-3 right-3 z-10" />

        {/* Hover Quick actions overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 pointer-events-none">
          {onQuickView && !isLegacyProps(product) && (
            <button
              onClick={() => onQuickView(product)}
              className="pointer-events-auto flex items-center justify-center w-9 h-9 rounded-full bg-white/95 text-slate-800 shadow-md hover:scale-110 active:scale-95 transition-all"
              title="Quick View"
            >
              <Eye className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Info Block */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {brand && (
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">
              {brand}
            </span>
          )}
          <Link href={`/product/${id}`}>
            <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1.5 mt-1.5">
            <RatingStars rating={rating} count={reviewsCount} />
          </div>

          <DeliveryBadge productId={id} className="mt-2" />
        </div>

        <div className="flex items-center justify-between gap-2 mt-4 pt-3.5 border-t border-border/40">
          <div className="flex flex-col">
            <span className="text-base font-black text-foreground leading-none">
              {displayPrice}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through mt-0.5">
                {originalPrice}
              </span>
            )}
          </div>

          {onAddToCart && !isLegacyProps(product) && (
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="flex items-center justify-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
