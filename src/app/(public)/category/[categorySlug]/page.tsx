"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Heart, SlidersHorizontal, ChevronDown, X, Grid3X3, LayoutList } from "lucide-react";

// Asset paths
const catElectronics = "/assets/user/cat-electronics.jpg";
const catFashion = "/assets/user/cat-fashion.jpg";
const catHome = "/assets/user/cat-home.jpg";
const catSports = "/assets/user/cat-sports.jpg";
const catBeauty = "/assets/user/cat-beauty.jpg";
const dealBackpack = "/assets/user/deal-backpack.jpg";
const dealLamp = "/assets/user/deal-lamp.jpg";
const dealEarbuds = "/assets/user/deal-earbuds.jpg";
const dealWatch = "/assets/user/deal-watch.jpg";

const allProducts = [
  { id: 1, name: "Wireless Headphones Pro", price: 49.99, original: 79.99, rating: 4.6, reviews: 234, category: "Electronics", brand: "TechZone", img: catElectronics },
  { id: 2, name: "Leather Tote Bag", price: 89.99, original: null, rating: 4.8, reviews: 156, category: "Fashion", brand: "StyleHub", img: catFashion },
  { id: 3, name: "Minimalist Desk Lamp", price: 34.99, original: 54.99, rating: 4.3, reviews: 89, category: "Home & Living", brand: "HomeNest", img: dealLamp },
  { id: 4, name: "Running Shoes Elite", price: 64.99, original: null, rating: 4.5, reviews: 312, category: "Sports", brand: "FitGear", img: catSports },
  { id: 5, name: "Premium Backpack", price: 44.99, original: 59.99, rating: 4.4, reviews: 198, category: "Fashion", brand: "StyleHub", img: dealBackpack },
  { id: 6, name: "Wireless Earbuds", price: 29.99, original: null, rating: 4.7, reviews: 445, category: "Electronics", brand: "TechZone", img: dealEarbuds },
  { id: 9, name: "Smart Watch Elite", price: 149.99, original: 199.99, rating: 4.8, reviews: 567, category: "Electronics", brand: "Samsung", img: dealWatch },
  { id: 12, name: "Beauty Skincare Set", price: 55.99, original: 75.99, rating: 4.6, reviews: 189, category: "Beauty", brand: "GlowUp", img: catBeauty },
];

const categorySlugMap: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  "home-living": "Home & Living",
  sports: "Sports",
  beauty: "Beauty",
};

const brands = ["All", "TechZone", "StyleHub", "HomeNest", "FitGear", "Nike", "Adidas", "Samsung", "Sony", "Zara", "GlowUp"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "Over $100", min: 100, max: Infinity },
];
const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];
const ratings = [4, 3, 2, 1];

export default function CategoryPage({ params }: { params: { categorySlug: string } }) {
  const selectedCategory = categorySlugMap[params.categorySlug] || "All";
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const activeFilters = [
    selectedBrand !== "All" ? selectedBrand : null,
    selectedPrice !== 0 ? priceRanges[selectedPrice].label : null,
    selectedRating > 0 ? `${selectedRating}+ Stars` : null,
  ].filter(Boolean);

  const clearAllFilters = () => {
    setSelectedBrand("All");
    setSelectedPrice(0);
    setSelectedRating(0);
  };

  let filtered = allProducts.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    if (selectedBrand !== "All" && p.brand !== selectedBrand) return false;
    const range = priceRanges[selectedPrice];
    if (p.price < range.min || p.price > range.max) return false;
    if (selectedRating > 0 && p.rating < selectedRating) return false;
    return true;
  });

  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

  const FilterPanel = ({ mobile = false }: { mobile?: boolean }) => (
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

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Rating</h4>
        <div className="space-y-1.5">
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
                  <Star key={i} className={`w-3.5 h-3.5 ${i < r ? "fill-star text-star" : "text-muted"}`} />
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
    <div className="container py-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{selectedCategory}</span>
      </div>

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
            <span className="font-semibold text-foreground">{filtered.length}</span> products in <span className="font-semibold">{selectedCategory}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-card rounded-xl shadow-card overflow-hidden">
            <button onClick={() => setGridView(true)} className={`p-2.5 ${gridView ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setGridView(false)} className={`p-2.5 ${!gridView ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
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
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-card rounded-2xl shadow-card p-5 sticky top-24">
            <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl shadow-card">
              <p className="text-lg font-semibold text-foreground mb-2">No products found</p>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
              <button onClick={clearAllFilters} className="bg-primary text-primary-foreground text-sm font-medium px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                Clear Filters
              </button>
            </div>
          ) : gridView ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <Link href="/product" key={p.id} className="bg-card rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover transition-shadow duration-300 relative">
                  <div className="aspect-square overflow-hidden relative">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button onClick={(e) => { e.preventDefault(); toggleWishlist(p.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-10">
                      <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{p.brand}</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-star text-star" />
                      <span className="text-xs text-muted-foreground">{p.rating}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground mt-2">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => (
                <Link href="/product" key={p.id} className="bg-card rounded-2xl shadow-card overflow-hidden flex group hover:shadow-card-hover transition-shadow duration-300 relative">
                  <div className="w-36 sm:w-48 shrink-0 overflow-hidden relative">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex flex-col justify-center flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{p.brand}</p>
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-star text-star" />
                      <span className="text-xs text-muted-foreground">{p.rating}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground mt-2">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden focus-within:outline-none">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-card shadow-xl overflow-y-auto">
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
              <button onClick={() => setShowFilters(false)} className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl mt-4">
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
