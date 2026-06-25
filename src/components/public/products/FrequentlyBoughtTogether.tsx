"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Plus, ShoppingBag, Check, Loader2, Package2 } from "lucide-react";
import type { BuyerProduct } from "@/types/product";
import { buyerProductService } from "@/services/buyer-product.service";
import { useCart } from "@/app/(public)/context/CartContext";

interface FrequentlyBoughtTogetherProps {
  /** The current product on the detail page */
  currentProduct: {
    id: string;
    title: string;
    price: string;
    originalPrice?: string | null;
    images?: Array<{ url: string; isCover: boolean; sortOrder: number }> | null;
    category?: { id: string; name: string; slug: string } | null;
    stock: number;
  };
  /** Optional pre-fetched bundle products (for future API support) */
  bundleProducts?: BuyerProduct[];
}

type AddStatus = "idle" | "loading" | "success" | "error";

/**
 * Amazon-style "Frequently Bought Together" bundle widget.
 * Shows the current product + 2 related products with a combined
 * "Add all to cart" button and total price.
 * 
 * Currently fetches from category listing as a fallback.
 * Ready for a dedicated /frequently-bought-together API.
 */
export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
  bundleProducts: externalProducts,
}) => {
  const { addItem } = useCart();
  const [companions, setCompanions] = useState<BuyerProduct[]>(externalProducts || []);
  const [isLoading, setIsLoading] = useState(!externalProducts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addStatus, setAddStatus] = useState<AddStatus>("idle");

  // Fetch companion products by category
  useEffect(() => {
    if (externalProducts && externalProducts.length > 0) {
      setCompanions(externalProducts);
      setIsLoading(false);
      // Select first 2 companions by default
      setSelectedIds(new Set(externalProducts.slice(0, 2).map((p) => p.id)));
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
          limit: 5,
        });
        if (!cancelled) {
          const filtered = res.items.filter((p) => p.id !== currentProduct.id);
          const chosen = filtered.slice(0, 2);
          setCompanions(chosen);
          setSelectedIds(new Set(chosen.map((p) => p.id)));
        }
      } catch {
        // Silent fail
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [currentProduct.id, currentProduct.category?.id, externalProducts]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Calculate totals
  const currentPrice = parseFloat(currentProduct.price);
  const currentOriginal = currentProduct.originalPrice
    ? parseFloat(currentProduct.originalPrice)
    : null;

  const selectedCompanions = companions.filter((p) => selectedIds.has(p.id));
  const bundleTotal =
    currentPrice +
    selectedCompanions.reduce((sum, p) => sum + parseFloat(p.price), 0);
  const bundleOriginalTotal =
    (currentOriginal ?? currentPrice) +
    selectedCompanions.reduce((sum, p) => {
      const orig = p.originalPrice ? parseFloat(p.originalPrice) : parseFloat(p.price);
      return sum + orig;
    }, 0);
  const bundleSavings = bundleOriginalTotal > bundleTotal ? bundleOriginalTotal - bundleTotal : 0;

  const handleAddAll = async () => {
    if (addStatus !== "idle") return;
    setAddStatus("loading");

    try {
      const coverImg = Array.isArray(currentProduct.images)
        ? (currentProduct.images.find((i) => i.isCover) ?? currentProduct.images[0])?.url
        : "";

      // Add current product
      await addItem({
        id: currentProduct.id,
        name: currentProduct.title,
        price: currentPrice,
        quantity: 1,
        image: coverImg ?? "",
        stock: currentProduct.stock,
      });

      // Add selected companion products
      for (const p of selectedCompanions) {
        const pImg =
          Array.isArray(p.images) && p.images.length > 0
            ? (p.images.find((i) => i.isCover) ?? p.images[0]).url
            : "";
        await addItem({
          id: p.id,
          name: p.title,
          price: parseFloat(p.price),
          quantity: 1,
          image: pImg,
          stock: 999, // We don't know companion stock in listing type
        });
      }

      setAddStatus("success");
    } catch {
      setAddStatus("error");
    }
    setTimeout(() => setAddStatus("idle"), 2000);
  };

  if (isLoading) {
    return (
      <section className="bg-card border border-border/50 rounded-2xl shadow-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-muted rounded animate-pulse" />
          <div className="h-5 w-56 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="w-28 h-28 bg-muted rounded-xl animate-pulse" />
              {i < 2 && <Plus className="w-5 h-5 text-muted-foreground/30" />}
            </React.Fragment>
          ))}
        </div>
      </section>
    );
  }

  if (companions.length === 0) return null;

  const getImageUrl = (imgs: BuyerProduct["images"]) => {
    if (!Array.isArray(imgs) || imgs.length === 0) return null;
    return (imgs.find((i) => i.isCover) ?? imgs[0]).url;
  };

  return (
    <section className="bg-card border border-border/50 rounded-2xl shadow-card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Package2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">
          Frequently Bought Together
        </h3>
      </div>

      {/* Product tiles row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {/* Current product (always included) */}
        <div className="shrink-0 relative">
          <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-primary/30 bg-secondary">
            {currentProduct.images && currentProduct.images.length > 0 ? (
              <img
                src={
                  (currentProduct.images.find((i) => i.isCover) ?? currentProduct.images[0])
                    .url
                }
                alt={currentProduct.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-[10px] text-center mt-1.5 font-semibold text-foreground line-clamp-1 max-w-28">
            This item
          </p>
        </div>

        {/* Companion products */}
        {companions.map((p) => {
          const isSelected = selectedIds.has(p.id);
          const img = getImageUrl(p.images);

          return (
            <React.Fragment key={p.id}>
              <Plus className="w-5 h-5 text-muted-foreground/50 shrink-0" />
              <button
                onClick={() => toggleSelection(p.id)}
                className="shrink-0 text-left group"
              >
                <div
                  className={`w-28 h-28 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-secondary relative ${
                    isSelected
                      ? "border-primary/30 opacity-100"
                      : "border-border/30 opacity-50 grayscale"
                  }`}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                      No image
                    </div>
                  )}
                  {/* Checkbox overlay */}
                  <div
                    className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "bg-background/80 border-border"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <p className="text-[10px] text-center mt-1.5 font-medium text-foreground line-clamp-1 max-w-28 group-hover:text-primary transition-colors">
                  {p.title}
                </p>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Pricing summary + add all button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-border/40">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Total for {1 + selectedCompanions.length} item{selectedCompanions.length > 0 ? "s" : ""}:
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">
              ₹{bundleTotal.toFixed(2)}
            </span>
            {bundleSavings > 0 && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{bundleOriginalTotal.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-discount bg-discount/10 px-2 py-0.5 rounded-full">
                  Save ₹{bundleSavings.toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleAddAll}
          disabled={addStatus !== "idle"}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60 shrink-0 shadow-md hover:shadow-lg"
        >
          {addStatus === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : addStatus === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <ShoppingBag className="w-4 h-4" />
          )}
          {addStatus === "success"
            ? "Added!"
            : addStatus === "loading"
            ? "Adding..."
            : `Add All to Cart`}
        </button>
      </div>

      {/* Individual product links */}
      <div className="space-y-2">
        {[currentProduct, ...selectedCompanions].map((p, idx) => {
          const pPrice = parseFloat(p.price);
          const pOriginal = p.originalPrice ? parseFloat(p.originalPrice) : null;
          const isCurrentItem = idx === 0;

          return (
            <div
              key={p.id}
              className="flex items-center justify-between text-sm py-1.5"
            >
              <Link
                href={`/product/${p.id}`}
                className="text-foreground hover:text-primary transition-colors font-medium line-clamp-1 flex-1 mr-4"
              >
                {isCurrentItem ? "This item" : p.title}
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold">₹{pPrice.toFixed(2)}</span>
                {pOriginal && pOriginal > pPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{pOriginal.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
