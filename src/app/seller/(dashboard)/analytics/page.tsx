"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Eye,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  MapPin,
  Globe,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const topProducts = [
  {
    name: "Blue Anarkali Set",
    views: 1240,
    orders: 45,
    conversion: "3.6%",
    revenue: "₹1,12,455",
  },
  {
    name: "Kundan Necklace",
    views: 980,
    orders: 38,
    conversion: "3.9%",
    revenue: "₹72,162",
  },
  {
    name: "Cotton Kurta Pack",
    views: 750,
    orders: 28,
    conversion: "3.7%",
    revenue: "₹92,372",
  },
  {
    name: "Embroidered Dupatta",
    views: 620,
    orders: 22,
    conversion: "3.5%",
    revenue: "₹19,778",
  },
  {
    name: "Oxidized Jhumka Set",
    views: 540,
    orders: 18,
    conversion: "3.3%",
    revenue: "₹10,782",
  },
];

const revenueData = [
  { name: "Jan", revenue: 45000, orders: 42 },
  { name: "Feb", revenue: 52000, orders: 48 },
  { name: "Mar", revenue: 48000, orders: 44 },
  { name: "Apr", revenue: 61000, orders: 56 },
  { name: "May", revenue: 55000, orders: 51 },
  { name: "Jun", revenue: 67000, orders: 62 },
  { name: "Jul", revenue: 72000, orders: 68 },
];

const deviceData = [
  { name: "Mobile", value: 65, color: "hsl(var(--primary))" },
  { name: "Desktop", value: 30, color: "hsl(var(--primary)/.6)" },
  { name: "Tablet", value: 5, color: "hsl(var(--primary)/.3)" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Detailed insights into your store performance
          </p>
        </div>
        <div className="flex gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/40">
          {["7D", "30D", "90D", "12M"].map((period, i) => (
            <button
              key={period}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-tighter ${
                i === 1
                  ? "bg-background text-primary shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Product Views",
            value: "12,480",
            icon: Eye,
            change: "+22.4%",
            up: true,
            tooltip: "Total unique storefront views",
          },
          {
            label: "Total Orders",
            value: "156",
            icon: ShoppingCart,
            change: "+12.1%",
            up: true,
            tooltip: "Delivered & Processing orders",
          },
          {
            label: "Conversion Rate",
            value: "4.2%",
            icon: TrendingUp,
            change: "+0.5%",
            up: true,
            tooltip: "Orders / Total Views",
          },
          {
            label: "Gross Revenue",
            value: "₹2,45,800",
            icon: IndianRupee,
            change: "-2.3%",
            up: false,
            tooltip: "Revenue before commissions",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="shadow-sm border-border/60 hover:border-primary/20 transition-all overflow-hidden relative group"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors border border-transparent group-hover:border-primary/10 shadow-inner">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${stat.up ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}
                >
                  {stat.up ? (
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  ) : (
                    <ArrowDownRight className="h-2.5 w-2.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                {stat.value}
              </p>
              <p className="text-[10px] font-extrabold text-muted-foreground mt-1 uppercase tracking-widest opacity-70">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-extrabold uppercase tracking-tight">
                Revenue Forecast
              </CardTitle>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>{" "}
                  Revenue
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>{" "}
                  Orders
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-border/40"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700 }}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                      fontSize: 12,
                    }}
                    itemStyle={{ fontWeight: 800 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-extrabold uppercase tracking-tight">
              Sales by Device
            </CardTitle>
            <CardDescription className="text-[11px] font-medium">
              Where your customers shop from
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-black text-foreground">65%</p>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase">
                  Mobile
                </p>
              </div>
            </div>
            <div className="w-full space-y-3 mt-6">
              {deviceData.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: d.color }}
                    ></div>
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">
                      {d.name}
                    </span>
                  </div>
                  <span className="tabular-nums">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Products Table */}
        <Card className="lg:col-span-2 shadow-sm border-border/60 overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-extrabold uppercase tracking-tight">
                Best Selling Products
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] font-black uppercase tracking-widest h-8 px-3"
              >
                View All Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/5">
                    <th className="text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40">
                      Product
                    </th>
                    <th className="text-right px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40">
                      Views
                    </th>
                    <th className="text-right px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40">
                      Orders
                    </th>
                    <th className="text-right px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40">
                      Conv.
                    </th>
                    <th className="text-right px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {topProducts.map((p, i) => (
                    <tr
                      key={i}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      <td className="px-5 py-4 font-extrabold text-foreground group-hover:text-primary transition-colors">
                        {p.name}
                      </td>
                      <td className="px-5 py-4 text-right text-muted-foreground font-bold tabular-nums">
                        {p.views.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right text-muted-foreground font-bold tabular-nums">
                        {p.orders}
                      </td>
                      <td className="px-5 py-4 text-right font-black text-primary text-[11px] uppercase">
                        {p.conversion}
                      </td>
                      <td className="px-5 py-4 text-right font-black text-foreground tabular-nums tracking-tighter">
                        {p.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights Card */}
        <Card className="shadow-sm border-border/60 bg-primary/[0.02] relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base font-extrabold uppercase tracking-tight">
              AI Insights
            </CardTitle>
            <CardDescription className="text-[11px] font-bold text-primary/60 uppercase tracking-widest">
              Powered by ShopSure Intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-background border border-primary/10 shadow-sm relative group hover:border-primary/30 transition-all">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight text-foreground">
                    Traffic Spike
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-1 leading-relaxed">
                    Your "Blue Anarkali Set" is receiving 40% more views from
                    Delhi than last week.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background border border-warning/10 shadow-sm relative group hover:border-warning/30 transition-all">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight text-foreground">
                    Market Opportunity
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-1 leading-relaxed">
                    High demand for "Oxidized Jewellery" in South Mumbai.
                    Consider running a targeted ad.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full font-black text-xs uppercase tracking-widest h-11 rounded-xl shadow-lg shadow-primary/20">
                Expand Vision Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
