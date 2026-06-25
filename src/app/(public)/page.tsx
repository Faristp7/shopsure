import Link from "next/link";
import { ArrowRight, Star, Truck, ShieldCheck, RotateCcw, Headphones, Zap, Gift, TrendingUp, Quote, Store, Clock, Heart, DollarSign, Package, BadgeCheck, Eye, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import HeroBento from "@/components/public/home/HeroBento";
import FashionShowcase from "@/components/public/home/FashionShowcase";
import { homeService } from "@/lib/api/home.service";
import { ProductCard } from "@/components/public/products/ProductCard";

export const revalidate = 60; // Next.js caching: Add revalidation

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
const productPolo = "/assets/user/product-polo.jpg";
const productTshirt = "/assets/user/product-tshirt.jpg";
const productPolo2 = "/assets/user/product-polo2.jpg";
const productJacket = "/assets/user/product-jacket.jpg";

const perks = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30 day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated support" },
];

const topRatedProducts = [
  { name: "Premium Leather Wallet", price: "$59.99", rating: 4.9, reviews: 1243, img: productJacket },
  { name: "Noise-Cancelling Buds", price: "$79.99", rating: 4.9, reviews: 2105, img: dealEarbuds },
  { name: "Classic Polo Shirt", price: "$34.99", rating: 4.8, reviews: 876, img: productPolo2 },
  { name: "Smart Watch Elite", price: "$149.99", rating: 4.8, reviews: 1567, img: dealWatch },
];

const recentlyViewed = [
  { name: "Sport T-Shirt", price: "$24.99", img: productTshirt },
  { name: "Travel Backpack", price: "$44.99", img: dealBackpack },
  { name: "LED Desk Lamp", price: "$34.99", img: dealLamp },
  { name: "Wireless Earbuds", price: "$29.99", img: dealEarbuds },
  { name: "Running Shoes", price: "$64.99", img: catSports },
];

const recommendedProducts = [
  { name: "Premium Polo", price: "$29.99", rating: 4.5, img: productPolo },
  { name: "Outdoor Jacket", price: "$89.99", rating: 4.7, img: productJacket },
  { name: "Smart Watch", price: "$99.99", rating: 4.6, img: dealWatch },
  { name: "Canvas Backpack", price: "$39.99", rating: 4.4, img: dealBackpack },
];

const priceRanges = [
  { label: "Under $25", range: "$0 - $25", count: 1240, icon: "💰" },
  { label: "$25 - $50", range: "$25 - $50", count: 2350, icon: "💵" },
  { label: "$50 - $100", range: "$50 - $100", count: 1890, icon: "💎" },
  { label: "Over $100", range: "$100+", count: 960, icon: "👑" },
];

const recentlyAddedProducts = [
  { name: "Wireless Charger Pad", price: "$19.99", daysAgo: 1, img: catElectronics },
  { name: "Linen Summer Dress", price: "$45.99", daysAgo: 2, img: catFashion },
  { name: "Ceramic Plant Pot", price: "$15.99", daysAgo: 3, img: catHome },
  { name: "Yoga Mat Pro", price: "$35.99", daysAgo: 3, img: catSports },
  { name: "Face Serum Set", price: "$28.99", daysAgo: 4, img: catBeauty },
  { name: "Bluetooth Speaker", price: "$39.99", daysAgo: 5, img: dealEarbuds },
];

const trendingStores = [
  { name: "TechZone", category: "Electronics", rating: 4.9, products: 342, color: "#1e1b4b" }, // dark indigo
  { name: "StyleHub", category: "Fashion", rating: 4.8, products: 518, color: "#14532d" }, // dark green
  { name: "HomeNest", category: "Home & Living", rating: 4.7, products: 215, color: "#7c2d12" }, // dark orange/brown
  { name: "FitGear Pro", category: "Sports", rating: 4.6, products: 189, color: "#065f46" }, // emerald
  { name: "GlowUp", category: "Beauty", rating: 4.8, products: 276, color: "#9f1239" }, // rose/red
  { name: "GadgetWorld", category: "Electronics", rating: 4.5, products: 403, color: "#1e40af" }, // blue
];

export default async function Index() {
  const data = await homeService.getHome();

  const {
    banners = [],
    categories = [],
    featuredProducts = [],
    deals = [],
    trending = [],
    brands = [],
  } = data || {};

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Bento */}
      <HeroBento slides={banners} />

      {/* Editorial masthead */}
      <section className="container pb-16 animate-fade-up">
        <div className="border-t border-border pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">— Issue 06 · 2026</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground text-balance leading-[1.05] max-w-4xl">
            Everyday objects, <br /><span className="italic font-light text-muted-foreground">considered beautifully.</span>
          </h1>
        </div>
      </section>

      {/* Premium Fashion Showcase */}
      <FashionShowcase />

      {/* Perks — minimal hairline row */}
      <section className="container pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-background p-6 flex items-center gap-3 hover:bg-secondary/40 transition-colors">
              <Icon className="w-5 h-5 text-foreground/70 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories?.length > 0 && (
        <section className="container pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">— Browse</p>
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight">Shop by category</h3>
            </div>
            <Link href="/products" className="text-sm text-foreground story-link hidden sm:inline-block">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                href={`/category/${cat.slug}`}
                key={cat.id}
                className="group cursor-pointer animate-fade-up"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary mb-3">
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="text-sm font-medium text-foreground text-center group-hover:underline underline-offset-4 decoration-1">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts?.length > 0 && (
        <section className="container pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">— Selected</p>
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight">Featured this week</h3>
            </div>
            <Link href="/products" className="text-sm text-foreground story-link hidden sm:inline-block">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  brand: p.brand || "",
                  name: p.title || "",
                  price: `$${p.price || 0}`,
                  rating: p.rating || 0,
                  reviews: p.ratingCount || 0,
                  image: p.imageUrl || "",
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Deals Banner */}
      {deals?.length > 0 && (
        <section className="container pb-20">
          <div className="bg-primary rounded-3xl p-8 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl font-semibold text-primary-foreground tracking-tight">Today's Best Deals</h3>
                <p className="text-sm text-primary-foreground/60 mt-1">Don't miss out on these incredible savings</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {deals.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    brand: p.brand || "",
                    name: p.title || "",
                    price: `$${p.price || 0}`,
                    rating: p.rating || 0,
                    reviews: p.ratingCount || 0,
                    image: p.imageUrl || "",
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bento Grid - Explore */}
      <section className="container pb-20">
        <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight mb-8">Explore What's Hot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {/* Large featured tile */}
          <Link href="/product" className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer animate-scale-in">
            <img src={catFashion} alt="Fashion" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="text-[10px] font-semibold bg-discount text-primary-foreground px-2.5 py-1 rounded-full uppercase tracking-wider">Trending</span>
              <h4 className="font-display text-xl sm:text-2xl font-medium text-primary-foreground mt-3">Fashion Forward</h4>
              <p className="text-sm text-primary-foreground/70 mt-1.5">Up to 40% off select styles</p>
            </div>
          </Link>

          {/* Top right - small */}
          <Link href="/product" className="relative rounded-3xl overflow-hidden group cursor-pointer animate-scale-in">
            <img src={dealWatch} alt="Smart Watch" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h4 className="font-display text-base sm:text-lg font-medium text-primary-foreground">Smart Watches</h4>
              <p className="text-xs text-primary-foreground/75">From $99</p>
            </div>
          </Link>

          {/* Top right - promo card */}
          <div className="bg-primary rounded-3xl p-6 flex flex-col justify-between animate-scale-in">
            <Zap className="w-8 h-8 text-primary-foreground" />
            <div>
              <h4 className="font-display text-base sm:text-lg font-medium text-primary-foreground">Flash Sale</h4>
              <p className="text-xs text-primary-foreground/60 mt-1">Ends in 24 hours</p>
              <button className="mt-4 bg-background text-foreground text-xs font-semibold px-4.5 py-2 rounded-full hover:bg-foreground hover:text-background transition-colors">
                Shop Now
              </button>
            </div>
          </div>

          {/* Bottom right - small */}
          <Link href="/product" className="relative rounded-3xl overflow-hidden group cursor-pointer animate-scale-in">
            <img src={catSports} alt="Sports" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h4 className="font-display text-base sm:text-lg font-medium text-primary-foreground">Active Gear</h4>
              <p className="text-xs text-primary-foreground/75">New arrivals</p>
            </div>
          </Link>

          {/* Bottom right - gift card */}
          <div className="bg-secondary rounded-3xl p-6 flex flex-col justify-between animate-scale-in">
            <Gift className="w-8 h-8 text-foreground/80" />
            <div>
              <h4 className="font-display text-base sm:text-lg font-medium text-foreground">Gift Cards</h4>
              <p className="text-xs text-muted-foreground mt-1">The perfect present</p>
              <button className="mt-4 bg-primary text-primary-foreground text-xs font-semibold px-4.5 py-2 rounded-full hover:opacity-90 transition-opacity">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      {brands?.length > 0 && (
        <section className="container pb-20">
          <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight mb-8">Popular Brands</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link href={`/brand/${brand.name.toLowerCase()}`} key={brand.name} className="bg-card rounded-2xl shadow-card p-6 flex items-center justify-center hover:shadow-card-hover hover-lift transition-all duration-300 cursor-pointer">
                <span className="text-sm font-bold text-muted-foreground tracking-wider line-clamp-1">{brand.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stats / Social proof */}
      <section className="container pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "50K+", label: "Happy Customers", icon: Star },
            { value: "10K+", label: "Products Listed", icon: Gift },
            { value: "99%", label: "Satisfaction Rate", icon: TrendingUp },
            { value: "150+", label: "Brands Available", icon: ShieldCheck },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-card rounded-2xl shadow-card p-6 text-center hover-lift transition-all duration-300">
              <Icon className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
              <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container pb-20">
        <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight mb-8">What Our Customers Say</h3>
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {[
            { name: "Sarah K.", text: "Absolutely love the variety! Found everything from home decor to tech gadgets. Fast shipping too!", rating: 5 },
            { name: "James R.", text: "Best online shopping experience. The quality is consistently great and returns are hassle-free.", rating: 5 },
            { name: "Priya M.", text: "The deals section is amazing. Saved so much on my last purchase. Highly recommend Nextgen!", rating: 4 },
          ].map((t) => (
            <div key={t.name} className="bg-card rounded-3xl shadow-card p-6 sm:p-8 flex flex-col hover-lift transition-all duration-300">
              <Quote className="w-7 h-7 text-muted-foreground/20 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 text-pretty">{t.text}</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-star text-star" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Stores */}
      <section className="container pb-20 animate-fade-up">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">— Featured</p>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight">Trending Stores</h3>
          </div>
          <Link href="/products" className="text-sm text-foreground story-link hidden sm:inline-block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingStores.map((store) => (
            <div key={store.name} className="bg-card rounded-2xl shadow-card p-5 text-center hover:shadow-card-hover hover-lift transition-all duration-300 cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-primary-foreground font-bold text-lg" style={{ backgroundColor: store.color }}>
                {store.name.charAt(0)}
              </div>
              <p className="text-sm font-semibold text-foreground">{store.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{store.category}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="w-3 h-3 fill-star text-star" />
                <span className="text-xs font-medium text-foreground">{store.rating}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{store.products} products</p>
            </div>
          ))}
        </div>
      </section>


      {/* Top Rated Products */}
      <section className="container pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">— Highest quality</p>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight">Top Rated Products</h3>
          </div>
          <Link href="/products" className="text-sm text-foreground story-link hidden sm:inline-block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {topRatedProducts.map((p) => (
            <Link href="/product" key={p.name} className="bg-card rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover hover-lift transition-all duration-300">
              <div className="aspect-square overflow-hidden relative bg-secondary">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" />
                <span className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm text-foreground text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-star text-star" /> {p.rating}
                </span>
              </div>
              <div className="p-4 px-5">
                <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.reviews.toLocaleString()} reviews</p>
                <p className="text-sm font-bold text-foreground mt-2">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-display text-2xl font-medium text-foreground tracking-tight">Recently Viewed</h3>
          </div>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Clear All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recentlyViewed.map((p) => (
            <Link href="/product" key={p.name} className="bg-card rounded-2xl shadow-card overflow-hidden flex-shrink-0 w-[170px] hover:shadow-card-hover hover-lift transition-all duration-300 group">
              <div className="aspect-square overflow-hidden bg-secondary">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-foreground line-clamp-1">{p.name}</p>
                <p className="text-xs font-bold text-foreground mt-1">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended For You */}
      <section className="container pb-20">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-star" />
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight">Recommended For You</h3>
          </div>
          <Link href="/products" className="text-sm text-foreground story-link hidden sm:inline-block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {recommendedProducts.map((p) => (
            <Link href="/product" key={p.name} className="bg-card rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover hover-lift transition-all duration-300">
              <div className="aspect-square overflow-hidden relative bg-secondary">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" />
                <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors">
                  <Heart className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <div className="p-4 px-5">
                <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Star className="w-3.5 h-3.5 fill-star text-star" />
                  <span className="text-xs text-muted-foreground font-medium">{p.rating}</span>
                </div>
                <p className="text-sm font-bold text-foreground mt-2">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* Recently Added Products */}
      <section className="container pb-20">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight">Recently Added</h3>
          </div>
          <Link href="/products" className="text-sm text-foreground story-link hidden sm:inline-block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentlyAddedProducts.map((p) => (
            <Link href="/product" key={p.name} className="bg-card rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover hover-lift transition-all duration-300">
              <div className="aspect-square overflow-hidden relative bg-secondary">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" />
                <span className="absolute top-3 left-3 bg-success text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                  {p.daysAgo === 1 ? "New today" : `${p.daysAgo}d ago`}
                </span>
              </div>
              <div className="p-3.5">
                <p className="text-xs font-semibold text-foreground line-clamp-1">{p.name}</p>
                <p className="text-xs font-bold text-foreground mt-1">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Become a Seller */}
      <section className="container pb-20">
        <div className="relative bg-primary rounded-3xl overflow-hidden shadow-card">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-primary-foreground" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-2 border-primary-foreground" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary-foreground" />
          </div>
          <div className="relative p-8 sm:p-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-primary-foreground/10 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <Store className="w-3.5 h-3.5" /> Marketplace
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-medium text-primary-foreground leading-tight mb-4">
                  Start Selling on ShopSure
                </h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
                  Join thousands of sellers reaching millions of customers. Set up your store in minutes, manage inventory easily, and grow your business with our powerful seller tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/seller" className="bg-background text-foreground font-semibold px-6 py-3 rounded-full text-sm hover:bg-foreground hover:text-background transition-colors inline-flex items-center justify-center gap-2">
                    Register as Seller <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button className="border border-primary-foreground/30 text-primary-foreground font-medium px-6 py-3 rounded-full text-sm hover:bg-primary-foreground/10 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: DollarSign, title: "Low Commission", desc: "Start from just 5%" },
                  { icon: TrendingUp, title: "Analytics", desc: "Real-time insights" },
                  { icon: Truck, title: "Fulfillment", desc: "We handle shipping" },
                  { icon: BadgeCheck, title: "Verified Badge", desc: "Build trust fast" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-primary-foreground/10 rounded-2xl p-4">
                    <Icon className="w-5 h-5 text-primary-foreground mb-2" />
                    <p className="text-sm font-semibold text-primary-foreground">{title}</p>
                    <p className="text-xs text-primary-foreground/60 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container pb-20">
        <div className="bg-card rounded-3xl shadow-card p-8 sm:p-12 text-center">
          <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Stay in the Loop</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-secondary text-sm rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground border border-border"
            />
            <button className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
