"use client";

import React, { useEffect } from "react";
import { X, ShoppingCart, Percent, Star } from "lucide-react";
import type { BuyerProduct } from "@/types/product";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RatingStars } from "./RatingStars";
import { DeliveryBadge } from "./DeliveryBadge";
import { WishlistButton } from "./WishlistButton";

interface QuickViewModalProps {
  product: BuyerProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: BuyerProduct) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  // Track modal open event for analytics
  useEffect(() => {
    if (isOpen && product) {
      console.log(`[Analytics] Quick View Opened: ${product.title} (${product.id})`);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.find((img) => img.isCover)?.url ?? product.images[0].url
      : null;

  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const discountPct =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl">
        <DialogTitle className="sr-only">Quick view of {product.title}</DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Media */}
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] bg-secondary flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No Image</span>
            )}
            {discountPct > 0 && (
              <span className="absolute top-4 left-4 bg-discount text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Percent className="w-3 h-3" />
                {discountPct}% OFF
              </span>
            )}
            <WishlistButton productId={product.id} className="absolute top-4 right-4 z-10" />
          </div>

          {/* Product Specs & Info */}
          <div className="p-6 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                {product.brand && (
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    {product.brand}
                  </span>
                )}
                {product.category && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {product.category.name}
                  </span>
                )}
              </div>

              <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">
                {product.title}
              </h2>

              <div className="flex items-center gap-1.5 mt-2">
                <RatingStars rating={product.averageRating} count={product.ratingCount} size="sm" />
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl font-black text-foreground">
                  ₹{price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <DeliveryBadge productId={product.id} className="mt-4" />
            </div>

            <div className="space-y-3 pt-4 border-t border-border/40">
              <div className="text-xs text-muted-foreground flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Stock Availability:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">In Stock</span>
                </div>
                <div className="flex justify-between">
                  <span>Return Policy:</span>
                  <span className="font-semibold text-foreground">7 Days Easy Return</span>
                </div>
              </div>

              <div className="flex gap-2.5 w-full">
                {onAddToCart && (
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
