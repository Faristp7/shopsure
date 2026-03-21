"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { brands } from "../../data/brands";

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const brand = slug ? brands[slug] : undefined;

  if (!brand) {
    return (
      <div className="bg-background">
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Brand not found</h1>
          <Link href="/user" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="container">
        <Breadcrumb label={brand.name} />
      </div>

      {/* Hero Banner */}
      <section className="container pb-8">
        <div className="relative rounded-2xl overflow-hidden">
          <img src={brand.banner} alt={brand.name} className="w-full h-[260px] sm:h-[380px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent flex items-center">
            <div className="px-8 sm:px-12 max-w-lg">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-primary-foreground leading-tight">{brand.name}</h1>
              <p className="text-lg sm:text-xl text-primary-foreground/80 font-medium mt-2 italic">{brand.tagline}</p>
              <p className="text-sm text-primary-foreground/60 mt-3 leading-relaxed">{brand.description}</p>
              <button className="mt-5 inline-flex items-center gap-2 bg-card text-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity">
                Shop All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section className="container pb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap">All</button>
          {brand.categories.map((cat) => (
            <button key={cat} className="bg-secondary text-muted-foreground text-sm font-medium px-4 py-2 rounded-full hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brand.products.map((p) => (
            <Link
              href="/user/product"
              key={p.name}
              className="bg-card rounded-2xl shadow-card overflow-hidden group cursor-pointer hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden relative">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.tag && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {p.tag}
                  </span>
                )}
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

      {/* Brand CTA */}
      <section className="container pb-16">
        <div className="bg-card rounded-2xl shadow-card p-8 sm:p-10 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">More from {brand.name}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Sign up to get early access to new {brand.name} drops, exclusive deals, and more.
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
