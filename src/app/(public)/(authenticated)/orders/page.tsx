"use client";

import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, Truck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const mockOrders = [
  { id: "ORD-2024-001", date: "Mar 8, 2026", total: 234.50, status: "delivered", items: 3, statusIcon: CheckCircle2, statusColor: "text-[hsl(var(--success))]" },
  { id: "ORD-2024-002", date: "Mar 5, 2026", total: 89.99, status: "in transit", items: 1, statusIcon: Truck, statusColor: "text-primary" },
  { id: "ORD-2024-003", date: "Feb 28, 2026", total: 156.00, status: "processing", items: 2, statusIcon: Clock, statusColor: "text-[hsl(var(--discount))]" },
];

export default function OrdersPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-card rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1.5 text-sm font-medium ${order.statusColor}`}>
                <order.statusIcon className="w-4 h-4" />
                <span className="capitalize">{order.status}</span>
              </div>
              <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/user/products"><Button variant="outline">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
