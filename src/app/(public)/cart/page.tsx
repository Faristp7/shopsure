"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Minus, Plus, RefreshCw, AlertCircle, Loader2, Tag, Check, Ticket } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const CartPage = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    isLoading,
    error,
    couponCode,
    appliedCoupon,
    couponError,
    isValidatingCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { isLoggedIn, setShowLogin } = useAuth();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");

  const subtotal = total;
  // Match backend shipping configuration (₹999 free shipping threshold, ₹99 flat fee otherwise)
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const tax = +(subtotal * 0.18).toFixed(2);
  const discount = appliedCoupon?.discountAmount ?? 0;
  const grandTotal = +(subtotal + shipping + tax - discount).toFixed(2);

  // Sync state with active coupon code from context during render to avoid cascading renders
  const [prevCouponCode, setPrevCouponCode] = useState(couponCode);
  if (couponCode !== prevCouponCode) {
    setPrevCouponCode(couponCode);
    setCouponInput(couponCode ?? "");
  }

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      toast.error("Please enter a coupon code.");
      return;
    }
    const success = await applyCoupon(code);
    if (success) {
      toast.success("Coupon applied successfully!");
    } else {
      toast.error("Could not apply coupon.");
    }
  };

  const clearAppliedCoupon = () => {
    removeCoupon();
    setCouponInput("");
    toast.info("Coupon removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight">Your Cart</h1>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Syncing…
            </div>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {items.length === 0 && !isLoading ? (
          <div className="text-center py-20 bg-card rounded-3xl shadow-card">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="flex flex-col divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 py-6 first:pt-0">
                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="mt-4 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 disabled:opacity-40"
                      aria-label="Remove item"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={item.image || "/assets/user/hoodie-main.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">{item.name}</h3>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                      )}
                      {item.stock !== undefined && item.stock < 5 && item.stock > 0 && (
                        <p className="text-xs text-warning mt-1">Only {item.stock} left in stock</p>
                      )}
                      {item.stock === 0 && (
                        <p className="text-xs text-destructive mt-1">Out of stock – remove to proceed</p>
                      )}
                      <p className="text-sm font-semibold text-foreground mt-2 sm:hidden">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="hidden sm:block text-sm text-foreground font-medium flex-shrink-0 w-20">
                      ₹{item.price.toFixed(2)}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading || (item.stock !== undefined && item.quantity >= item.stock)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="hidden sm:block text-right flex-shrink-0 w-24">
                      <p className="text-sm font-bold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                      {item.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">₹{(item.originalPrice * item.quantity).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon + Clear */}
              <div className="border-t border-border pt-6 mt-2">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-primary" /> Promotions & Coupons
                </h3>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      disabled={isValidatingCoupon || isLoading}
                      className="w-full bg-card border border-border text-sm rounded-xl py-2.5 pl-4 pr-10 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
                    />
                    {isValidatingCoupon && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || isLoading || !couponInput.trim() || subtotal === 0}
                    className="bg-primary text-primary-foreground text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => clearCart()}
                    disabled={isLoading || items.length === 0}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto disabled:opacity-40"
                  >
                    <RefreshCw className="w-4 h-4" /> Clear Cart
                  </button>
                </div>

                {/* Applied Coupon Ticket */}
                {appliedCoupon && (
                  <div className="mt-4 p-4 relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/25 rounded-2xl text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-sm">
                    {/* Physical ticket edge cutouts */}
                    <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-background rounded-full border-r border-emerald-500/25 -translate-y-1/2" />
                    <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-background rounded-full border-l border-emerald-500/25 -translate-y-1/2" />

                    <div className="flex items-center gap-3 pl-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Ticket className="w-5 h-5 rotate-45" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold tracking-wider text-sm bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-300">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-xs font-semibold flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3.5 h-3.5" /> Applied
                          </span>
                        </div>
                        <p className="text-xs font-bold mt-1 text-foreground">
                          {appliedCoupon.couponName || "Discount Applied"}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {appliedCoupon.type === "PERCENTAGE" ? `${appliedCoupon.value}% off` : `₹${appliedCoupon.value.toFixed(2)} off`}
                          {appliedCoupon.expiresAt && ` • Expires ${new Date(appliedCoupon.expiresAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right pr-2">
                      <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        -₹{appliedCoupon.discountAmount.toFixed(2)}
                      </p>
                      <button
                        onClick={clearAppliedCoupon}
                        className="text-xs text-muted-foreground hover:text-foreground underline transition-all mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Coupon Errors & Min Order Value Progress Banners */}
                {couponError && (
                  (() => {
                    const match = couponError.match(/Minimum order value for this coupon is (\d+(?:\.\d+)?)/i);
                    const minOrder = match ? parseFloat(match[1]) : null;
                    if (minOrder && subtotal < minOrder) {
                      const gap = minOrder - subtotal;
                      const percent = Math.min(100, Math.max(0, (subtotal / minOrder) * 100));
                      return (
                        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-800 dark:text-amber-300">
                          <div className="flex items-start gap-2.5">
                            <AlertCircle className="w-5 h-5 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold">Unlock Coupon Discount!</p>
                              <p className="text-xs mt-1">
                                Add <span className="font-bold">₹{gap.toFixed(2)}</span> more to activate coupon <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-xs">{couponInput}</span>
                              </p>
                              <div className="w-full bg-border/40 rounded-full h-2 mt-3 overflow-hidden">
                                <div
                                  className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1.5 text-right font-medium">
                                ₹{subtotal.toFixed(2)} / ₹{minOrder.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive">
                        <div className="flex items-center gap-2.5">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-xs font-semibold">{couponError}</p>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>

            {/* Cart Totals */}
            <div>
              <div className="bg-card rounded-3xl border border-border shadow-card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-4">Cart Totals</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coupon ({appliedCoupon.code})</span>
                      <span className="font-semibold text-success">-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-semibold text-foreground">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex flex-col">
                      <span>Shipping</span>
                      {shipping === 0 && subtotal > 0 && (
                        <span className="text-[10px] text-success font-medium">Free Shipping applied</span>
                      )}
                      {shipping > 0 && (
                        <span className="text-[10px] text-muted-foreground">Free on orders above ₹999</span>
                      )}
                    </span>
                    <span className="font-semibold text-foreground">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-border mt-2 pt-4 flex justify-between items-baseline">
                    <span className="text-base font-bold text-foreground">Total</span>
                    <span className="text-xl font-extrabold text-foreground">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      localStorage.setItem("auth_redirect", "/checkout?action=add_address");
                      setShowLogin(true);
                      toast.info("Please sign in or create an account to proceed to checkout.");
                    } else {
                      router.push("/checkout");
                    }
                  }}
                  disabled={isLoading || items.some((i) => i.stock === 0) || items.length === 0}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full text-sm mt-6 hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wider shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Please wait…
                    </span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                {items.some((i) => i.stock === 0) && (
                  <p className="text-xs text-destructive text-center mt-3 font-medium">
                    Remove out-of-stock items before checkout
                  </p>
                )}

                <Link
                  href="/"
                  className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
