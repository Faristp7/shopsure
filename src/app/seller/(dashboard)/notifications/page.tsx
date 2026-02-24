"use client";

import {
  ShoppingCart,
  Wallet,
  Bell as BellIcon,
  Megaphone,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const notifications = [
  {
    type: "order",
    icon: ShoppingCart,
    title: "New order received!",
    description: "Order #ORD-1234 for Blue Anarkali Set",
    time: "2 min ago",
    unread: true,
  },
  {
    type: "payout",
    icon: Wallet,
    title: "Payout released",
    description: "₹18,500 has been transferred to your bank account",
    time: "3 hours ago",
    unread: true,
  },
  {
    type: "support",
    icon: BellIcon,
    title: "Support ticket updated",
    description: "Your ticket TKT-099 has a new response",
    time: "Yesterday",
    unread: false,
  },
  {
    type: "order",
    icon: ShoppingCart,
    title: "Order delivered",
    description: "Order #ORD-1232 has been delivered successfully",
    time: "Yesterday",
    unread: false,
  },
  {
    type: "announcement",
    icon: Megaphone,
    title: "New feature: Analytics Dashboard",
    description: "Track your store performance with detailed insights",
    time: "2 days ago",
    unread: false,
  },
  {
    type: "payout",
    icon: Wallet,
    title: "Payout released",
    description: "₹12,300 has been transferred to your bank account",
    time: "5 days ago",
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with your store activity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="font-bold text-xs h-9 uppercase tracking-widest border-border/60"
        >
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <Card
            key={i}
            className={`cursor-pointer transition-all hover:shadow-md border-border/60 group ${
              n.unread
                ? "bg-primary/[0.03] border-primary/20 shadow-sm"
                : "bg-card hover:border-primary/20"
            }`}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors ${
                  n.unread
                    ? "bg-primary/10 border-primary/10 text-primary"
                    : "bg-muted/40 border-transparent text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
                }`}
              >
                <n.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-extrabold truncate ${n.unread ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {n.title}
                  </p>
                  {n.unread && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 truncate font-medium ${n.unread ? "text-foreground/80" : "text-muted-foreground/70"}`}
                >
                  {n.description}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1.5">
                  {n.time}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center pt-8 opacity-40">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest">
          No more notifications
        </p>
      </div>
    </div>
  );
}
