"use client";

import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

const wishlistProducts = [
  { id: "w1", name: "Classic Leather Jacket", price: 189, originalPrice: 249, image: "/assets/user/product-jacket.jpg", rating: 4.6, store: "UrbanEdge" },
  { id: "w2", name: "Wireless Noise-Cancelling Headphones", price: 79, originalPrice: 129, image: "/assets/user/cat-electronics.jpg", rating: 4.8, store: "TechHive" },
  { id: "w3", name: "Running Shoes Pro", price: 119, originalPrice: 159, image: "/assets/user/cat-sports.jpg", rating: 4.5, store: "SportMax" },
  { id: "w4", name: "Minimalist Watch", price: 65, originalPrice: 95, image: "/assets/user/deal-watch.jpg", rating: 4.7, store: "TimeCraft" },
];

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useAuth();
  const { addItem } = useCart();

  // Show mock items for demo
  const items = wishlistProducts;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Wishlist ({items.length})</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">Browse products and tap the heart icon to save them</p>
          <Link href="/user/products"><Button>Browse Products</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((product) => (
            <div key={product.id} className="bg-card rounded-2xl overflow-hidden group">
              <div className="aspect-square bg-secondary relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center text-destructive hover:bg-card transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{product.store}</p>
                <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-foreground">${product.price}</span>
                  <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                  <span className="text-xs text-[hsl(var(--discount))] font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </div>
                <Button
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={() => addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image })}
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
