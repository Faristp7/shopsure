"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CheckoutPage = () => {
  const { items, total } = useCart();
  const { addresses } = useAuth();

  const subtotal = total;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const grandTotal = +(subtotal + shipping + tax).toFixed(2);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const [selectedPayment, setSelectedPayment] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (orderPlaced) {
    return (
      <main className="container py-20 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-1">Order #ORD-{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
        <p className="text-sm text-muted-foreground mb-8">You will receive a confirmation email shortly.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 uppercase tracking-tight">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — Forms */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Shipping Address */}
          <section className="bg-card rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Truck className="w-5 h-5" /> Shipping Address
              </h2>
              <Link href="/addresses" className="text-sm text-primary hover:underline">Manage</Link>
            </div>
            {defaultAddress ? (
              <div className="border border-border rounded-xl p-4 bg-secondary/30">
                <p className="text-sm font-semibold text-foreground">{defaultAddress.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{defaultAddress.street}</p>
                <p className="text-sm text-muted-foreground">{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}</p>
                <p className="text-sm text-muted-foreground">{defaultAddress.phone}</p>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">No address saved</p>
                <Link href="/addresses" className="text-sm text-primary hover:underline">Add Address</Link>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="bg-card rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" /> Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { id: "card", label: "Credit / Debit Card" },
                { id: "upi", label: "UPI" },
                { id: "cod", label: "Cash on Delivery" },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedPayment === m.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={selectedPayment === m.id}
                    onChange={() => setSelectedPayment(m.id)}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground">{m.label}</span>
                </label>
              ))}
            </div>

            {selectedPayment === "card" && (
              <div className="mt-4 flex flex-col gap-3">
                <input placeholder="Card Number" className="bg-secondary/30 border border-border rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM/YY" className="bg-secondary/30 border border-border rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground" />
                  <input placeholder="CVV" className="bg-secondary/30 border border-border rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground" />
                </div>
                <input placeholder="Name on Card" className="bg-secondary/30 border border-border rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground" />
              </div>
            )}
          </section>
        </div>

        {/* Right — Summary */}
        <div>
          <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-4">Order Summary</h2>

            <div className="flex flex-col divide-y divide-border mb-4 max-h-[300px] overflow-y-auto scrollbar-hide">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <img src={item.image || "/assets/user/hoodie-main.jpg"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-border mt-4 pt-4 flex justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-base font-bold text-foreground">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setOrderPlaced(true)}
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full text-sm mt-6 hover:opacity-90 transition-opacity active:scale-[0.98] uppercase tracking-wider shadow-lg shadow-primary/20"
            >
              Place Order
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-4">
              <Shield className="w-3.5 h-3.5" /> Secure checkout powered by SSL encryption
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
