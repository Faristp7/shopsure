"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

const COLORS = [
  { label: "Black", value: "black", hex: "#1a1a1a" },
  { label: "Charcoal", value: "charcoal", hex: "#4a4a4a" },
  { label: "Cream", value: "cream", hex: "#f5f0e8" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductInfo = () => {
  const { addItem, isLoading } = useCart();
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const price = 24.99;
  const originalPrice = 49.99;
  const discount = Math.round((1 - price / originalPrice) * 100);

  const handleAddToCart = async () => {
    await addItem({
      id: "hoodie-1",
      name: "Loose Fit Hoodie",
      price,
      originalPrice,
      quantity,
      variant: `${selectedColor.label} / ${selectedSize}`,
      image: "/assets/user/hoodie-main.jpg",
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Brand & Title */}
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
          ShopSure Essentials
        </p>
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          Loose Fit Hoodie
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i <= 4 ? "fill-star text-star" : "fill-muted text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground">4.5</span>
        <span className="text-sm text-muted-foreground">(50 reviews)</span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-foreground">
          ${price.toFixed(2)}
        </span>
        <span className="text-lg text-muted-foreground line-through">
          ${originalPrice.toFixed(2)}
        </span>
        <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-0.5 rounded-full">
          -{discount}%
        </span>
      </div>

      {/* Color Selector */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">
          Color: <span className="font-normal text-muted-foreground">{selectedColor.label}</span>
        </p>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color)}
              title={color.label}
              className={`w-8 h-8 rounded-full transition-all duration-150 ${
                selectedColor.value === color.value
                  ? "ring-2 ring-offset-2 ring-primary"
                  : "ring-1 ring-border"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">
          Size: <span className="font-normal text-muted-foreground">{selectedSize}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`min-w-[42px] h-10 px-3 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                selectedSize === size
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity + Actions */}
      <div className="flex items-center gap-3">
        {/* Quantity stepper */}
        <div className="flex items-center gap-1 border border-border rounded-xl bg-card">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-2xl hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted((w) => !w)}
          className="w-12 h-12 flex items-center justify-center border border-border rounded-2xl bg-card hover:border-primary/50 transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${wishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
          />
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
