"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, AlertCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  CREATED: "bg-secondary text-muted-foreground",
  PENDING_PAYMENT: "bg-warning/10 text-warning",
  PAID: "bg-success/10 text-success",
  CONFIRMED: "bg-primary/10 text-primary",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
  RETURNED: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<string, string> = {
  CREATED: "New",
  PENDING_PAYMENT: "Awaiting Payment",
  PAID: "Paid",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

const tabs = ["All", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const tabLabels: Record<string, string> = {
  All: "All",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: () => ordersService.getSellerOrders(),
  });

  const filtered = (orders ?? []).filter((o) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.items?.some((i: any) => i.productTitle?.toLowerCase().includes(q)) ||
      o.buyer?.fullName?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track all your orders</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 h-16 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-destructive text-sm p-4 bg-destructive/5 rounded-xl">
          <AlertCircle className="w-4 h-4" />
          Failed to load orders. Please refresh.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No orders found.</p>
          ) : (
            filtered.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/seller/orders/${order.id}`)}
                className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div>
                    <p className="text-sm font-bold text-foreground">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="hidden sm:block flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {order.items?.[0]?.productTitle ?? "—"}
                      {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">
                      {order.buyer?.fullName ?? ""}
                    </p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColors[order.status] ?? "bg-secondary text-muted-foreground"}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                  <span className="text-sm font-extrabold text-foreground">
                    ₹{parseFloat(order.totalAmount).toLocaleString("en-IN")}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
