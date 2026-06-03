"use client";

import { useState, useMemo, useEffect } from "react";
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
import type { Category } from "@/types/category";
import { ProductsGridSkeleton } from "./ProductsSkeleton";

export interface CategoryTreeNode extends Category {
  childrenNodes: CategoryTreeNode[];
}

export function buildCategoryTree(flatCategories: Category[]): CategoryTreeNode[] {
  const map = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  flatCategories.forEach((cat) => {
    map.set(cat.id, { ...cat, childrenNodes: [] });
  });

  flatCategories.forEach((cat) => {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.childrenNodes.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes: CategoryTreeNode[]) => {
    nodes.sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.childrenNodes.length > 0) {
        sortNodes(node.childrenNodes);
      }
    });
  };

  sortNodes(roots);
  return roots;
}

export function getRecursiveProductCount(node: CategoryTreeNode): number {
  const directCount = node._count?.products ?? 0;
  const childrenCount = node.childrenNodes.reduce(
    (sum, child) => sum + getRecursiveProductCount(child),
    0
  );
  return directCount + childrenCount;
}

export function filterCategoryTree(
  nodes: CategoryTreeNode[],
  query: string
): CategoryTreeNode[] {
  const lowercaseQuery = query.toLowerCase();
  return nodes
    .map((node) => {
      const childrenMatched = filterCategoryTree(node.childrenNodes, query);
      const selfMatched = node.name.toLowerCase().includes(lowercaseQuery);
      if (selfMatched || childrenMatched.length > 0) {
        return {
          ...node,
          childrenNodes: childrenMatched,
        };
      }
      return null;
    })
    .filter((n): n is CategoryTreeNode => n !== null);
}

interface CategoryTreeProps {
  nodes: CategoryTreeNode[];
  level?: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  expandedMap: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  isSearchActive: boolean;
}

function CategoryTreeRender({
  nodes,
  level = 0,
  selectedId,
  onSelect,
  expandedMap,
  onToggleExpand,
  isSearchActive,
}: CategoryTreeProps) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => {
        const hasChildren = node.childrenNodes.length > 0;
        const isExpanded = isSearchActive || !!expandedMap[node.id];
        const isSelected = selectedId === node.id;
        const totalProductCount = getRecursiveProductCount(node);

        return (
          <div key={node.id} className="space-y-1">
            <div
              className={`group flex items-center justify-between rounded-xl px-2 py-1.5 transition-all duration-200 ${
                isSelected
                  ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
              style={{ paddingLeft: `${Math.max(8, level * 16)}px` }}
            >
              <button
                onClick={() => onSelect(node.id)}
                className="flex-1 text-left text-sm flex items-center gap-1.5 min-w-0"
              >
                <span className="truncate">{node.name}</span>
                {totalProductCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {totalProductCount}
                  </span>
                )}
              </button>

              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(node.id);
                  }}
                  className={`p-1 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors ${
                    isSearchActive ? "opacity-30 pointer-events-none" : ""
                  }`}
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>
              )}
            </div>

            {hasChildren && isExpanded && (
              <div className="mt-0.5">
                <CategoryTreeRender
                  nodes={node.childrenNodes}
                  level={level + 1}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  expandedMap={expandedMap}
                  onToggleExpand={onToggleExpand}
                  isSearchActive={isSearchActive}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
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
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [page, setPage] = useState(initialPage);

  // Category sidebar states
  const [categorySearch, setCategorySearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showAllCategories, setShowAllCategories] = useState(false);

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

  // Build the hierarchical category tree
  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  // Filter the category tree based on category search query
  const filteredCategoryTree = useMemo(() => {
    if (!categorySearch.trim()) return categoryTree;
    return filterCategoryTree(categoryTree, categorySearch);
  }, [categoryTree, categorySearch]);

  // Auto-expand parents of selected category
  useEffect(() => {
    if (!selectedCategoryId || categories.length === 0) return;

    const parentIds: string[] = [];
    let currentId = selectedCategoryId;
    while (currentId) {
      const cat = categories.find((c) => c.id === currentId);
      if (cat?.parentId) {
        parentIds.push(cat.parentId);
        currentId = cat.parentId;
      } else {
        break;
      }
    }

    if (parentIds.length > 0) {
      setExpandedCategories((prev) => {
        const next = { ...prev };
        let changed = false;
        parentIds.forEach((id) => {
          if (!next[id]) {
            next[id] = true;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [selectedCategoryId, categories]);

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

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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

  const FilterPanel = ({ mobile = false }: { mobile?: boolean }) => {
    const toggleExpandCategory = (id: string) => {
      setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const isSearchActive = categorySearch.trim().length > 0;

    const visibleRoots = isSearchActive || showAllCategories
      ? filteredCategoryTree
      : filteredCategoryTree.slice(0, 6);

    return (
      <div className={mobile ? "" : "space-y-6"}>
        <div className={mobile ? "mb-6" : ""}>
          <h4 className="text-sm font-semibold text-foreground mb-3">Category</h4>

          {/* Category Search Input */}
          <div className="relative mb-3 px-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full bg-secondary/60 text-xs text-foreground pl-9 pr-8 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-muted-foreground/10 transition-all"
            />
            {categorySearch && (
              <button
                onClick={() => setCategorySearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-secondary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {/* All Products Option */}
            <button
              onClick={() => handleCategoryChange(null)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-all duration-200 ${
                selectedCategoryId === null
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All Products
            </button>

            {/* Recursive Tree Render */}
            {visibleRoots.length > 0 ? (
              <CategoryTreeRender
                nodes={visibleRoots}
                selectedId={selectedCategoryId}
                onSelect={handleCategoryChange}
                expandedMap={expandedCategories}
                onToggleExpand={toggleExpandCategory}
                isSearchActive={isSearchActive}
              />
            ) : (
              <div className="text-xs text-muted-foreground py-3 text-center">
                No matching categories
              </div>
            )}

            {/* Show More / Show Less Controls */}
            {filteredCategoryTree.length > 6 && !isSearchActive && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-2 text-xs font-semibold text-primary hover:text-primary/85 transition-colors flex items-center gap-1 w-full px-3 py-1.5 rounded-lg hover:bg-primary/5"
              >
                {showAllCategories ? (
                  <span>Show Less</span>
                ) : (
                  <span>Show More (+{filteredCategoryTree.length - 6})</span>
                )}
              </button>
            )}
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
  };

  return (
    <div className="container py-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">All Products</span>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-card text-sm text-foreground pl-10 pr-4 py-2.5 rounded-xl shadow-card outline-none focus:ring-2 focus:ring-ring/20"
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
        <div className="flex-1">
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
              {filtered.map((p) => {
                const imageUrl = getCoverImage(p);
                const discountPct = getDiscountPct(p);
                return (
                  <Link
                    href={`/product/${p.id}`}
                    key={p.id}
                    className="bg-card rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover transition-shadow duration-300 relative"
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
                          toggleWishlist(p.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-10"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            wishlist.includes(p.id)
                              ? "fill-destructive text-destructive"
                              : "text-muted-foreground"
                          }`}
                        />
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
                return (
                  <Link
                    href={`/product/${p.id}`}
                    key={p.id}
                    className="bg-card rounded-2xl shadow-card overflow-hidden flex group hover:shadow-card-hover transition-shadow duration-300 relative"
                  >
                    <div className="w-36 sm:w-48 shrink-0 overflow-hidden relative bg-secondary">
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
                      <p className="text-sm font-semibold text-foreground">
                        {p.title}
                      </p>
                      {p.averageRating && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="w-3.5 h-3.5 fill-star text-star" />
                          <span className="text-xs text-muted-foreground">
                            {parseFloat(p.averageRating).toFixed(1)} (
                            {p.ratingCount} reviews)
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
                      {p.category && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {p.category.name}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(p.id)
                            ? "fill-destructive text-destructive"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </Link>
                );
              })}
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
    </div>
  );
}
