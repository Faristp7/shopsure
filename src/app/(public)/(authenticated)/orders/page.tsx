"use client";

import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, Truck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const mockOrders = [
  { id: "ORD-2024-001", date: "Mar 8, 2026", total: 234.50, status: "delivered", items: 3, statusIcon: CheckCircle2, statusColor: "text-success" },
  { id: "ORD-2024-002", date: "Mar 5, 2026", total: 89.99, status: "in transit", items: 1, statusIcon: Truck, statusColor: "text-primary" },
  { id: "ORD-2024-003", date: "Feb 28, 2026", total: 156.00, status: "processing", items: 2, statusIcon: Clock, statusColor: "text-discount" },
];

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();

  // if (!isLoggedIn) return null; 
  // Handled by layout

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-8 uppercase tracking-tight">Order History</h1>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-card rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer border border-border/50 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-foreground">{order.id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${order.statusColor}`}>
                <order.statusIcon className="w-4 h-4" />
                <span>{order.status}</span>
              </div>
              <span className="font-extrabold text-foreground">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 bg-card rounded-2xl p-8 border border-border/50 shadow-card">
        <Package className="w-10 h-10 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-sm text-muted-foreground mb-6">Looking for more? Browse our latest arrivals.</p>
        <Link href="/products">
          <Button variant="outline" className="rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
