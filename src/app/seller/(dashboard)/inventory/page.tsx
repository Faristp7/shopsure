"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Plus,
  Minus,
  History,
  ShieldCheck,
  AlertTriangle,
  Package,
  Search,
  ChevronDown,
  Clock,
  User,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

interface StockChange {
  id: string;
  productId: number;
  productName: string;
  type:
    | "manual_add"
    | "manual_remove"
    | "sale"
    | "return"
    | "bulk_update"
    | "auto_disable";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
  by: string;
}

interface InventoryProduct {
  id: number;
  name: string;
  image: string;
  stock: number;
  lowStockThreshold: number;
  oversellProtection: boolean;
  lastUpdated: string;
}

const mockHistory: StockChange[] = [
  {
    id: "1",
    productId: 1,
    productName: "Blue Anarkali Set",
    type: "sale",
    quantity: -1,
    previousStock: 13,
    newStock: 12,
    reason: "Order #ORD-1247",
    timestamp: "2 hours ago",
    by: "System",
  },
  {
    id: "2",
    productId: 2,
    productName: "Kundan Necklace",
    type: "manual_remove",
    quantity: -2,
    previousStock: 5,
    newStock: 3,
    reason: "Damaged in transit",
    timestamp: "5 hours ago",
    by: "Priya",
  },
  {
    id: "3",
    productId: 3,
    productName: "Cotton Kurta Pack (3)",
    type: "auto_disable",
    quantity: 0,
    previousStock: 1,
    newStock: 0,
    reason: "Stock depleted — auto-disabled",
    timestamp: "1 day ago",
    by: "System",
  },
  {
    id: "4",
    productId: 6,
    productName: "Oxidized Jhumka Set",
    type: "manual_add",
    quantity: 20,
    previousStock: 20,
    newStock: 40,
    reason: "Restocked from supplier",
    timestamp: "2 days ago",
    by: "Priya",
  },
  {
    id: "5",
    productId: 4,
    productName: "Embroidered Dupatta",
    type: "return",
    quantity: 1,
    previousStock: 24,
    newStock: 25,
    reason: "Return — Order #ORD-1201",
    timestamp: "3 days ago",
    by: "System",
  },
  {
    id: "6",
    productId: 1,
    productName: "Blue Anarkali Set",
    type: "bulk_update",
    quantity: 5,
    previousStock: 8,
    newStock: 13,
    reason: "Bulk restock",
    timestamp: "4 days ago",
    by: "Priya",
  },
];

const mockProducts: InventoryProduct[] = [
  {
    id: 1,
    name: "Blue Anarkali Set",
    image: "👗",
    stock: 12,
    lowStockThreshold: 5,
    oversellProtection: true,
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    name: "Kundan Necklace",
    image: "📿",
    stock: 3,
    lowStockThreshold: 5,
    oversellProtection: true,
    lastUpdated: "5 hours ago",
  },
  {
    id: 3,
    name: "Cotton Kurta Pack (3)",
    image: "👕",
    stock: 0,
    lowStockThreshold: 5,
    oversellProtection: true,
    lastUpdated: "1 day ago",
  },
  {
    id: 4,
    name: "Embroidered Dupatta",
    image: "🧣",
    stock: 25,
    lowStockThreshold: 5,
    oversellProtection: true,
    lastUpdated: "3 days ago",
  },
  {
    id: 5,
    name: "Silk Saree Collection",
    image: "🥻",
    stock: 2,
    lowStockThreshold: 5,
    oversellProtection: false,
    lastUpdated: "1 week ago",
  },
  {
    id: 6,
    name: "Oxidized Jhumka Set",
    image: "💎",
    stock: 40,
    lowStockThreshold: 10,
    oversellProtection: true,
    lastUpdated: "2 days ago",
  },
];

const typeConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  manual_add: {
    label: "Manual Add",
    color: "text-success bg-success/10",
    icon: <Plus className="h-3 w-3" />,
  },
  manual_remove: {
    label: "Manual Remove",
    color: "text-destructive bg-destructive/10",
    icon: <Minus className="h-3 w-3" />,
  },
  sale: {
    label: "Sale",
    color: "text-primary bg-primary/10",
    icon: <TrendingDown className="h-3 w-3" />,
  },
  return: {
    label: "Return",
    color: "text-success bg-success/10",
    icon: <RotateCcw className="h-3 w-3" />,
  },
  bulk_update: {
    label: "Bulk Update",
    color: "text-accent-foreground bg-accent",
    icon: <ArrowUpDown className="h-3 w-3" />,
  },
  auto_disable: {
    label: "Auto Disabled",
    color: "text-destructive bg-destructive/10",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
};

type Tab = "adjust" | "history" | "settings";

export default function InventoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("adjust");
  const [products, setProducts] = useState(mockProducts);
  const [history] = useState(mockHistory);
  const [search, setSearch] = useState("");
  const [adjustProduct, setAdjustProduct] = useState<number | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustType, setAdjustType] = useState<"add" | "remove">("add");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredHistory = history.filter((h) =>
    h.productName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdjust = () => {
    const qty = parseInt(adjustQty);
    if (!adjustProduct || isNaN(qty) || qty <= 0 || !adjustReason) return;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== adjustProduct) return p;
        const newStock =
          adjustType === "add" ? p.stock + qty : Math.max(0, p.stock - qty);
        return { ...p, stock: newStock, lastUpdated: "Just now" };
      }),
    );
    setAdjustProduct(null);
    setAdjustQty("");
    setAdjustReason("");
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "adjust",
      label: "Stock Adjustment",
      icon: <ArrowUpDown className="h-4 w-4" />,
    },
    {
      key: "history",
      label: "Change History",
      icon: <History className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Protection Settings",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-5 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => router.push("/seller/products")}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Inventory Control
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage stock levels, track changes, and prevent overselling
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* TAB: Stock Adjustment */}
      {activeTab === "adjust" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Adjustment Form */}
          <AnimatePresence mode="popLayout">
            {adjustProduct && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4 shadow-xl shadow-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ArrowUpDown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-foreground">
                        Adjust Stock
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {products.find((p) => p.id === adjustProduct)?.name} ·
                        Current:{" "}
                        {products.find((p) => p.id === adjustProduct)?.stock}{" "}
                        units
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdjustType("add")}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        adjustType === "add"
                          ? "bg-success text-success-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5 inline mr-1" /> Add Stock
                    </button>
                    <button
                      onClick={() => setAdjustType("remove")}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        adjustType === "remove"
                          ? "bg-destructive text-destructive-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Minus className="h-3.5 w-3.5 inline mr-1" /> Remove Stock
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground ml-1">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        value={adjustQty}
                        onChange={(e) => setAdjustQty(e.target.value)}
                        className="font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground ml-1">
                        Reason
                      </Label>
                      <Input
                        placeholder="e.g. Restocked from supplier"
                        value={adjustReason}
                        onChange={(e) => setAdjustReason(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-bold"
                      onClick={() => setAdjustProduct(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="font-bold shadow-md shadow-primary/10"
                      onClick={handleAdjust}
                    >
                      Apply Adjustment
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Stock Cards */}
          <div className="grid gap-3">
            {filteredProducts.map((product) => {
              const stockLevel =
                product.stock === 0
                  ? "zero"
                  : product.stock <= product.lowStockThreshold
                    ? "low"
                    : "healthy";
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-card border rounded-xl p-4 flex items-center gap-4 transition-all shadow-sm ${
                    stockLevel === "zero"
                      ? "border-destructive/30 bg-destructive/[0.02]"
                      : stockLevel === "low"
                        ? "border-warning/30 bg-warning/[0.02]"
                        : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl relative flex-shrink-0 shadow-inner">
                    {product.image}
                    {stockLevel === "low" && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center border-2 border-background">
                        <AlertTriangle className="h-2.5 w-2.5 text-warning-foreground" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-lg font-extrabold tabular-nums ${
                          stockLevel === "zero"
                            ? "text-destructive"
                            : stockLevel === "low"
                              ? "text-warning"
                              : "text-foreground"
                        }`}
                      >
                        {product.stock}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        units
                      </span>
                      {stockLevel === "low" && (
                        <span className="text-[10px] font-extrabold text-warning bg-warning/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          LOW STOCK
                        </span>
                      )}
                      {stockLevel === "zero" && (
                        <span className="text-[10px] font-extrabold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">
                      Threshold: {product.lowStockThreshold} units · Updated:{" "}
                      {product.lastUpdated}
                    </p>
                  </div>

                  {/* Stock bar */}
                  <div className="w-20 hidden md:block">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          stockLevel === "zero"
                            ? "bg-destructive"
                            : stockLevel === "low"
                              ? "bg-warning"
                              : "bg-success"
                        }`}
                        style={{
                          width: `${Math.min((product.stock / (product.lowStockThreshold * 4)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdjustProduct(product.id)}
                    className="flex-shrink-0 font-bold text-xs h-8 border-border/60"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1" /> Adjust
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* TAB: Change History */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {filteredHistory.map((entry, i) => {
              const config = typeConfig[entry.type];
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-4 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${config.color}`}
                  >
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-foreground">
                        {entry.productName}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tighter ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">
                      {entry.reason}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-tight">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {entry.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {entry.by}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground font-medium">
                        {entry.previousStock}
                      </span>
                      <span className="text-muted-foreground opacity-50">
                        →
                      </span>
                      <span
                        className={`font-extrabold ${entry.newStock > entry.previousStock ? "text-success" : entry.newStock < entry.previousStock ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        {entry.newStock}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded mt-1 inline-block ${entry.quantity > 0 ? "text-success bg-success/10" : entry.quantity < 0 ? "text-destructive bg-destructive/10" : "text-muted-foreground bg-muted"}`}
                    >
                      {entry.quantity > 0
                        ? `+${entry.quantity}`
                        : entry.quantity}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* TAB: Protection Settings */}
      {activeTab === "settings" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Global Settings */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground">
                  Global Protection Rules
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Configure how inventory behaves across all products
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                {
                  title: "Auto-disable at zero stock",
                  desc: "Automatically set product to 'Out of Stock' when inventory reaches 0. Prevents overselling.",
                  defaultOn: true,
                },
                {
                  title: "Low stock alerts",
                  desc: "Get notified when any product falls below its low-stock threshold.",
                  defaultOn: true,
                },
                {
                  title: "Oversell prevention (global)",
                  desc: "Block orders for products with 0 stock. Buyers will see 'Sold Out' instead of 'Add to Cart'.",
                  defaultOn: true,
                },
                {
                  title: "Auto-pause on repeated low stock",
                  desc: "Pause products that hit low stock 3+ times in 30 days for seller review.",
                  defaultOn: false,
                },
              ].map((setting, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-border/40 hover:border-primary/20 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {setting.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
                      {setting.desc}
                    </p>
                  </div>
                  <Switch defaultChecked={setting.defaultOn} className="mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Per-product threshold settings */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shadow-inner">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground">
                  Low Stock Thresholds
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Set custom alert levels per product
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/20 border border-border/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-base flex-shrink-0 shadow-sm border border-border/60">
                    {product.image}
                  </div>
                  <p className="flex-1 text-sm font-bold text-foreground truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <Label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                      Alert at
                    </Label>
                    <div className="flex items-center bg-card border border-border rounded-lg h-9 px-1 shadow-inner">
                      <Input
                        type="number"
                        defaultValue={product.lowStockThreshold}
                        className="w-12 h-7 text-xs text-center border-0 focus-visible:ring-0 font-extrabold p-0"
                      />
                      <span className="text-[10px] font-bold text-muted-foreground pr-2">
                        u
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full font-bold shadow-lg shadow-primary/10 h-11 rounded-xl"
              size="default"
            >
              Save Threshold Settings
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
