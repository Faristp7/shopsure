"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { apiService } from "@/services/api";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void> | void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "hoodie-1",
      name: "Loose Fit Hoodie",
      price: 24.99,
      originalPrice: 49.99,
      quantity: 1,
      variant: "Black / M",
      image: "",
    },
    {
      id: "backpack-1",
      name: "Premium Backpack",
      price: 44.99,
      originalPrice: 89.99,
      quantity: 1,
      variant: "Black",
      image: "",
    },
  ]);

  const addItem = async (item: CartItem) => {
    try {
      // Attempt to save to backend
      await apiService.post('/v1/cart/items', { 
        productId: item.id, 
        quantity: item.quantity 
      });
    } catch (error) {
      console.error("Failed to add to cart API", error);
      // Depending on requirements, we might not want to proceed if the API fails,
      // but typically we'd show a toast here. Proceeding to update local UI for now
      // or we can throw error to be handled by the component.
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};
