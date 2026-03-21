"use client";

import Link from "next/link";
import { ArrowRight, Star, Truck, ShieldCheck, RotateCcw, Headphones, Zap, Gift, TrendingUp, Quote, Store, Clock, Heart, DollarSign, Package, BadgeCheck, Eye, Sparkles } from "lucide-react";

// Use absolute paths for public assets
const heroBanner = "/assets/user/hero-banner.jpg";
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

const categories = [
  { name: "Electronics", img: catElectronics },
  { name: "Fashion", img: catFashion },
  { name: "Home & Living", img: catHome },
  { name: "Sports", img: catSports },
  { name: "Beauty", img: catBeauty },
];

const featuredProducts = [
  { name: "Wireless Headphones", price: "$49.99", original: "$79.99", rating: 4.6, img: catElectronics },
  { name: "Leather Tote Bag", price: "$89.99", original: null, rating: 4.8, img: catFashion },
  { name: "Desk Lamp", price: "$34.99", original: "$54.99", rating: 4.3, img: dealLamp },
  { name: "Running Shoes", price: "$64.99", original: null, rating: 4.5, img: catSports },
  { name: "Premium Backpack", price: "$44.99", original: "$59.99", rating: 4.4, img: dealBackpack },
  { name: "Wireless Earbuds", price: "$29.99", original: null, rating: 4.7, img: dealEarbuds },
  { name: "Polo Shirt", price: "$19.99", original: "$29.99", rating: 4.2, img: productPolo },
  { name: "Striped Jacket", price: "$39.99", original: null, rating: 4.7, img: productJacket },
];

const deals = [
  { name: "Premium Backpack", price: "$44.99", original: "$89.99", discount: "50%", img: dealBackpack },
  { name: "Minimalist Desk Lamp", price: "$27.99", original: "$54.99", discount: "49%", img: dealLamp },
  { name: "Wireless Earbuds Pro", price: "$24.99", original: "$49.99", discount: "50%", img: dealEarbuds },
];

const perks = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30 day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated support" },
];

const trendingStores = [
  { name: "TechZone", category: "Electronics", rating: 4.9, products: 342, color: "hsl(var(--primary))" },
  { name: "StyleHub", category: "Fashion", rating: 4.8, products: 518, color: "hsl(var(--discount))" },
  { name: "HomeNest", category: "Home & Living", rating: 4.7, products: 215, color: "hsl(var(--success))" },
  { name: "FitGear Pro", category: "Sports", rating: 4.6, products: 189, color: "hsl(var(--star))" },
  { name: "GlowUp", category: "Beauty", rating: 4.8, products: 276, color: "hsl(var(--destructive))" },
  { name: "GadgetWorld", category: "Electronics", rating: 4.5, products: 403, color: "hsl(var(--primary))" },
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

export default function UserHomePage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="container py-8">
        <div className="relative rounded-2xl overflow-hidden">
          <img src={heroBanner} alt="Shop everything" className="w-full h-[300px] sm:h-[420px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent flex items-center">
            <div className="px-8 sm:px-12 max-w-lg">
              <p className="text-primary-foreground/80 text-sm font-medium mb-2 tracking-wider uppercase">New Collection 2024</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground leading-tight mb-4">
                Discover Everything You Need
              </h2>
              <p className="text-primary-foreground/70 text-sm mb-6 leading-relaxed">
                From electronics to fashion, home decor to sports gear — all in one place.
              </p>
              <Link
                href="/user/product"
                className="inline-flex items-center gap-2 bg-card text-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Perks bar */}
      <section className="container pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-2xl shadow-card p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container pb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Shop by Category</h3>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-card rounded-2xl shadow-card overflow-hidden group cursor-pointer hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-semibold text-foreground">{cat.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container pb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Featured Products</h3>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <Link
              href="/user/products"
              key={p.name}
              className="bg-card rounded-2xl shadow-card overflow-hidden group cursor-pointer hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3.5 h-3.5 fill-star text-star" />
                  <span className="text-xs text-muted-foreground">{p.rating}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-foreground">{p.price}</span>
                  {p.original && <span className="text-xs text-muted-foreground line-through">{p.original}</span>}
                  {p.original && (
                    <span className="text-[10px] font-semibold bg-discount/10 text-discount px-1.5 py-0.5 rounded-md">Sale</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals Banner */}
      <section className="container pb-12">
        <div className="bg-primary rounded-2xl p-8 sm:p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-primary-foreground">Today's Best Deals</h3>
              <p className="text-sm text-primary-foreground/60 mt-1">Don't miss out on these incredible savings</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {deals.map((d) => (
              <Link href="/user/products" key={d.name} className="bg-card rounded-2xl overflow-hidden group hover:shadow-card-hover transition-shadow duration-300">
                <div className="aspect-square overflow-hidden relative">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-discount text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                    -{d.discount}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">{d.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-foreground">{d.price}</span>
                    <span className="text-xs text-muted-foreground line-through">{d.original}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid - Explore */}
      <section className="container pb-12">
        <h3 className="text-xl font-bold text-foreground mb-6">Explore What's Hot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {/* Large featured tile */}
          <Link href="/user/products" className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src={catFashion} alt="Fashion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="text-[10px] font-semibold bg-discount text-primary-foreground px-2 py-1 rounded-full uppercase tracking-wider">Trending</span>
              <h4 className="text-xl font-bold text-primary-foreground mt-2">Fashion Forward</h4>
              <p className="text-sm text-primary-foreground/70 mt-1">Up to 40% off select styles</p>
            </div>
          </Link>

          {/* Top right - small */}
          <Link href="/user/products" className="relative rounded-2xl overflow-hidden group {cursor-pointer}">
            <img src={dealWatch} alt="Smart Watch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h4 className="text-sm font-bold text-primary-foreground">Smart Watches</h4>
              <p className="text-xs text-primary-foreground/70">From $99</p>
            </div>
          </Link>

          {/* Top right - promo card */}
          <div className="bg-primary rounded-2xl p-6 flex flex-col justify-between">
            <Zap className="w-8 h-8 text-primary-foreground" />
            <div>
              <h4 className="text-sm font-bold text-primary-foreground">Flash Sale</h4>
              <p className="text-xs text-primary-foreground/60 mt-1">Ends in 24 hours</p>
              <button className="mt-3 bg-card text-foreground text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Shop Now
              </button>
            </div>
          </div>

          {/* Bottom right - small */}
          <Link href="/user/products" className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src={catSports} alt="Sports" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h4 className="text-sm font-bold text-primary-foreground">Active Gear</h4>
              <p className="text-xs text-primary-foreground/70">New arrivals</p>
            </div>
          </Link>

          {/* Bottom right - gift card */}
          <div className="bg-secondary rounded-2xl p-6 flex flex-col justify-between">
            <Gift className="w-8 h-8 text-foreground" />
            <div>
              <h4 className="text-sm font-bold text-foreground">Gift Cards</h4>
              <p className="text-xs text-muted-foreground mt-1">The perfect present</p>
              <button className="mt-3 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Brands */}
      <section className="container pb-12">
        <h3 className="text-xl font-bold text-foreground mb-6">Popular Brands</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[
            { name: "Nike", slug: "nike" },
            { name: "Adidas", slug: "adidas" },
            { name: "Sony", slug: "sony" },
            { name: "Samsung", slug: "samsung" },
            { name: "IKEA", slug: "ikea" },
            { name: "Zara", slug: "zara" },
          ].map((brand) => (
            <Link href={`/user/brand/${brand.slug}`} key={brand.slug} className="bg-card rounded-2xl shadow-card p-6 flex items-center justify-center hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
              <span className="text-sm font-bold text-muted-foreground tracking-wider">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container pb-12">
        <h3 className="text-xl font-bold text-foreground mb-6">What Our Customers Say</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Sarah K.", text: "Absolutely love the variety! Found everything from home decor to tech gadgets. Fast shipping too!", rating: 5 },
            { name: "James R.", text: "Best online shopping experience. The quality is consistently great and returns are hassle-free.", rating: 5 },
            { name: "Priya M.", text: "The deals section is amazing. Saved so much on my last purchase. Highly recommend Nextgen!", rating: 4 },
          ].map((t) => (
            <div key={t.name} className="bg-card rounded-2xl shadow-card p-6 flex flex-col">
              <Quote className="w-6 h-6 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t.text}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
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

      {/* Become a Seller */}
      <section className="container pb-12">
        <div className="relative bg-primary rounded-2xl overflow-hidden">
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
                <h3 className="text-2xl sm:text-3xl font-extrabold text-primary-foreground leading-tight mb-4">
                  Start Selling on ShopSure
                </h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
                  Join thousands of sellers reaching millions of customers. Set up your store in minutes, manage inventory easily, and grow your business with our powerful seller tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/seller" className="bg-card text-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
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
                  <div key={title} className="bg-primary-foreground/10 rounded-xl p-4">
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
      <section className="container pb-16">
        <div className="bg-card rounded-2xl shadow-card p-8 sm:p-10 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Stay in the Loop</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-secondary text-sm rounded-full py-3 px-5 outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground"
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
