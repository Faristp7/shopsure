"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Star, Package, Truck, CalendarCheck, Percent, ShoppingBag, Check, Loader2, BellRing, ThumbsUp, Send } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BuyerProductDetail, BuyerProduct } from "@/types/product";
import { reviewsService, type Review } from "@/services/reviews.service";

// ─── Gallery ────────────────────────────────────────────────────────────────

function ProductGallery({
  images,
  title,
}: {
  images: Array<{ url: string; isCover: boolean; sortOrder: number }>;
  title: string;
}) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(sorted.findIndex((img) => img.isCover), 0)
  );

  if (sorted.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-card aspect-[4/5] flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card rounded-2xl overflow-hidden shadow-card aspect-[4/5]">
        <img
          src={sorted[activeIndex].url}
          alt={title}
          className="w-full h-full object-cover object-top transition-all duration-300"
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-3">
          {sorted.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-24 h-24 flex-shrink-0 bg-card rounded-xl overflow-hidden shadow-card transition-all duration-200 hover:shadow-card-hover ${
                activeIndex === i
                  ? "ring-2 ring-primary"
                  : "ring-1 ring-border"
              }`}
            >
              <img
                src={img.url}
                alt={`View ${i + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Info ────────────────────────────────────────────────────────────────────

type AddStatus = "idle" | "loading" | "success" | "error";

function ProductInfo({ product }: { product: BuyerProductDetail }) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [addStatus, setAddStatus] = useState<AddStatus>("idle");
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const { addItem } = useCart();

  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice
    ? parseFloat(product.originalPrice)
    : null;
  const discountPct =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const variantTypes = [...new Set(variants.map((v) => v.type))];
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    variantTypes.forEach((type) => {
      // Default to first in-stock option, or just first if all are out
      const inStock = variants.find((v) => v.type === type && v.stock > 0);
      const first = variants.find((v) => v.type === type);
      if (inStock ?? first) defaults[type] = (inStock ?? first)!.value;
    });
    return defaults;
  });

  const selectedVariantLabel = variantTypes
    .map((type) => `${type}: ${selectedVariants[type]}`)
    .join(" / ");

  // ── Effective stock: minimum across all selected variant options ──────────
  // Each variant entry has its own stock (e.g. Color:Red stock=0, Size:M stock=5)
  const selectedVariantEntries = variantTypes
    .map((type) => variants.find((v) => v.type === type && v.value === selectedVariants[type]))
    .filter(Boolean) as Array<{ type: string; value: string; stock: number; price: number }>;

  const effectiveStock =
    selectedVariantEntries.length > 0
      ? Math.min(...selectedVariantEntries.map((v) => v.stock))
      : product.stock;

  const isOutOfStock = effectiveStock === 0;
  const isLowStock = effectiveStock > 0 && effectiveStock <= 5;

  const handleAddToCart = useCallback(async () => {
    if (addStatus !== "idle" || isOutOfStock) return;
    const coverImage =
      Array.isArray(product.images)
        ? (product.images.find((img) => img.isCover) ?? product.images[0])?.url
        : undefined;

    setAddStatus("loading");
    const ok = await addItem({
      id: product.id,
      name: product.title,
      price,
      originalPrice: originalPrice ?? undefined,
      quantity: 1,
      variant: selectedVariantLabel || undefined,
      image: coverImage ?? "",
      stock: effectiveStock,
    });
    setAddStatus(ok ? "success" : "error");
    setTimeout(() => setAddStatus("idle"), 1800);
  }, [addStatus, isOutOfStock, addItem, product, price, originalPrice, selectedVariantLabel, effectiveStock]);

  const handleBuyNow = useCallback(async () => {
    if (isOutOfStock || buyNowLoading) return;
    const coverImage =
      Array.isArray(product.images)
        ? (product.images.find((img) => img.isCover) ?? product.images[0])?.url
        : undefined;

    setBuyNowLoading(true);
    const ok = await addItem({
      id: product.id,
      name: product.title,
      price,
      originalPrice: originalPrice ?? undefined,
      quantity: 1,
      variant: selectedVariantLabel || undefined,
      image: coverImage ?? "",
      stock: effectiveStock,
    });
    if (ok) {
      router.push("/checkout");
    } else {
      setBuyNowLoading(false);
    }
  }, [isOutOfStock, buyNowLoading, addItem, product, price, originalPrice, selectedVariantLabel, effectiveStock, router]);

  return (
    <div className="flex flex-col gap-5">
      {/* Category badge */}
      {product.category && (
        <div>
          <span className="inline-block text-sm text-muted-foreground border border-border rounded-full px-4 py-1.5">
            {product.category.name}
          </span>
        </div>
      )}

      {/* Title & brand */}
      <div>
        {product.brand && (
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
        )}
        <h2 className="text-2xl font-bold text-foreground">{product.title}</h2>

        {/* Rating */}
        {product.averageRating && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(parseFloat(product.averageRating!))
                      ? "fill-star text-star"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {parseFloat(product.averageRating).toFixed(1)} ({product.ratingCount} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mt-3">
          <p className="text-xl font-bold text-foreground">
            ₹{price.toFixed(2)}
          </p>
          {originalPrice && (
            <p className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toFixed(2)}
            </p>
          )}
          {discountPct && (
            <span className="bg-discount/10 text-discount text-[10px] font-bold px-2 py-0.5 rounded-full">
              {discountPct}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Stock badge — reflects selected variant */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <span className="text-xs font-medium text-destructive bg-destructive/10 px-3 py-1 rounded-full">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <>
            <span className="text-xs font-medium text-warning bg-warning/10 px-3 py-1 rounded-full">
              Only {effectiveStock} left!
            </span>
            <span className="text-xs text-muted-foreground">Order soon</span>
          </>
        ) : (
          <span className="text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full">
            In Stock ({effectiveStock} available)
          </span>
        )}
      </div>

      {/* Variants */}
      {variantTypes.map((type) => {
        const options = variants.filter((v) => v.type === type);
        return (
          <div key={type}>
            <p className="text-sm font-medium text-foreground mb-3">
              Select {type}
            </p>
            <div className="flex gap-2 flex-wrap">
              {options.map((opt) => {
                const isSelected = selectedVariants[type] === opt.value;
                const isVariantOOS = opt.stock === 0;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (!isVariantOOS)
                        setSelectedVariants((prev) => ({ ...prev, [type]: opt.value }));
                    }}
                    disabled={isVariantOOS}
                    title={isVariantOOS ? "Out of stock" : undefined}
                    className={`relative px-4 h-11 rounded-xl text-sm font-medium transition-all duration-200
                      ${isVariantOOS
                        ? "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-50 line-through"
                        : isSelected
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-card text-muted-foreground hover:bg-secondary border border-border shadow-card"
                      }`}
                  >
                    {opt.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Add to Cart / Out of Stock button */}
          <div className="relative flex-1">
            {addStatus === "success" && (
              <span className="absolute inset-0 rounded-full pointer-events-none [animation:add-ripple_0.6s_ease_forwards] bg-green-400/25" />
            )}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addStatus !== "idle"}
              className={`w-full font-semibold py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg
                ${isOutOfStock
                  // Distinct out-of-stock style — not faded primary
                  ? "bg-muted text-muted-foreground shadow-none cursor-not-allowed"
                  : addStatus === "success"
                  ? "bg-green-500 text-white shadow-green-500/25 [animation:add-success-pop_0.35s_ease]"
                  : addStatus === "error"
                  ? "bg-destructive text-white shadow-destructive/25 active:scale-[0.98]"
                  : addStatus === "loading"
                  ? "bg-primary/80 text-primary-foreground shadow-primary/20 cursor-wait"
                  : "bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
                }`}
            >
              {isOutOfStock ? (
                <span className="flex items-center justify-center gap-2">
                  <BellRing className="w-4 h-4" />
                  Out of Stock
                </span>
              ) : addStatus === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding…
                </span>
              ) : addStatus === "success" ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Added to Cart!
                </span>
              ) : addStatus === "error" ? (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Try Again
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border shadow-card ${
              wishlisted
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Buy Now — also disabled + distinct style when OOS */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || buyNowLoading}
          className={`w-full font-semibold py-3.5 rounded-full text-sm transition-all active:scale-[0.98]
            ${isOutOfStock
              ? "border border-border text-muted-foreground bg-muted cursor-not-allowed"
              : buyNowLoading
              ? "bg-primary/80 text-primary-foreground cursor-wait"
              : "border border-primary text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
        >
          {isOutOfStock ? (
            "Currently Unavailable"
          ) : buyNowLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            "Buy Now"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Rating & Reviews ────────────────────────────────────────────────────────

function StarRating({ value, onChange, size = "md" }: { value: number; onChange?: (v: number) => void; size?: "sm" | "md" }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          onMouseEnter={() => onChange && setHovered(i + 1)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`${sz} transition-colors ${
              i < (hovered || value) ? "fill-star text-star" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingReviews({ product }: { product: BuyerProductDetail }) {
  const queryClient = useQueryClient();
  const avg = product.averageRating ? parseFloat(product.averageRating) : 0;
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["product-reviews", product.id],
    queryFn: () => reviewsService.getProductReviews(product.id),
    staleTime: 60_000,
  });

  const markHelpfulMutation = useMutation({
    mutationFn: reviewsService.markHelpful,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product-reviews", product.id] }),
  });

  const submitMutation = useMutation({
    mutationFn: reviewsService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", product.id] });
      setShowForm(false);
      setTitle("");
      setBody("");
      setRating(5);
    },
  });

  const reviews = data?.items ?? [];
  const summary = data;

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Rating & Reviews</h3>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {/* Summary */}
      <div className="flex items-start gap-6">
        <div className="text-center">
          <p className="text-5xl font-extrabold text-foreground">{avg > 0 ? avg.toFixed(1) : "—"}</p>
          <StarRating value={Math.round(avg)} size="sm" />
          <p className="text-xs text-muted-foreground mt-1">{product.ratingCount ?? reviews.length} reviews</p>
        </div>
        {summary && (
          <div className="flex-1 space-y-1.5">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = summary.distribution?.[star] ?? 0;
              const pct = summary.totalCount > 0 ? Math.round((count / summary.totalCount) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-4 text-right">{star}</span>
                  <Star className="w-3 h-3 fill-star text-star" />
                  <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-star rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-7 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Write Review Form */}
      {showForm && (
        <div className="bg-muted/30 rounded-xl p-4 space-y-4 border border-border/60">
          <h4 className="font-semibold text-sm">Your Review</h4>
          <div>
            <Label className="text-xs mb-1.5 block">Rating</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input placeholder="Summarise your experience" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Review</Label>
            <Textarea placeholder="Tell others about this product..." rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <Button
            size="sm"
            className="gap-2"
            disabled={!rating || !body.trim() || submitMutation.isPending}
            onClick={() => submitMutation.mutate({ productId: product.id, orderId: "", rating, title, body })}
          >
            {submitMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Submit Review
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-5 divide-y divide-border/40">
          {reviews.map((review: Review) => (
            <div key={review.id} className="pt-5 first:pt-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <StarRating value={review.rating} size="sm" />
                    {review.verifiedPurchase && (
                      <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">Verified Purchase</span>
                    )}
                  </div>
                  <p className="font-semibold text-sm mt-1.5">{review.title}</p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.body}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground font-medium">{review.userName}</p>
                <button
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => markHelpfulMutation.mutate(review.id)}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({review.helpfulCount})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Related Products ────────────────────────────────────────────────────────

function RelatedProducts({ products }: { products: BuyerProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">
          You might also like
        </h3>
        <Link href="/products" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((p) => {
          const coverImage = Array.isArray(p.images)
            ? (p.images.find((img) => img.isCover) ?? p.images[0])?.url
            : null;
          const price = parseFloat(p.price);
          const original = p.originalPrice
            ? parseFloat(p.originalPrice)
            : null;

          return (
            <Link
              href={`/product/${p.id}`}
              key={p.id}
              className="bg-card rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {p.title}
                </p>
                {p.averageRating && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3.5 h-3.5 fill-star text-star" />
                    <span className="text-xs text-muted-foreground">
                      {parseFloat(p.averageRating).toFixed(1)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-foreground">
                    ₹{price.toFixed(2)}
                  </span>
                  {original && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{original.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface Props {
  product: BuyerProductDetail;
  relatedProducts: BuyerProduct[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem } = useCart();
  const [mobileAddStatus, setMobileAddStatus] = useState<AddStatus>("idle");
  const price = parseFloat(product.price);
  const mobileIsOOS = product.stock === 0;

  const images = Array.isArray(product.images) ? product.images : [];
  const attributes = Array.isArray(product.attributes) ? product.attributes : [];

  const handleMobileAddToCart = useCallback(async () => {
    if (mobileAddStatus !== "idle" || mobileIsOOS) return;
    const coverImage = images.find((img) => img.isCover)?.url ?? images[0]?.url;
    setMobileAddStatus("loading");
    const ok = await addItem({
      id: product.id,
      name: product.title,
      price,
      quantity: 1,
      image: coverImage ?? "",
      stock: product.stock,
    });
    setMobileAddStatus(ok ? "success" : "error");
    setTimeout(() => setMobileAddStatus("idle"), 1800);
  }, [mobileAddStatus, mobileIsOOS, addItem, images, product, price]);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <nav className="py-4 container">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link
              href="/products"
              className="hover:text-foreground transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Products
            </Link>
          </li>
          <li className="text-muted-foreground/50">›</li>
          {product.category && (
            <>
              <li>{product.category.name}</li>
              <li className="text-muted-foreground/50">›</li>
            </>
          )}
          <li className="text-foreground font-semibold line-clamp-1">
            {product.title}
          </li>
        </ol>
      </nav>

      <main className="container">
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <ProductGallery images={images} title={product.title} />

          <div className="flex flex-col gap-6">
            <ProductInfo product={product} />

            {/* Description */}
            {product.description && (
              <Accordion type="single" collapsible defaultValue="desc">
                <AccordionItem
                  value="desc"
                  className="border border-border rounded-2xl px-5 overflow-hidden"
                >
                  <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
                    Description & Details
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {product.description}
                    {attributes.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {attributes.map((attr) => (
                          <div key={attr.name} className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              {attr.name}
                            </span>
                            <span className="text-xs font-medium text-foreground">
                              {attr.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Shipping */}
            <Accordion type="single" collapsible defaultValue="shipping">
              <AccordionItem
                value="shipping"
                className="border border-border rounded-2xl px-5 overflow-hidden"
              >
                <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
                  Shipping
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Package, label: "Package", value: "Standard Package" },
                      { icon: Truck, label: "Delivery Time", value: "3–5 Working Days" },
                      { icon: CalendarCheck, label: "Returns", value: "7-day return policy" },
                      { icon: Percent, label: "COD", value: "Available" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="text-sm font-semibold text-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Seller */}
            {product.seller && (
              <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-2xl shadow-card">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground flex-shrink-0">
                  {product.seller.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sold by</p>
                  <p className="text-sm font-semibold text-foreground">
                    {product.seller.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-10">
          <RatingReviews product={product} />
        </div>

        <div className="mb-10">
          <RelatedProducts products={relatedProducts} />
        </div>
      </main>

      {/* Mobile sticky add to cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden z-40 shadow-up">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-sm font-bold ${mobileIsOOS ? "text-muted-foreground" : "text-foreground"}`}>
              {mobileIsOOS ? "Unavailable" : `₹${price.toFixed(2)}`}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {product.title}
            </p>
          </div>
          <div className="relative">
            {mobileAddStatus === "success" && (
              <span className="absolute inset-0 rounded-2xl pointer-events-none [animation:add-ripple_0.6s_ease_forwards] bg-green-400/25" />
            )}
            <button
              onClick={handleMobileAddToCart}
              disabled={mobileIsOOS || mobileAddStatus !== "idle"}
              className={`font-semibold py-3 px-6 rounded-2xl text-sm transition-all duration-300 disabled:cursor-not-allowed
                ${mobileIsOOS
                  ? "bg-muted text-muted-foreground shadow-none"
                  : mobileAddStatus === "success"
                  ? "bg-green-500 text-white [animation:add-success-pop_0.35s_ease] active:scale-[0.98]"
                  : mobileAddStatus === "loading"
                  ? "bg-primary/80 text-primary-foreground cursor-wait"
                  : mobileAddStatus === "error"
                  ? "bg-destructive text-white active:scale-[0.98]"
                  : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
                }`}
            >
              {mobileIsOOS ? (
                <span className="flex items-center gap-2">
                  <BellRing className="w-4 h-4" /> Out of Stock
                </span>
              ) : mobileAddStatus === "loading" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Adding…
                </span>
              ) : mobileAddStatus === "success" ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[2.5]" /> Added!
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
