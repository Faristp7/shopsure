"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { wishlistService } from "@/services/wishlist.service";
import { useAuth } from "@/app/(public)/context/AuthContext";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  onToggle?: (isWishlisted: boolean) => void;
}

const LOCAL_STORAGE_KEY = "shopsure_guest_wishlist";

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className = "",
  onToggle,
}) => {
  const { isLoggedIn } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hydrate state
  useEffect(() => {
    const checkStatus = async () => {
      if (isLoggedIn) {
        try {
          const res = await wishlistService.isInWishlist(productId);
          setIsWishlisted(res.inWishlist);
        } catch (err) {
          console.error("Error checking wishlist status", err);
        }
      } else {
        try {
          const guestWish = localStorage.getItem(LOCAL_STORAGE_KEY);
          const list: string[] = guestWish ? JSON.parse(guestWish) : [];
          setIsWishlisted(list.includes(productId));
        } catch {
          setIsWishlisted(false);
        }
      }
    };
    checkStatus();
  }, [productId, isLoggedIn]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    const targetStatus = !isWishlisted;

    if (isLoggedIn) {
      try {
        if (targetStatus) {
          await wishlistService.addToWishlist(productId);
          toast.success("Added to wishlist!");
        } else {
          await wishlistService.removeFromWishlist(productId);
          toast.success("Removed from wishlist!");
        }
        setIsWishlisted(targetStatus);
        if (onToggle) onToggle(targetStatus);
      } catch (err) {
        toast.error("Failed to update wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // LocalStorage for Guest Users
      try {
        const guestWish = localStorage.getItem(LOCAL_STORAGE_KEY);
        let list: string[] = guestWish ? JSON.parse(guestWish) : [];

        if (targetStatus) {
          if (!list.includes(productId)) {
            list.push(productId);
          }
          toast.success("Added to wishlist (Guest)!");
        } else {
          list = list.filter((id) => id !== productId);
          toast.success("Removed from wishlist!");
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
        setIsWishlisted(targetStatus);
        if (onToggle) onToggle(targetStatus);
      } catch {
        toast.error("Error updating local wishlist.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur shadow-md hover:scale-110 active:scale-95 transition-all w-9 h-9 border border-black/5 dark:border-white/5 ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-slate-500 hover:text-red-500 dark:text-slate-400"
        }`}
      />
    </button>
  );
};
