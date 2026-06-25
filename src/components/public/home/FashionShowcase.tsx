"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const fashionBanner = "/assets/user/fashion-banner.jpg";
const fashionWomen = "/assets/user/fashion-women.jpg";
const fashionMen = "/assets/user/fashion-men.jpg";
const nikeShoes = "/assets/user/nike-shoes1.jpg";
const fashionAccessories = "/assets/user/fashion-accessories.jpg";
const fashionLuxury = "/assets/user/fashion-luxury.jpg";

const categoryCards = [
  {
    name: "Women's Collection",
    tagline: "Effortless elegance",
    img: fashionWomen,
    href: "/category/women",
    span: "md:col-span-2 md:row-span-2",
    aspect: "aspect-square md:aspect-auto",
  },
  {
    name: "Men's Collection",
    tagline: "Refined essentials",
    img: fashionMen,
    href: "/category/men",
    span: "",
    aspect: "aspect-[4/5]",
  },
  {
    name: "Footwear",
    tagline: "Step with intention",
    img: nikeShoes,
    href: "/category/footwear",
    span: "",
    aspect: "aspect-[4/5]",
  },
  {
    name: "Accessories",
    tagline: "Curated details",
    img: fashionAccessories,
    href: "/category/accessories",
    span: "md:col-span-2",
    aspect: "aspect-[16/9] md:aspect-auto",
  },
  {
    name: "Luxury Essentials",
    tagline: "Timeless investment",
    img: fashionLuxury,
    href: "/category/luxury",
    span: "",
    aspect: "aspect-[4/5]",
  },
];

export default function FashionShowcase() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle abstract background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-stone-100/60 to-stone-200/30 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-stone-100/50 to-stone-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] rounded-full bg-gradient-to-tl from-stone-100/40 to-transparent blur-3xl" />
      </div>

      <div className="container relative z-10 pb-20">
        {/* Featured Banner */}
        <div className="relative rounded-[2rem] overflow-hidden mb-10 animate-fade-up">
          <div className="aspect-[16/9] md:aspect-[21/9]">
            <img
              src={fashionBanner}
              alt="Curated Fashion for Modern Living"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Soft gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-12 md:p-16">
            <div className="max-w-xl">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-background/60 mb-4">
                — The Edit · 2026
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-background leading-[1.05] tracking-tight text-balance mb-4">
                Curated Fashion for Modern Living
              </h2>
              <p className="text-sm md:text-base text-background/75 leading-relaxed max-w-md mb-8 text-pretty">
                Explore timeless essentials, elevated basics, and statement pieces designed to bring effortless sophistication to your everyday wardrobe.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 bg-background text-foreground font-medium px-7 py-3 rounded-full text-sm hover:bg-foreground hover:text-background transition-colors duration-300 group/btn"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-end justify-between mb-8 animate-fade-up">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
              — Browse by Category
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight">
              The Collection
            </h3>
          </div>
          <Link
            href="/products"
            className="text-sm text-foreground story-link hidden sm:inline-block"
          >
            View all
          </Link>
        </div>

        {/* Category Cards — editorial bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {categoryCards.map((card, i) => (
            <Link
              href={card.href}
              key={card.name}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer animate-fade-up ${card.span}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-full h-full ${card.aspect}`}>
                <img
                  src={card.img}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>
              {/* Soft gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-background/60 mb-1.5">
                  {card.tagline}
                </p>
                <h4 className="font-display text-lg sm:text-xl font-medium text-background leading-snug">
                  {card.name}
                </h4>
                <span className="inline-flex items-center gap-1 text-background/80 text-xs mt-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Discover <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Subtle border glow on hover */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
