"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Star,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Grid3X3,
  LayoutList,
  Search,
  Loader2,
} from "lucide-react";
import { buyerProductService } from "@/services/buyer-product.service";
import { wishlistService } from "@/services/wishlist.service";
import { useAuth } from "@/app/(public)/context/AuthContext";
import { useDebounce } from "@/hooks/use-debounce";
import type { BuyerProduct } from "@/types/product";
import type { Category } from "@/types/category";
import { ProductsGridSkeleton } from "@/app/(public)/products/ProductsSkeleton";

interface Props {
  categorySlug: string;
  category: Category;
  initialSearch: string;
  initialPage: number;
}

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "Over ₹5,000", min: 5000, max: Infinity },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];

const ratings = [4, 3, 2, 1];
const PAGE_SIZE = 20;

function getCoverImage(product: BuyerProduct): string | null {
  if (!Array.isArray(product.images) || product.images.length === 0) return null;
  const cover = product.images.find((img) => img.isCover) ?? product.images[0];
  return cover?.url ?? null;
}

function getDiscountPct(product: BuyerProduct): number {
  const price = parseFloat(product.price);
  const original = product.originalPrice ? parseFloat(product.originalPrice) : null;
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export default function CategoryClient({
  categorySlug,
  category,
  initialSearch,
  initialPage,
}: Props) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [page, setPage] = useState(initialPage);

  const debouncedSearch = useDebounce(searchInput, 400);

  const { isLoggedIn, setShowLogin } = useAuth();
  const queryClient = useQueryClient();

  // Fetch wishlist if logged in
  const { data: wishlist = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: isLoggedIn,
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async ({ productId, isAdded }: { productId: string; isAdded: boolean }) => {
      if (isAdded) {
        await wishlistService.removeFromWishlist(productId);
      } else {
        await wishlistService.addToWishlist(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const handleToggleWishlist = (productId: string) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    const isAdded = wishlist.some((item: any) => item.productId === productId);
    toggleWishlistMutation.mutate({ productId, isAdded });
  };

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [
      "buyer-products",
      { search: debouncedSearch, categoryId: category.id, page },
    ],
    queryFn: () =>
      buyerProductService.listProducts({
        search: debouncedSearch || undefined,
        categoryId: category.id,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const filtered = useMemo(() => {
    let items = data?.items ?? [];

    if (selectedBrand !== "All") {
      items = items.filter((p) => p.brand === selectedBrand);
    }

    const range = priceRanges[selectedPrice];
    items = items.filter((p) => {
      const price = parseFloat(p.price);
      return price >= range.min && price <= range.max;
    });

    if (selectedRating > 0) {
      items = items.filter((p) => {
        const rating = p.averageRating ? parseFloat(p.averageRating) : 0;
        return rating >= selectedRating;
      });
    }

    if (sortBy === "price-asc") {
      items = [...items].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "price-desc") {
      items = [...items].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "rating") {
      items = [...items].sort(
        (a, b) =>
          parseFloat(b.averageRating ?? "0") - parseFloat(a.averageRating ?? "0")
      );
    }

    return items;
  }, [data?.items, selectedBrand, selectedPrice, selectedRating, sortBy]);

  const brands = useMemo(() => {
    const all = (data?.items ?? [])
      .map((p) => p.brand)
      .filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(all))];
  }, [data?.items]);

  const totalPages = data?.meta.totalPages ?? 1;
  const total = data?.meta.total ?? 0;

  const activeFilters = [
    selectedBrand !== "All" ? selectedBrand : null,
    selectedPrice !== 0 ? priceRanges[selectedPrice].label : null,
    selectedRating > 0 ? `${selectedRating}+ Stars` : null,
  ].filter(Boolean) as string[];

  const clearAllFilters = () => {
    setSelectedBrand("All");
    setSelectedPrice(0);
    setSelectedRating(0);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    setPage(1);
  };

  const FilterPanel = ({ mobile = false }: { mobile?: boolean }) => {
    return (
      <div className={mobile ? "" : "space-y-6"}>
        <div className={mobile ? "mb-6" : ""}>
          <h4 className="text-sm font-semibold text-foreground mb-3">Price Range</h4>
          <div className="space-y-1.5">
            {priceRanges.map((range, i) => (
              <button
                key={range.label}
                onClick={() => setSelectedPrice(i)}
                className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                  selectedPrice === i
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {brands.length > 1 && (
          <div className={mobile ? "mb-6" : ""}>
            <h4 className="text-sm font-semibold text-foreground mb-3">Brand</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-hide">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                    selectedBrand === brand
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Rating</h4>
          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedRating(0)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                selectedRating === 0
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All Ratings
            </button>
            {ratings.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRating(r)}
                className={`flex items-center gap-1.5 w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                  selectedRating === r
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r ? "fill-star text-star" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1">& Up</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      {/* Category Heading / Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
        {category.description && (
          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
        )}
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder={`Search in ${category.name}...`}
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-card text-sm text-foreground pl-10 pr-4 py-2.5 rounded-xl shadow-card outline-none focus:ring-2 focus:ring-ring/20 border border-border/50 focus:border-primary/20 transition-all"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center gap-2 bg-card text-sm font-medium text-foreground px-4 py-2.5 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <p className="text-sm text-muted-foreground hidden sm:block">
            <span className="font-semibold text-foreground">{total}</span>{" "}
            products found in this category
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-card rounded-xl shadow-card overflow-hidden">
            <button
              onClick={() => setGridView(true)}
              className={`p-2.5 transition-colors ${
                gridView
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-2.5 transition-colors ${
                !gridView
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-card text-sm font-medium text-foreground pl-4 pr-9 py-2.5 rounded-xl shadow-card cursor-pointer outline-none focus:ring-2 focus:ring-ring/20 border border-border/50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1.5 bg-card text-sm text-foreground px-3 py-1.5 rounded-full shadow-card border border-border/50"
            >
              {filter}
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-card rounded-2xl shadow-card p-5 sticky top-24 border border-border/50">
            <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading || isFetching ? (
            <ProductsGridSkeleton />
          ) : isError ? (
            <div className="text-center py-20 bg-card rounded-3xl shadow-card border border-border/50">
              <p className="text-lg font-semibold text-foreground mb-2">
                Failed to load products
              </p>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl shadow-card border border-border/50">
              <p className="text-lg font-semibold text-foreground mb-2">
                No products found
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-primary text-primary-foreground text-sm font-medium px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          ) : gridView ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const imageUrl = getCoverImage(p);
                const discountPct = getDiscountPct(p);
                const isProductWishlisted = wishlist.some((w: any) => w.productId === p.id);
                return (
                  <Link
                    href={`/product/${p.id}`}
                    key={p.id}
                    className="bg-card rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover transition-shadow duration-300 relative border border-border/50"
                  >
                    <div className="aspect-square overflow-hidden relative bg-secondary">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                      {discountPct > 0 && (
                        <span className="absolute top-3 left-3 bg-discount text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{discountPct}%
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleWishlist(p.id);
                        }}
                        disabled={toggleWishlistMutation.isPending}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-10 shadow-sm"
                      >
                        {toggleWishlistMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                        ) : (
                          <Heart
                            className={`w-4 h-4 ${
                              isProductWishlisted
                                ? "fill-destructive text-destructive"
                                : "text-muted-foreground"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                    <div className="p-4">
                      {p.brand && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {p.brand}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {p.title}
                      </p>
                      {p.averageRating && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="w-3.5 h-3.5 fill-star text-star" />
                          <span className="text-xs text-muted-foreground">
                            {parseFloat(p.averageRating).toFixed(1)} (
                            {p.ratingCount})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-foreground">
                          ₹{parseFloat(p.price).toFixed(2)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{parseFloat(p.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => {
                const imageUrl = getCoverImage(p);
                const discountPct = getDiscountPct(p);
                const isProductWishlisted = wishlist.some((w: any) => w.productId === p.id);
                return (
                  <Link
                    href={`/product/${p.id}`}
                    key={p.id}
                    className="bg-card rounded-2xl shadow-card overflow-hidden flex group hover:shadow-card-hover transition-shadow duration-300 relative border border-border/50"
                  >
                    <div className="w-36 sm:w-48 shrink-0 overflow-hidden relative bg-secondary aspect-square">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                      {discountPct > 0 && (
                        <span className="absolute top-3 left-3 bg-discount text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{discountPct}%
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-center flex-1">
                      {p.brand && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {p.brand}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {p.title}
                      </p>
                      {p.averageRating && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="w-3.5 h-3.5 fill-star text-star" />
                          <span className="text-xs text-muted-foreground">
                            {parseFloat(p.averageRating).toFixed(1)} (
                            {p.ratingCount})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-foreground">
                          ₹{parseFloat(p.price).toFixed(2)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{parseFloat(p.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleWishlist(p.id);
                      }}
                      disabled={toggleWishlistMutation.isPending}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-10 shadow-sm"
                    >
                      {toggleWishlistMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      ) : (
                        <Heart
                          className={`w-4 h-4 ${
                            isProductWishlisted
                              ? "fill-destructive text-destructive"
                              : "text-muted-foreground"
                          }`}
                        />
                      )}
                    </button>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === pageNum
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none hover:bg-secondary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slideout */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-card shadow-xl overflow-y-auto border-l border-border/50">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h3>
                <button onClick={() => setShowFilters(false)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <FilterPanel mobile />
              <button onClick={() => setShowFilters(false)} className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl mt-6 hover:opacity-90 transition-opacity">
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
