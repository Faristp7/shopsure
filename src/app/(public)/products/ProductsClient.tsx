"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { buyerProductService } from "@/services/buyer-product.service";
import { buyerCategoryService } from "@/services/buyer-category.service";
import { useDebounce } from "@/hooks/use-debounce";
import type { BuyerProduct } from "@/types/product";
import { ProductsGridSkeleton } from "./ProductsSkeleton";
import { ProductCard } from "@/components/public/products/ProductCard";
import { Breadcrumbs } from "@/components/public/products/Breadcrumbs";
import { QuickViewModal } from "@/components/public/products/QuickViewModal";
import { RecentlyViewed } from "@/components/public/products/RecentlyViewed";
import { SearchSuggestions } from "@/components/public/products/SearchSuggestions";
import { useCart } from "@/app/(public)/context/CartContext";

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

interface Props {
  initialSearch: string;
  initialCategoryId: string | null;
  initialPage: number;
}

export default function ProductsClient({
  initialSearch,
  initialCategoryId,
  initialPage,
}: Props) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId
  );
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<BuyerProduct | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addItem } = useCart();

  const debouncedSearch = useDebounce(searchInput, 400);

  const { data: categoriesData } = useQuery({
    queryKey: ["buyer-categories"],
    queryFn: () => buyerCategoryService.getCategories({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [
      "buyer-products",
      { search: debouncedSearch, categoryId: selectedCategoryId, page },
    ],
    queryFn: () =>
      buyerProductService.listProducts({
        search: debouncedSearch || undefined,
        categoryId: selectedCategoryId || undefined,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const categories = categoriesData?.items ?? [];

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

  const activeFilters = [
    selectedCategoryId
      ? (categories.find((c) => c.id === selectedCategoryId)?.name ?? null)
      : null,
    selectedBrand !== "All" ? selectedBrand : null,
    selectedPrice !== 0 ? priceRanges[selectedPrice].label : null,
    selectedRating > 0 ? `${selectedRating}+ Stars` : null,
  ].filter(Boolean) as string[];

  const clearAllFilters = () => {
    setSelectedCategoryId(null);
    setSelectedBrand("All");
    setSelectedPrice(0);
    setSelectedRating(0);
    setPage(1);
  };

  const handleCategoryChange = (id: string | null) => {
    setSelectedCategoryId(id);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    setPage(1);
  };

  const totalPages = data?.meta.totalPages ?? 1;
  const total = data?.meta.total ?? 0;

  // Build breadcrumb trail dynamically
  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    ...(selectedCategoryId
      ? [
          {
            label: categories.find((c) => c.id === selectedCategoryId)?.name || "Category",
            href: `/products?categoryId=${selectedCategoryId}`,
          },
        ]
      : []),
  ];

  const FilterPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "" : "space-y-6"}>
      <div className={mobile ? "mb-6" : ""}>
        <h4 className="text-sm font-semibold text-foreground mb-3">Category</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
              selectedCategoryId === null
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                selectedCategoryId === cat.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

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

  return (
    <div className="container py-6 space-y-6 font-display">
      <Breadcrumbs items={breadcrumbItems} />



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
            products found
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
              className="appearance-none bg-card text-sm font-medium text-foreground pl-4 pr-9 py-2.5 rounded-xl shadow-card cursor-pointer outline-none focus:ring-2 focus:ring-ring/20"
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
              className="inline-flex items-center gap-1.5 bg-card text-sm text-foreground px-3 py-1.5 rounded-full shadow-card"
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
          <div className="bg-card rounded-2xl shadow-card p-5 sticky top-24">
            <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 space-y-8">
          {isLoading || isFetching ? (
            <ProductsGridSkeleton />
          ) : isError ? (
            <div className="text-center py-20 bg-card rounded-3xl shadow-card">
              <p className="text-lg font-semibold text-foreground mb-2">
                Failed to load products
              </p>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl shadow-card">
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
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  layout="grid"
                  onQuickView={(prod) => {
                    setSelectedQuickViewProduct(prod);
                    setIsQuickViewOpen(true);
                  }}
                  onAddToCart={async (prod, e) => {
                    e.preventDefault();
                    const cover = prod.images?.find((img) => img.isCover)?.url ?? "";
                    await addItem({
                      id: prod.id,
                      name: prod.title,
                      price: parseFloat(prod.price),
                      quantity: 1,
                      image: cover,
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  layout="list"
                  onQuickView={(prod) => {
                    setSelectedQuickViewProduct(prod);
                    setIsQuickViewOpen(true);
                  }}
                  onAddToCart={async (prod, e) => {
                    e.preventDefault();
                    const cover = prod.images?.find((img) => img.isCover)?.url ?? "";
                    await addItem({
                      id: prod.id,
                      name: prod.title,
                      price: parseFloat(prod.price),
                      quantity: 1,
                      image: cover,
                    });
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isFetching && !isError && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-card shadow-card disabled:opacity-40 hover:shadow-card-hover transition-shadow"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
                    acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 text-muted-foreground text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-card shadow-card text-foreground hover:shadow-card-hover"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-card shadow-card disabled:opacity-40 hover:shadow-card-hover transition-shadow"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Recently Viewed section below catalog */}
      <RecentlyViewed limit={5} />

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-card shadow-xl overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <FilterPanel mobile />
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl mt-4 hover:opacity-90 transition-opacity"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Overlay Dialog */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedQuickViewProduct(null);
        }}
        onAddToCart={async (prod) => {
          const cover = prod.images?.find((img) => img.isCover)?.url ?? "";
          await addItem({
            id: prod.id,
            name: prod.title,
            price: parseFloat(prod.price),
            quantity: 1,
            image: cover,
          });
        }}
      />
    </div>
  );
}
