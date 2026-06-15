"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ordersService } from "@/services/orders.service";
import { paymentsService } from "@/services/payments.service";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface AddressFormErrors {
  label?: string;
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

const emptyAddressForm = {
  label: "Home",
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
  isDefault: true,
};

const validateAddressForm = (form: typeof emptyAddressForm): AddressFormErrors => {
  const errors: AddressFormErrors = {};

  if (!form.label || form.label.trim().length === 0) {
    errors.label = "Label is required (e.g. Home, Office)";
  } else if (form.label.trim().length < 2) {
    errors.label = "Label must be at least 2 characters";
  } else if (form.label.trim().length > 50) {
    errors.label = "Label must be at most 50 characters";
  }

  const nameTrim = form.name.trim();
  if (!nameTrim) {
    errors.name = "Full name is required";
  } else if (nameTrim.length < 2) {
    errors.name = "Full name must be at least 2 characters";
  } else if (nameTrim.length > 100) {
    errors.name = "Full name must be at most 100 characters";
  } else if (!/^[a-zA-Z\s\.\,\'\-]+$/.test(nameTrim)) {
    errors.name = "Use only letters, spaces, dots, commas, apostrophes, and hyphens";
  }

  const phoneTrim = form.phone.trim();
  if (!phoneTrim) {
    errors.phone = "Phone number is required";
  } else if (phoneTrim.length < 10 || phoneTrim.length > 20) {
    errors.phone = "Phone must be between 10 and 20 digits";
  } else if (!/^\+?[0-9\s\-()]{10,20}$/.test(phoneTrim)) {
    errors.phone = "Phone must be valid (e.g. +919876543210)";
  }

  const streetTrim = form.street.trim();
  if (!streetTrim) {
    errors.street = "Street address is required";
  } else if (streetTrim.length < 5) {
    errors.street = "Street must be at least 5 characters";
  } else if (streetTrim.length > 250) {
    errors.street = "Street must be at most 250 characters";
  }

  const cityTrim = form.city.trim();
  if (!cityTrim) {
    errors.city = "City is required";
  } else if (cityTrim.length < 2) {
    errors.city = "City must be at least 2 characters";
  } else if (cityTrim.length > 100) {
    errors.city = "City must be at most 100 characters";
  } else if (!/^[a-zA-Z\s\-]+$/.test(cityTrim)) {
    errors.city = "Letters, spaces, and hyphens only";
  }

  const stateTrim = form.state.trim();
  if (!stateTrim) {
    errors.state = "State is required";
  } else if (stateTrim.length < 2) {
    errors.state = "State must be at least 2 characters";
  } else if (stateTrim.length > 100) {
    errors.state = "State must be at most 100 characters";
  } else if (!/^[a-zA-Z\s\-]+$/.test(stateTrim)) {
    errors.state = "Letters, spaces, and hyphens only";
  }

  const zipTrim = form.zip.trim();
  if (!zipTrim) {
    errors.zip = "ZIP/Postal code is required";
  } else if (zipTrim.length < 3 || zipTrim.length > 10) {
    errors.zip = "ZIP must be 3-10 characters";
  } else if (!/^[a-zA-Z0-9\s\-]{3,10}$/.test(zipTrim)) {
    errors.zip = "Alphanumeric, spaces, or hyphens only";
  }

  const countryTrim = form.country.trim();
  if (!countryTrim) {
    errors.country = "Country is required";
  } else if (countryTrim.length < 2) {
    errors.country = "Country must be at least 2 characters";
  } else if (countryTrim.length > 100) {
    errors.country = "Country must be at most 100 characters";
  } else if (!/^[a-zA-Z\s\-]+$/.test(countryTrim)) {
    errors.country = "Letters, spaces, and hyphens only";
  }

  return errors;
};

const sanitizeAddressForm = (f: typeof emptyAddressForm) => {
  const sanitizeStr = (s: string) => {
    return s.trim().replace(/<[^>]*>/g, '');
  };
  return {
    ...f,
    label: sanitizeStr(f.label),
    name: sanitizeStr(f.name),
    phone: sanitizeStr(f.phone),
    street: sanitizeStr(f.street),
    city: sanitizeStr(f.city),
    state: sanitizeStr(f.state),
    zip: sanitizeStr(f.zip),
    country: sanitizeStr(f.country),
  };
};

const CheckoutPage = () => {
  const { items, total, clearCart, appliedCoupon, couponError, removeCoupon } = useCart();
  const { isLoggedIn, addresses, addAddress, setShowLogin, user } = useAuth();

  const subtotal = total;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const tax = +(subtotal * 0.18).toFixed(2);
  const grandTotal = +(subtotal + shipping + tax - (appliedCoupon?.discountAmount ?? 0)).toFixed(2);

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;

  const [selectedPayment, setSelectedPayment] = useState<"COD" | "PREPAID">("COD");
  const [isPlacing, setIsPlacing] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [mockPaymentData, setMockPaymentData] = useState<any | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Inline address modal state
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressFormErrors, setAddressFormErrors] = useState<AddressFormErrors>({});
  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  // Prefill address form with user details when authenticated user is loaded
  useEffect(() => {
    if (user) {
      setAddressForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Intercept action=add_address after redirect/login
  useEffect(() => {
    if (isLoggedIn) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "add_address") {
        setAddressFormErrors({});
        setAddressForm({
          ...emptyAddressForm,
          name: user?.name ?? "",
          phone: user?.phone ?? "",
        });
        setIsAddressDialogOpen(true);
        // Clean URL parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [isLoggedIn, user]);

  const handleAddNewAddress = () => {
    if (!isLoggedIn) {
      localStorage.setItem("auth_redirect", "/checkout?action=add_address");
      setShowLogin(true);
      toast.info("Please sign in or create an account to save a delivery address.");
    } else {
      setAddressFormErrors({});
      setAddressForm({
        ...emptyAddressForm,
        name: user?.name ?? "",
        phone: user?.phone ?? "",
      });
      setIsAddressDialogOpen(true);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAddressForm(addressForm);
    if (Object.keys(validationErrors).length > 0) {
      setAddressFormErrors(validationErrors);
      toast.error("Please correct the validation errors in the form.");
      return;
    }
    setAddressFormErrors({});
    const sanitized = sanitizeAddressForm(addressForm);
    addAddress(sanitized);
    setIsAddressDialogOpen(false);
    toast.success("Address added successfully!");
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      localStorage.setItem("auth_redirect", "/checkout?action=add_address");
      setShowLogin(true);
      toast.info("Please sign in or create an account to proceed with your order.");
      return;
    }
    if (!defaultAddress) {
      setIsAddressDialogOpen(true);
      toast.error("Please add a delivery address before placing your order.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsPlacing(true);
    try {
      // 1. Create order on the backend
      const order = await ordersService.createOrder({
        shippingName: defaultAddress.name,
        shippingPhone: defaultAddress.phone,
        shippingStreet: defaultAddress.street,
        shippingCity: defaultAddress.city,
        shippingState: defaultAddress.state,
        shippingZip: defaultAddress.zip,
        shippingCountry: defaultAddress.country || "India",
        paymentMethod: selectedPayment,
        couponCode: couponError ? undefined : appliedCoupon?.code,
      });

      if (selectedPayment === "COD") {
        // COD order is placed immediately
        await clearCart();
        removeCoupon();
        setPlacedOrderId(order.id);
        setIsPlacing(false);
      } else {
        // Prepaid flow: initiate payment session
        try {
          const pData = await paymentsService.initiatePayment(order.id);

          if (pData.isMock) {
            // Backend in developer mock mode
            setMockPaymentData({ ...pData, orderId: order.id });
            setIsPlacing(false);
          } else {
            // Real Razorpay payment integration
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
              toast.error("Failed to load Razorpay Payment Gateway. Please try again.");
              setIsPlacing(false);
              return;
            }

            const options = {
              key: pData.keyId,
              amount: pData.amount,
              currency: pData.currency,
              name: "ShopSure E-commerce",
              description: `Payment for Order #${order.id.slice(-8).toUpperCase()}`,
              order_id: pData.providerOrderId,
              handler: async function (response: any) {
                setIsProcessingPayment(true);
                try {
                  await paymentsService.verifyPayment({
                    orderId: order.id,
                    providerOrderId: response.razorpay_order_id,
                    providerPaymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    isMock: false,
                  });
                  await clearCart();
                  removeCoupon();
                  setPlacedOrderId(order.id);
                } catch (err: unknown) {
                  const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Payment verification failed.";
                  toast.error(msg);
                } finally {
                  setIsProcessingPayment(false);
                }
              },
              prefill: {
                name: pData.buyerName,
                email: pData.buyerEmail,
                contact: pData.buyerPhone,
              },
              theme: {
                color: "#4f6ef7",
              },
              modal: {
                ondismiss: function () {
                  toast.warning("Payment cancelled. You can complete it later in your order detail page.");
                  window.location.href = `/orders/${order.id}`;
                },
              },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (resp: any) {
              toast.error(`Payment failed: ${resp.error.description || "Unknown error"}`);
            });
            rzp.open();
            setIsPlacing(false);
          }
        } catch (payErr: unknown) {
          const msg = (payErr as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to initialize payment session.";
          toast.error(msg);
          setIsPlacing(false);
          // Redirect to order page so they can retry payment later
          window.location.href = `/orders/${order.id}`;
        }
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to place order. Please try again.";
      toast.error(msg);
      setIsPlacing(false);
    }
  };

  const handleMockPaymentSuccess = async () => {
    if (!mockPaymentData) return;
    const data = mockPaymentData;
    setMockPaymentData(null);
    setIsProcessingPayment(true);

    try {
      await paymentsService.verifyPayment({
        orderId: data.orderId,
        providerOrderId: data.providerOrderId,
        providerPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
        signature: "mock_signature_verified",
        isMock: true,
      });
      await clearCart();
      removeCoupon();
      setPlacedOrderId(data.orderId);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Mock verification failed.";
      toast.error(msg);
      window.location.href = `/orders/${data.orderId}`;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleMockPaymentFailure = () => {
    if (!mockPaymentData) return;
    const data = mockPaymentData;
    setMockPaymentData(null);
    toast.error("Simulated payment transaction failed.");
    window.location.href = `/orders/${data.orderId}`;
  };

  if (placedOrderId) {
    return (
      <main className="container py-20 text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-1">Order #{placedOrderId.slice(-8).toUpperCase()}</p>
        <p className="text-sm text-muted-foreground mb-8">
          {selectedPayment === "COD"
            ? "Your order has been confirmed. Pay on delivery."
            : "Your prepaid order has been confirmed successfully."}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href={`/orders/${placedOrderId}`}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
          >
            View Order
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-border font-semibold px-6 py-3 rounded-full text-sm hover:bg-secondary transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
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
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    localStorage.setItem("auth_redirect", "/addresses");
                    setShowLogin(true);
                    toast.info("Please sign in to manage your addresses.");
                  } else {
                    window.location.href = "/addresses";
                  }
                }}
                className="text-sm text-primary hover:underline bg-transparent border-none cursor-pointer p-0 font-medium"
              >
                Manage
              </button>
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
                <button
                  onClick={handleAddNewAddress}
                  className="text-sm text-primary hover:underline bg-transparent border-none cursor-pointer p-0 font-medium"
                >
                  Add Address
                </button>
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
                { id: "COD" as const, label: "Cash on Delivery (COD)" },
                { id: "PREPAID" as const, label: "Online Prepaid (UPI, Cards, NetBanking)" },
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
          </section>
        </div>

        {/* Right — Summary */}
        <div>
          <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-4">Order Summary</h2>

            {couponError && (
              <div className="bg-destructive/10 border border-destructive/25 text-destructive text-xs rounded-xl p-3.5 mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Coupon Disabled</p>
                  <p className="mt-0.5 leading-relaxed text-muted-foreground">{couponError}. Proceeding without this discount.</p>
                </div>
              </div>
            )}

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
                  <p className="text-sm font-semibold text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (GST 18%)</span>
                <span className="font-medium text-foreground">₹{tax.toLocaleString("en-IN")}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coupon ({appliedCoupon.code})</span>
                  <span className="font-medium text-success">
                    -₹{appliedCoupon.discountAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-border mt-4 pt-4 flex justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-base font-bold text-foreground">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing || items.length === 0 || isProcessingPayment}
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full text-sm mt-6 hover:opacity-90 transition-opacity active:scale-[0.98] uppercase tracking-wider shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPlacing ? "Processing Order…" : "Place Order"}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-4">
              <Shield className="w-3.5 h-3.5" /> Secure checkout powered by SSL encryption
            </div>
          </div>
        </div>
      </div>

      {/* Mock Razorpay Sandbox Modal */}
      {mockPaymentData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-purple-600" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                💳
              </div>
              <div>
                <h3 className="font-extrabold text-foreground text-base">Razorpay Sandbox Simulator</h3>
                <p className="text-xs text-muted-foreground font-medium">Local Development Gateway Simulation</p>
              </div>
            </div>

            <div className="bg-secondary/40 border border-border rounded-2xl p-4 mb-6 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Reference</span>
                <span className="font-semibold text-foreground font-mono">{mockPaymentData.orderId.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Payable</span>
                <span className="font-semibold text-foreground">₹{(mockPaymentData.amount / 100).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer Email</span>
                <span className="font-semibold text-foreground">{mockPaymentData.buyerEmail || "Not Provided"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleMockPaymentSuccess}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-full text-sm hover:opacity-90 transition-opacity active:scale-[0.98] cursor-pointer"
              >
                Simulate Success (Complete Payment)
              </button>
              <button
                onClick={handleMockPaymentFailure}
                className="w-full bg-destructive/10 text-destructive border border-destructive/20 font-semibold py-3 rounded-full text-sm hover:bg-destructive/20 transition-colors active:scale-[0.98] cursor-pointer"
              >
                Simulate Failure
              </button>
              <button
                onClick={() => {
                  const data = mockPaymentData;
                  setMockPaymentData(null);
                  toast.warning("Payment cancelled.");
                  window.location.href = `/orders/${data.orderId}`;
                }}
                className="w-full border border-border text-muted-foreground font-semibold py-3 rounded-full text-sm hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center text-center max-w-xs animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
            <h3 className="font-bold text-foreground text-lg mb-1">Verifying Transaction</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Please wait while we secure your payment and confirm your order details with the gateway.
            </p>
          </div>
        </div>
      )}

      {/* Add Address Dialog Modal */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-none shadow-2xl rounded-3xl z-[100] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">Add Delivery Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAddress} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Label</Label>
                <Input 
                  placeholder="Home, Office..." 
                  className={`bg-secondary/30 rounded-xl ${addressFormErrors.label ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={addressForm.label} 
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} 
                />
                {addressFormErrors.label && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{addressFormErrors.label}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Full Name</Label>
                <Input 
                  placeholder="John Doe"
                  className={`bg-secondary/30 rounded-xl ${addressFormErrors.name ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={addressForm.name} 
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} 
                />
                {addressFormErrors.name && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{addressFormErrors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Phone Number</Label>
                <Input 
                  placeholder="+919876543210"
                  className={`bg-secondary/30 rounded-xl ${addressFormErrors.phone ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={addressForm.phone} 
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} 
                />
                {addressFormErrors.phone && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{addressFormErrors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Country</Label>
                <select
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className={`flex h-10 w-full rounded-xl border border-input bg-secondary/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground ${addressFormErrors.country ? 'border-destructive/80' : ''}`}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                </select>
                {addressFormErrors.country && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{addressFormErrors.country}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Street Address</Label>
              <Input 
                placeholder="123 Main St, Apt 4B"
                className={`bg-secondary/30 rounded-xl ${addressFormErrors.street ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                value={addressForm.street} 
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} 
              />
              {addressFormErrors.street && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{addressFormErrors.street}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">City</Label>
                <Input 
                  placeholder="Mumbai"
                  className={`bg-secondary/30 rounded-xl ${addressFormErrors.city ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={addressForm.city} 
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} 
                />
                {addressFormErrors.city && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{addressFormErrors.city}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">State</Label>
                <Input 
                  placeholder="Maharashtra"
                  className={`bg-secondary/30 rounded-xl ${addressFormErrors.state ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={addressForm.state} 
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} 
                />
                {addressFormErrors.state && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{addressFormErrors.state}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">ZIP</Label>
                <Input 
                  placeholder="400001"
                  className={`bg-secondary/30 rounded-xl ${addressFormErrors.zip ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={addressForm.zip} 
                  onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })} 
                />
                {addressFormErrors.zip && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{addressFormErrors.zip}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full rounded-2xl py-6 font-bold uppercase tracking-widest mt-2">Save Address</Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CheckoutPage;
