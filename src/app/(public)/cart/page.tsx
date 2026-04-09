"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Minus, Plus, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, total, isLoading, error } = useCart();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const shipping = total > 50 ? 0 : 5.99;
  const tax = 0;
  const subtotal = total;
  const grandTotal = subtotal + shipping + tax;

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
                <p className="text-sm text-muted-foreground mb-3">Have a coupon? Enter your code.</p>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 min-w-[140px] max-w-xs bg-card border border-border text-sm rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => coupon && setCouponApplied(true)}
                    className="border border-border text-sm font-semibold text-foreground px-5 py-2.5 rounded-xl hover:bg-secondary transition-colors uppercase tracking-wider"
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
                {couponApplied && (
                  <p className="text-xs text-success mt-2">Coupon applied successfully!</p>
                )}
              </div>
            </div>

            {/* Cart Totals */}
            <div>
              <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-4">Cart Totals</h2>
                <div className="border-t border-border pt-4 flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping (3-5 Business Days)</span>
                    <span className="font-medium text-foreground">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TAX (estimated)</span>
                    <span className="font-medium text-foreground">₹{tax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-border mt-4 pt-4 flex justify-between">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-base font-bold text-foreground">₹{grandTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  disabled={isLoading || items.some((i) => i.stock === 0)}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full text-sm mt-6 hover:opacity-90 transition-opacity active:scale-[0.98] uppercase tracking-wider shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="text-xs text-destructive text-center mt-3">
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
