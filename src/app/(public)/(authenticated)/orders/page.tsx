"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersService, OrderSummary } from "@/services/orders.service";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, Truck, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  CREATED: { label: "Created", icon: Clock, color: "text-muted-foreground" },
  PENDING_PAYMENT: { label: "Pending Payment", icon: AlertCircle, color: "text-discount" },
  PAID: { label: "Paid", icon: CheckCircle2, color: "text-success" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle2, color: "text-primary" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "text-primary" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "text-success" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-destructive" },
  RETURNED: { label: "Returned", icon: XCircle, color: "text-destructive" },
  FAILED: { label: "Failed", icon: XCircle, color: "text-destructive" },
};

function OrderCard({ order }: { order: OrderSummary }) {
  const cfg = statusConfig[order.status] ?? statusConfig.CREATED;
  const Icon = cfg.icon;
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="bg-card rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer border border-border/50 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-foreground">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {date} · {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        {order.items.length > 0 && (
          <p className="text-xs text-muted-foreground mb-3 truncate">
            {order.items.map((i) => `${i.productTitle} ×${i.quantity}`).join(", ")}
          </p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${cfg.color}`}>
            <Icon className="w-4 h-4" />
            <span>{cfg.label}</span>
          </div>
          <span className="font-extrabold text-foreground">
            ₹{parseFloat(order.totalAmount).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: () => ordersService.getBuyerOrders(),
  });

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-8 uppercase tracking-tight">Order History</h1>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-5 border border-border/50 shadow-card animate-pulse h-28" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50 shadow-card">
          <AlertCircle className="w-10 h-10 mx-auto text-destructive/50 mb-3" />
          <p className="text-sm text-muted-foreground">Failed to load orders. Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {!isLoading && !isError && orders?.length === 0 && (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/50 shadow-card">
          <Package className="w-10 h-10 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground mb-6">You haven't placed any orders yet.</p>
          <Link href="/products">
            <Button variant="outline" className="rounded-full px-8">Start Shopping</Button>
          </Link>
        </div>
      )}

      {!isLoading && orders && orders.length > 0 && (
        <div className="text-center mt-12 bg-card rounded-2xl p-8 border border-border/50 shadow-card">
          <Package className="w-10 h-10 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground mb-6">Looking for more? Browse our latest arrivals.</p>
          <Link href="/products">
            <Button variant="outline" className="rounded-full px-8">Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
