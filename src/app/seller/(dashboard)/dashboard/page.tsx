"use client";

import {
  ShoppingCart,
  IndianRupee,
  Clock,
  Wallet,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Total Orders",
    value: "156",
    icon: ShoppingCart,
    change: "+12%",
    changeColor: "text-success",
  },
  {
    label: "Revenue (This Month)",
    value: "₹2,45,800",
    icon: IndianRupee,
    change: "+18%",
    changeColor: "text-success",
  },
  {
    label: "Pending Orders",
    value: "8",
    icon: Clock,
    change: "",
    changeColor: "",
  },
  {
    label: "Wallet Balance",
    value: "₹32,400",
    icon: Wallet,
    change: "Ready to withdraw",
    changeColor: "text-primary",
  },
];

const recentOrders = [
  {
    id: "#ORD-1234",
    product: "Blue Anarkali Set",
    buyer: "Sneha M.",
    status: "New",
    amount: "₹2,499",
  },
  {
    id: "#ORD-1233",
    product: "Kundan Necklace",
    buyer: "Ritu S.",
    status: "Shipped",
    amount: "₹1,899",
  },
  {
    id: "#ORD-1232",
    product: "Cotton Kurta Pack",
    buyer: "Amit K.",
    status: "Delivered",
    amount: "₹3,299",
  },
  {
    id: "#ORD-1231",
    product: "Embroidered Dupatta",
    buyer: "Priya R.",
    status: "Packed",
    amount: "₹899",
  },
];

const statusColors: Record<string, string> = {
  New: "bg-primary/10 text-primary",
  Packed: "bg-warning/10 text-warning",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function DashboardHome() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push("/seller/products/add")} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/seller/payments")}
          >
            Withdraw Earnings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              {stat.change && (
                <span className={`text-xs font-semibold ${stat.changeColor}`}>
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-extrabold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Conversion + Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversion Rate */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Conversion Rate
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-extrabold text-foreground">4.2</span>
            <span className="text-lg font-bold text-muted-foreground mb-1">
              %
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-success font-medium">
            <TrendingUp className="h-4 w-4" /> +0.5% from last month
          </div>
          <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: "42%" }}
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Recent Orders
            </h3>
            <button
              onClick={() => router.push("/seller/orders")}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    Order
                  </th>
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    Product
                  </th>
                  <th className="text-left py-2 text-muted-foreground font-medium hidden sm:table-cell">
                    Buyer
                  </th>
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 font-medium text-foreground">
                      {order.id}
                    </td>
                    <td className="py-3 text-foreground">{order.product}</td>
                    <td className="py-3 text-muted-foreground hidden sm:table-cell">
                      {order.buyer}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-foreground">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
