"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HomeBanner } from "@/lib/api/home.service";

export default function HeroCarousel({ slides }: { slides: HomeBanner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="container py-8">
      <div className="relative rounded-2xl overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`transition-opacity duration-700 ${i === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          >
            <img src={slide.imageDesktop} alt={slide.title} className="w-full h-[300px] sm:h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent flex items-center">
              <div className="px-8 sm:px-12 max-w-lg">
                {slide.subtitle && (
                  <p className="text-primary-foreground/80 text-sm font-medium mb-2 tracking-wider uppercase">
                    {slide.subtitle}
                  </p>
                )}
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground leading-tight mb-4">
                  {slide.title}
                </h2>
                <Link
                  href={slide.link || "/products"}
                  className="inline-flex items-center gap-2 bg-card text-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity mt-6"
                >
                  {slide.ctaText || "Shop Now"} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors z-10">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors z-10">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "w-6 bg-primary-foreground" : "w-2 bg-primary-foreground/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
