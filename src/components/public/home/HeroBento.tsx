"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HomeBanner } from "@/lib/api/home.service";

const fallbackSlides = [
  {
    id: "fallback-1",
    subtitle: "New Collection 2026",
    title: "Discover Everything You Need",
    desc: "From electronics to fashion, home decor to sports gear — all in one place.",
    imageDesktop: "/assets/user/hero-banner.jpg",
    link: "/products",
    ctaText: "Shop the collection",
  },
  {
    id: "fallback-2",
    subtitle: "Trending Now",
    title: "Fashion Forward Styles",
    desc: "Explore the latest trends in men's and women's fashion at unbeatable prices.",
    imageDesktop: "/assets/user/cat-fashion.jpg",
    link: "/category/fashion",
    ctaText: "Shop the collection",
  },
  {
    id: "fallback-3",
    subtitle: "Stay Active",
    title: "Gear Up for Adventure",
    desc: "Premium sports and outdoor equipment for every athlete and adventurer.",
    imageDesktop: "/assets/user/cat-sports.jpg",
    link: "/category/sports",
    ctaText: "Shop the collection",
  },
];

export default function HeroBento({ slides = [] }: { slides?: HomeBanner[] }) {
  const activeSlides = slides.length > 0 ? slides : fallbackSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, activeSlides.length]);

  const slide = activeSlides[currentSlide];

  return (
    <section className="container pt-10 pb-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-3 sm:gap-4 h-auto md:h-[520px]">
        {/* Large primary banner */}
        <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group animate-scale-in min-h-[360px]">
          <img
            src={slide.imageDesktop}
            alt={slide.title}
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
          
          {activeSlides.length > 1 && (
            <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
              <button
                onClick={prevSlide}
                aria-label="Previous"
                className="w-10 h-10 rounded-full bg-background/90 backdrop-blur hover:bg-background text-foreground flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next"
                className="w-10 h-10 rounded-full bg-background/90 backdrop-blur hover:bg-background text-foreground flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">
            <div className="max-w-xl">
              {slide.subtitle && (
                <p className="text-background/70 text-[10px] font-medium mb-3 tracking-[0.2em] uppercase">
                  {slide.subtitle}
                </p>
              )}
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-background leading-tight mb-3 text-balance">
                {slide.title}
              </h2>
              {"desc" in slide && slide.desc && (
                <p className="text-background/80 text-sm mb-6 leading-relaxed max-w-md hidden sm:block">
                  {slide.desc}
                </p>
              )}
              <Link
                href={slide.link || "/products"}
                className="inline-flex items-center gap-2 bg-background text-foreground font-medium px-6 py-2.5 rounded-full text-sm hover:bg-foreground hover:text-background transition-colors group/btn"
              >
                {slide.ctaText || "Shop the collection"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Dots */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-5 right-7 flex gap-1.5 z-10">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === currentSlide ? "w-8 bg-background" : "w-4 bg-background/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Secondary banner top-right */}
        <Link
          href="/category/fashion"
          className="relative rounded-3xl overflow-hidden group animate-scale-in min-h-[200px]"
        >
          <img
            src="/assets/user/cat-fashion.jpg"
            alt="Fashion edit"
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <p className="text-background/70 text-[10px] font-medium tracking-[0.2em] uppercase mb-2">
              — Edit no. 12
            </p>
            <h4 className="font-display text-lg sm:text-xl font-medium text-background leading-snug">
              Quiet luxury, loud impact
            </h4>
            <span className="inline-flex items-center gap-1 text-background/90 text-xs mt-3 story-link">
              Explore <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Tertiary banner bottom-right */}
        <Link
          href="/category/home-living"
          className="relative rounded-3xl overflow-hidden group animate-scale-in min-h-[200px]"
        >
          <img
            src="/assets/user/cat-home.jpg"
            alt="Home & Living"
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <p className="text-background/70 text-[10px] font-medium tracking-[0.2em] uppercase mb-2">
              — New arrivals
            </p>
            <h4 className="font-display text-lg sm:text-xl font-medium text-background leading-snug">
              Objects for slow living
            </h4>
            <span className="inline-flex items-center gap-1 text-background/90 text-xs mt-3 story-link">
              Discover <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
