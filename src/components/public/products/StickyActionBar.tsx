"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/app/(public)/context/CartContext";

interface StickyActionBarProps {
  productId: string;
  title: string;
  price: number;
  imageUrl?: string;
  stock?: number;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  productId,
  title,
  price,
  imageUrl = "",
  stock = 10,
}) => {
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [adding, setAdding] = useState(false);

  // Monitor scroll height to show sticky bar after header/hero is scrolled away
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (adding || stock <= 0) return;
    setAdding(true);
    try {
      await addItem({
        id: productId,
        name: title,
        price,
        quantity: 1,
        image: imageUrl,
        stock,
      });
      console.log(`[Analytics] Sticky Add to Cart: ${title}`);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border p-3.5 shadow-xl transition-all duration-300 md:hidden flex items-center justify-between gap-4">
      <div className="flex-1 overflow-hidden">
        <h4 className="text-xs font-bold text-foreground truncate">{title}</h4>
        <span className="text-sm font-black text-foreground">
          ₹{price.toFixed(2)}
        </span>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={stock <= 0}
        className="flex items-center gap-1.5 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:bg-muted disabled:text-muted-foreground"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>{stock <= 0 ? "Out of Stock" : "Add to Cart"}</span>
      </button>
    </div>
  );
};
