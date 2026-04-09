"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Star, Package, Truck, CalendarCheck, Percent } from "lucide-react";
import { useCart } from "../../context/CartContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BuyerProductDetail, BuyerProduct } from "@/types/product";

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

function ProductInfo({ product }: { product: BuyerProductDetail }) {
  const [wishlisted, setWishlisted] = useState(false);
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
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(() => {
    const defaults: Record<string, string> = {};
    variantTypes.forEach((type) => {
      const first = variants.find((v) => v.type === type);
      if (first) defaults[type] = first.value;
    });
    return defaults;
  });

  const selectedVariantLabel = variantTypes
    .map((type) => `${type}: ${selectedVariants[type]}`)
    .join(" / ");

  const handleAddToCart = () => {
    const coverImage =
      Array.isArray(product.images)
        ? (product.images.find((img) => img.isCover) ?? product.images[0])?.url
        : undefined;

    addItem({
      id: product.id,
      name: product.title,
      price,
      originalPrice: originalPrice ?? undefined,
      quantity: 1,
      variant: selectedVariantLabel || undefined,
      image: coverImage ?? "",
    });
  };

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

      {/* Stock badge */}
      <div>
        {product.stock > 0 ? (
          <span className="text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full">
            In Stock ({product.stock} available)
          </span>
        ) : (
          <span className="text-xs font-medium text-destructive bg-destructive/10 px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      {/* Variants */}
      {variantTypes.map((type) => {
        const values = variants
          .filter((v) => v.type === type)
          .map((v) => v.value);
        return (
          <div key={type}>
            <p className="text-sm font-medium text-foreground mb-3">
              Select {type}
            </p>
            <div className="flex gap-2 flex-wrap">
              {values.map((val) => (
                <button
                  key={val}
                  onClick={() =>
                    setSelectedVariants((prev) => ({ ...prev, [type]: val }))
                  }
                  className={`px-4 h-11 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedVariants[type] === val
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-card text-muted-foreground hover:bg-secondary border border-border shadow-card"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
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
        <button
          disabled={product.stock === 0}
          className="w-full border border-primary text-foreground font-semibold py-3.5 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

// ─── Rating & Reviews ────────────────────────────────────────────────────────

function RatingReviews({ product }: { product: BuyerProductDetail }) {
  const avg = product.averageRating ? parseFloat(product.averageRating) : 0;

  return (
    <div className="bg-card rounded-2xl shadow-card p-6">
      <h3 className="text-lg font-bold text-foreground mb-6">
        Rating & Reviews
      </h3>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-extrabold text-foreground">
          {avg > 0 ? avg.toFixed(1) : "—"}
        </span>
        <span className="text-lg text-muted-foreground">/ 5</span>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.round(avg) ? "fill-star text-star" : "text-muted"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          ({product.ratingCount} reviews)
        </span>
      </div>
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
  const price = parseFloat(product.price);

  const images = Array.isArray(product.images) ? product.images : [];
  const attributes = Array.isArray(product.attributes) ? product.attributes : [];

  const handleMobileAddToCart = () => {
    const coverImage = images.find((img) => img.isCover)?.url ?? images[0]?.url;
    addItem({
      id: product.id,
      name: product.title,
      price,
      quantity: 1,
      image: coverImage ?? "",
    });
  };

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
            <p className="text-sm font-bold text-foreground">
              ₹{price.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {product.title}
            </p>
          </div>
          <button
            onClick={handleMobileAddToCart}
            disabled={product.stock === 0}
            className="bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-2xl text-sm hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
