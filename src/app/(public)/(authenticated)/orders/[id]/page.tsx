"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle, AlertCircle, MapPin, CreditCard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  CREATED: { label: "Order Created", icon: Clock, color: "text-muted-foreground", bg: "bg-secondary/50" },
  PENDING_PAYMENT: { label: "Pending Payment", icon: AlertCircle, color: "text-discount", bg: "bg-discount/10" },
  PAID: { label: "Payment Received", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  CONFIRMED: { label: "Order Confirmed", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
  SHIPPED: { label: "Out for Delivery", icon: Truck, color: "text-primary", bg: "bg-primary/10" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  RETURNED: { label: "Returned", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  FAILED: { label: "Failed", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const cancellable = ["CREATED", "PENDING_PAYMENT", "CONFIRMED"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["buyer-order", id],
    queryFn: () => ordersService.getBuyerOrder(id),
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersService.cancelOrder(id),
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["buyer-order", id] });
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to cancel order");
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8 max-w-3xl">
        <div className="h-8 w-32 bg-secondary rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border/50 animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container py-8 max-w-3xl text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive/50 mb-4" />
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Link href="/orders">
          <Button variant="outline" className="rounded-full">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const cfg = statusConfig[order.status] ?? statusConfig.CREATED;
  const Icon = cfg.icon;
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="container py-8 max-w-3xl">
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground uppercase tracking-tight">
            #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Placed on {date}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${cfg.color} ${cfg.bg}`}>
          <Icon className="w-3.5 h-3.5" />
          {cfg.label}
        </div>
      </div>

      <div className="space-y-4">
        {/* Items */}
        <section className="bg-card rounded-2xl p-6 border border-border/50 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Order Items
          </h2>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.productTitle}</p>
                  <p className="text-xs text-muted-foreground">SKU: {item.sku} · Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-foreground whitespace-nowrap">
                  ₹{parseFloat(item.lineTotal).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <section className="bg-card rounded-2xl p-6 border border-border/50 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Delivery Address
            </h2>
            <p className="text-sm font-semibold text-foreground">{order.shippingAddress.name}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.state} – {order.shippingAddress.zip}
            </p>
          </section>
        )}

        {/* Payment Summary */}
        <section className="bg-card rounded-2xl p-6 border border-border/50 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{parseFloat(order.subtotalAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{parseFloat(order.shippingAmount) === 0 ? "Free" : `₹${parseFloat(order.shippingAmount).toLocaleString("en-IN")}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (GST)</span>
              <span>₹{parseFloat(order.taxAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-foreground border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span>₹{parseFloat(order.totalAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>Payment Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {cancellable.includes(order.status) && (
            <Button
              variant="outline"
              className="flex-1 rounded-full text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Cancelling…" : "Cancel Order"}
            </Button>
          )}
          {order.status === "DELIVERED" && (
            <Button variant="outline" className="flex-1 rounded-full gap-2" asChild>
              <Link href={`/orders/${order.id}/return`}>
                <RotateCcw className="w-4 h-4" /> Request Return
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
