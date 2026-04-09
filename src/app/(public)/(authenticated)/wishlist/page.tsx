"use client";

import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

const wishlistProducts = [
  { id: "w1", name: "Classic Leather Jacket", price: 189, originalPrice: 249, image: "/assets/user/cat-fashion.jpg", rating: 4.6, store: "UrbanEdge" },
  { id: "w2", name: "Wireless Noise-Cancelling Headphones", price: 79, originalPrice: 129, image: "/assets/user/cat-electronics.jpg", rating: 4.8, store: "TechHive" },
  { id: "w3", name: "Running Shoes Pro", price: 119, originalPrice: 159, image: "/assets/user/cat-sports.jpg", rating: 4.5, store: "SportMax" },
  { id: "w4", name: "Minimalist Watch", price: 65, originalPrice: 95, image: "/assets/user/deal-watch.jpg", rating: 4.7, store: "TimeCraft" },
];

export default function WishlistPage() {
  const { isLoggedIn, toggleWishlist } = useAuth();
  const { addItem } = useCart();

  // if (!isLoggedIn) return null; 
  // Handled by layout

  const items = wishlistProducts;

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-8 uppercase tracking-tight">My Wishlist ({items.length})</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl shadow-card border border-border/50">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-8">Browse products and tap the heart icon to save them</p>
          <Link href="/products">
            <Button className="rounded-full px-8">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <div key={product.id} className="bg-card rounded-2xl overflow-hidden group shadow-card border border-border/50 hover:shadow-card-hover transition-all duration-300">
              <div className="aspect-square bg-secondary relative overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center text-destructive hover:bg-card transition-colors shadow-sm"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{product.store}</p>
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 h-10">{product.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base font-bold text-foreground">${product.price}</span>
                  <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                  <span className="text-[10px] font-bold text-discount bg-discount/10 px-1.5 py-0.5 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
                <Button
                  size="sm"
                  className="w-full gap-2 rounded-xl py-5"
                  onClick={() => addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image })}
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
