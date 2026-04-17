"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { wishlistService, type WishlistItem } from "@/services/wishlist.service";
import { useToast } from "@/hooks/use-toast";

export default function WishlistPage() {
  const { addItem } = useCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    staleTime: 30_000,
  });

  const removeMutation = useMutation({
    mutationFn: wishlistService.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ title: "Removed from wishlist" });
    },
  });

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-8 uppercase tracking-tight">
        My Wishlist ({items.length})
      </h1>

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
          {items.map((product: WishlistItem) => {
            const price = parseFloat(product.price);
            const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
            const discountPct = originalPrice && originalPrice > price
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : null;

            return (
              <div
                key={product.id}
                className="bg-card rounded-2xl overflow-hidden group shadow-card border border-border/50 hover:shadow-card-hover transition-all duration-300"
              >
                <Link href={`/product/${product.productId}`} className="block aspect-square bg-secondary relative overflow-hidden">
                  {product.coverImage ? (
                    <img
                      src={product.coverImage}
                      alt={product.productTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                  )}
                  {!product.isInStock && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground bg-card px-3 py-1 rounded-full border">Out of Stock</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeMutation.mutate(product.productId);
                    }}
                    disabled={removeMutation.isPending}
                    className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center text-destructive hover:bg-card transition-colors shadow-sm"
                  >
                    {removeMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Heart className="w-4 h-4 fill-current" />
                    )}
                  </button>
                </Link>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{product.sellerName}</p>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 h-10">{product.productTitle}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-base font-bold text-foreground">₹{price.toLocaleString("en-IN")}</span>
                    {originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">₹{originalPrice.toLocaleString("en-IN")}</span>
                    )}
                    {discountPct && (
                      <span className="text-[10px] font-bold text-discount bg-discount/10 px-1.5 py-0.5 rounded">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full gap-2 rounded-xl py-5"
                    disabled={!product.isInStock}
                    onClick={() =>
                      addItem({
                        id: product.productId,
                        name: product.productTitle,
                        price,
                        quantity: 1,
                        image: product.coverImage ?? "",
                        stock: product.isInStock ? 99 : 0,
                      })
                    }
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {product.isInStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
