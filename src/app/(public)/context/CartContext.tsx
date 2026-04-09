"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cartService } from "@/services/cart.service";
import { useAuth } from "./AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  /** DB CartItem id for authenticated users; productId for guests */
  id: string;
  /** Always the product's id */
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  image: string;
  /** Current stock from backend (present for server-side items) */
  stock?: number;
}

export interface AddCartItemInput {
  /** Product id (used as the item key for guests) */
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  image: string;
  /** Pass stock so we can do client-side pre-validation */
  stock?: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  /** Returns true on success, false on failure (error is set in `error` state) */
  addItem: (input: AddCartItemInput) => Promise<boolean>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
}

// ─── Guest storage ────────────────────────────────────────────────────────────

const STORAGE_KEY = "shopsure_guest_cart";

const guestStorage = {
  load(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  },
  save(items: CartItem[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a deduplication key from productId + variant */
const itemKey = (productId: string, variant?: string) =>
  `${productId}::${variant ?? ""}`;

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** True once we have loaded the initial state (prevents flicker) */
  const initialised = useRef(false);
  /** Whether we are currently operating against the backend */
  const isServerMode = useRef(false);

  // Pending quantity-update debounce
  const pendingUpdates = useRef<Map<string, number>>(new Map());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    if (!isLoggedIn) {
      // Guest: hydrate from localStorage
      setItems(guestStorage.load());
      isServerMode.current = false;
    }
    // Authenticated users are handled by the isLoggedIn effect below on first render
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth state changes ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!initialised.current) return;

    if (isLoggedIn) {
      handleLogin();
    } else {
      handleLogout();
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const localItems = guestStorage.load();
      let serverCart;

      if (localItems.length > 0) {
        // Merge local cart into server cart
        serverCart = await cartService.mergeCart(
          localItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            variant: i.variant,
          }))
        );
        guestStorage.clear();
      } else {
        serverCart = await cartService.getCart();
      }

      isServerMode.current = true;
      setItems(mapServerItems(serverCart.items));
    } catch (err) {
      setError("Failed to load cart. Please try again.");
      // Fall back to what was in localStorage so the cart isn't blank
      const localItems = guestStorage.load();
      if (localItems.length > 0) setItems(localItems);
      isServerMode.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Cancel any pending debounced API calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    pendingUpdates.current.clear();

    isServerMode.current = false;
    setItems([]);
    setError(null);
  };

  // ── Map server response to CartItem ─────────────────────────────────────────

  const mapServerItems = (
    serverItems: Awaited<ReturnType<typeof cartService.getCart>>["items"]
  ): CartItem[] =>
    serverItems.map((si) => ({
      id: si.id,
      productId: si.productId,
      name: si.productTitle,
      price: parseFloat(si.price),
      originalPrice: si.originalPrice ? parseFloat(si.originalPrice) : undefined,
      quantity: si.quantity,
      variant: si.variant || undefined,
      image: si.image ?? "",
      stock: si.stock,
    }));

  // ── addItem ──────────────────────────────────────────────────────────────────

  const addItem = useCallback(
    async (input: AddCartItemInput): Promise<boolean> => {
      const productId = input.id; // callers pass product.id as `id`

      // Client-side stock pre-check
      if (input.stock !== undefined && input.stock < 1) {
        setError("This product is out of stock");
        return false;
      }

      if (isServerMode.current) {
        // ── Authenticated ──
        setIsLoading(true);
        setError(null);
        try {
          const updated = await cartService.addItem(
            productId,
            input.quantity,
            input.variant
          );
          setItems(mapServerItems(updated.items));
          return true;
        } catch (err: any) {
          setError(
            err?.response?.data?.message ?? "Failed to add item to cart"
          );
          return false;
        } finally {
          setIsLoading(false);
        }
      } else {
        // ── Guest (optimistic local update) ──
        setItems((prev) => {
          const key = itemKey(productId, input.variant);
          const existing = prev.find(
            (i) => itemKey(i.productId, i.variant) === key
          );

          let next: CartItem[];
          if (existing) {
            const newQty =
              input.stock !== undefined
                ? Math.min(existing.quantity + input.quantity, input.stock)
                : existing.quantity + input.quantity;
            next = prev.map((i) =>
              itemKey(i.productId, i.variant) === key
                ? { ...i, quantity: newQty }
                : i
            );
          } else {
            next = [
              ...prev,
              {
                id: productId,
                productId,
                name: input.name,
                price: input.price,
                originalPrice: input.originalPrice,
                quantity: input.quantity,
                variant: input.variant,
                image: input.image,
                stock: input.stock,
              },
            ];
          }
          guestStorage.save(next);
          return next;
        });
        return true;
      }
    },
    [] // isServerMode is a ref, safe to omit
  );

  // ── removeItem ───────────────────────────────────────────────────────────────

  const removeItem = useCallback(async (id: string) => {
    if (isServerMode.current) {
      // Optimistic removal
      setItems((prev) => prev.filter((i) => i.id !== id));
      try {
        const updated = await cartService.removeItem(id);
        setItems(mapServerItems(updated.items));
      } catch (err: any) {
        // Revert on failure — reload from server
        try {
          const fresh = await cartService.getCart();
          setItems(mapServerItems(fresh.items));
        } catch {}
        setError(err?.response?.data?.message ?? "Failed to remove item");
      }
    } else {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        guestStorage.save(next);
        return next;
      });
    }
  }, []);

  // ── updateQuantity (debounced for server) ────────────────────────────────────

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (quantity < 0) return;

    if (!isServerMode.current) {
      // ── Guest ──
      setItems((prev) => {
        const next =
          quantity === 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, quantity } : i));
        guestStorage.save(next);
        return next;
      });
      return;
    }

    // ── Authenticated: optimistic UI + debounced API ──
    setItems((prev) =>
      quantity === 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );

    // Queue the update
    pendingUpdates.current.set(id, quantity);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      const batch = new Map(pendingUpdates.current);
      pendingUpdates.current.clear();

      for (const [itemId, qty] of batch) {
        try {
          if (qty === 0) {
            await cartService.removeItem(itemId);
          } else {
            await cartService.updateItem(itemId, qty);
          }
        } catch (err: any) {
          setError(
            err?.response?.data?.message ?? "Failed to update quantity"
          );
          // Reload cart from server to correct any drift
          try {
            const fresh = await cartService.getCart();
            setItems(mapServerItems(fresh.items));
          } catch {}
        }
      }
    }, 800);
  }, []);

  // ── clearCart ────────────────────────────────────────────────────────────────

  const clearCart = useCallback(async () => {
    if (isServerMode.current) {
      setIsLoading(true);
      setError(null);
      try {
        await cartService.clearCart();
        setItems([]);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to clear cart");
      } finally {
        setIsLoading(false);
      }
    } else {
      guestStorage.clear();
      setItems([]);
    }
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────────

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // ── Cleanup debounce on unmount ──────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
