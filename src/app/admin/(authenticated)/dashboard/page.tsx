'use client';

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { IndianRupee, Users, ShoppingBag, TrendingUp, Package, AlertCircle, Loader2 } from "lucide-react";
import { analyticsService } from "@/services/analytics.service";
import { Badge } from "@/components/ui/badge";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const changeColor = (n: number) =>
  n >= 0 ? "text-green-600" : "text-destructive";

export default function AdminDashboard() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["admin-analytics-summary"],
    queryFn: analyticsService.getAdminSummary,
    staleTime: 60_000,
  });

  const { data: revenueChart, isLoading: chartLoading } = useQuery({
    queryKey: ["admin-revenue-chart"],
    queryFn: analyticsService.getAdminRevenueChart,
    staleTime: 60_000,
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: analyticsService.getRecentOrders,
    staleTime: 30_000,
  });

  const metrics = summary
    ? [
        {
          title: "Total Revenue",
          value: fmt(summary.totalRevenue),
          change: summary.revenueChange,
          icon: IndianRupee,
        },
        {
          title: "Active Sellers",
          value: summary.activeSellers.toLocaleString(),
          change: summary.sellersChange,
          icon: Users,
        },
        {
          title: "Total Orders",
          value: summary.totalOrders.toLocaleString(),
          change: summary.ordersChange,
          icon: ShoppingBag,
        },
        {
          title: "Total Users",
          value: summary.totalUsers.toLocaleString(),
          change: summary.usersChange,
          icon: TrendingUp,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Platform overview and key metrics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-24 p-6" />
              </Card>
            ))
          : metrics.map((m) => (
              <Card key={m.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
                  <m.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{m.value}</div>
                  <p className={`text-xs font-medium mt-1 ${changeColor(m.change)}`}>
                    {m.change >= 0 ? "+" : ""}{m.change.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Alert Banner */}
      {summary && (summary.pendingApprovals > 0 || summary.openDisputes > 0) && (
        <div className="flex flex-wrap gap-3">
          {summary.pendingApprovals > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm font-medium">
              <Package className="h-4 w-4" />
              {summary.pendingApprovals} seller approvals pending
            </div>
          )}
          {summary.openDisputes > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              {summary.openDisputes} open disputes
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and commission breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {chartLoading ? (
              <div className="flex items-center justify-center h-[350px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueChart ?? []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    formatter={(v: number) => [fmt(v), ""]}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                  <Bar dataKey="commission" name="Commission" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary/30" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {(recentOrders ?? []).slice(0, 6).map((order) => (
                  <div key={order.id} className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mr-3 shrink-0">
                      {order.buyerName[0]}
                    </div>
                    <div className="ml-1 space-y-0.5 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">{order.buyerName}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.buyerEmail}</p>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-1 shrink-0">
                      <span className="font-semibold text-sm">{order.total}</span>
                      <Badge variant="outline" className="text-[9px] py-0">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
