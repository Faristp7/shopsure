"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";

const mockOrders = [
  {
    id: "#ORD-1234",
    product: "Blue Anarkali Set",
    buyer: "Sneha Mehta",
    status: "New",
    amount: "₹2,499",
    date: "15 Feb 2026",
  },
  {
    id: "#ORD-1233",
    product: "Kundan Necklace",
    buyer: "Ritu Sharma",
    status: "Shipped",
    amount: "₹1,899",
    date: "14 Feb 2026",
  },
  {
    id: "#ORD-1232",
    product: "Cotton Kurta Pack",
    buyer: "Amit Kumar",
    status: "Delivered",
    amount: "₹3,299",
    date: "13 Feb 2026",
  },
  {
    id: "#ORD-1231",
    product: "Embroidered Dupatta",
    buyer: "Priya Rao",
    status: "Packed",
    amount: "₹899",
    date: "13 Feb 2026",
  },
  {
    id: "#ORD-1230",
    product: "Silk Saree",
    buyer: "Neha Gupta",
    status: "Cancelled",
    amount: "₹5,499",
    date: "12 Feb 2026",
  },
  {
    id: "#ORD-1229",
    product: "Oxidized Jhumka Set",
    buyer: "Divya Patel",
    status: "Delivered",
    amount: "₹599",
    date: "11 Feb 2026",
  },
  {
    id: "#ORD-1228",
    product: "Block Print Kurti",
    buyer: "Kavita Singh",
    status: "New",
    amount: "₹1,299",
    date: "11 Feb 2026",
  },
];

const statusColors: Record<string, string> = {
  New: "bg-primary/10 text-primary",
  Packed: "bg-warning/10 text-warning",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
};

const tabs = ["All", "New", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = mockOrders.filter((o) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesSearch =
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all your orders
        </p>
      </div>

      {/* Tabs */}
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
            {tab}
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

      <div className="space-y-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            onClick={() =>
              router.push(`/seller/orders/${order.id.replace("#", "")}`)
            }
            className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div>
                <p className="text-sm font-bold text-foreground">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <div className="hidden sm:block flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {order.product}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  {order.buyer}
                </p>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
              <span className="text-sm font-extrabold text-foreground">
                {order.amount}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}
