"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Ban,
  Pause,
  Play,
  Package,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Warehouse,
  Filter,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  lowStockThreshold: number;
  status: "Active" | "Out of Stock" | "Draft" | "Paused";
  image: string;
  autoDisabled: boolean;
  oversellProtection: boolean;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Blue Anarkali Set",
    price: "₹2,499",
    stock: 12,
    lowStockThreshold: 5,
    status: "Active",
    image: "👗",
    autoDisabled: false,
    oversellProtection: true,
  },
  {
    id: 2,
    name: "Kundan Necklace",
    price: "₹1,899",
    stock: 3,
    lowStockThreshold: 5,
    status: "Active",
    image: "📿",
    autoDisabled: false,
    oversellProtection: true,
  },
  {
    id: 3,
    name: "Cotton Kurta Pack (3)",
    price: "₹3,299",
    stock: 0,
    lowStockThreshold: 5,
    status: "Out of Stock",
    image: "👕",
    autoDisabled: true,
    oversellProtection: true,
  },
  {
    id: 4,
    name: "Embroidered Dupatta",
    price: "₹899",
    stock: 25,
    lowStockThreshold: 5,
    status: "Active",
    image: "🧣",
    autoDisabled: false,
    oversellProtection: true,
  },
  {
    id: 5,
    name: "Silk Saree Collection",
    price: "₹5,499",
    stock: 2,
    lowStockThreshold: 5,
    status: "Draft",
    image: "🥻",
    autoDisabled: false,
    oversellProtection: false,
  },
  {
    id: 6,
    name: "Oxidized Jhumka Set",
    price: "₹599",
    stock: 40,
    lowStockThreshold: 10,
    status: "Active",
    image: "💎",
    autoDisabled: false,
    oversellProtection: true,
  },
  {
    id: 7,
    name: "Hand Block Print Kurta",
    price: "₹1,299",
    stock: 0,
    lowStockThreshold: 3,
    status: "Paused",
    image: "👘",
    autoDisabled: true,
    oversellProtection: true,
  },
];

const statusConfig: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  Active: {
    bg: "bg-success/10",
    text: "text-success",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  "Out of Stock": {
    bg: "bg-destructive/10",
    text: "text-destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
  Draft: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    icon: <Edit className="h-3 w-3" />,
  },
  Paused: {
    bg: "bg-warning/10",
    text: "text-warning",
    icon: <Pause className="h-3 w-3" />,
  },
};

const filterTabs = [
  "All",
  "Active",
  "Low Stock",
  "Out of Stock",
  "Paused",
  "Draft",
];

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeFilter, setActiveFilter] = useState("All");
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkStockValue, setBulkStockValue] = useState("");

  const getStockLevel = (p: Product) => {
    if (p.stock === 0) return "zero";
    if (p.stock <= p.lowStockThreshold) return "low";
    return "healthy";
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    switch (activeFilter) {
      case "Active":
        return p.status === "Active";
      case "Low Stock":
        return p.stock > 0 && p.stock <= p.lowStockThreshold;
      case "Out of Stock":
        return p.stock === 0;
      case "Paused":
        return p.status === "Paused";
      case "Draft":
        return p.status === "Draft";
      default:
        return true;
    }
  });

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold,
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const pausedCount = products.filter((p) => p.status === "Paused").length;

  const togglePause = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.status === "Paused")
          return { ...p, status: p.stock > 0 ? "Active" : "Out of Stock" };
        return { ...p, status: "Paused" };
      }),
    );
  };

  const toggleOversellProtection = (id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, oversellProtection: !p.oversellProtection } : p,
      ),
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map((p) => p.id));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const applyBulkStock = () => {
    const val = parseInt(bulkStockValue);
    if (isNaN(val) || val < 0) return;
    setProducts((prev) =>
      prev.map((p) => {
        if (!selectedIds.includes(p.id)) return p;
        const newStock = val;
        return {
          ...p,
          stock: newStock,
          status:
            newStock === 0
              ? "Out of Stock"
              : p.status === "Out of Stock"
                ? "Active"
                : p.status,
          autoDisabled: newStock === 0,
        };
      }),
    );
    setBulkStockValue("");
    setSelectedIds([]);
    setBulkEditMode(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} products in your catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/seller/inventory")}
          >
            <Warehouse className="h-4 w-4 mr-1" /> Inventory
          </Button>
          <Button size="sm" onClick={() => router.push("/seller/products/add")}>
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        </div>
      </div>

      {/* Alert Banners */}
      <AnimatePresence mode="popLayout">
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-3"
          >
            {lowStockCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warning/10 border border-warning/20 shadow-sm">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="text-sm font-medium text-warning">
                  {lowStockCount} product{lowStockCount > 1 ? "s" : ""} running
                  low on stock
                </p>
                <button
                  onClick={() => setActiveFilter("Low Stock")}
                  className="text-xs font-bold text-warning underline underline-offset-2 ml-1"
                >
                  View
                </button>
              </div>
            )}
            {outOfStockCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 shadow-sm">
                <Ban className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">
                  {outOfStockCount} product{outOfStockCount > 1 ? "s" : ""}{" "}
                  auto-disabled (0 stock)
                </p>
                <button
                  onClick={() => setActiveFilter("Out of Stock")}
                  className="text-xs font-bold text-destructive underline underline-offset-2 ml-1"
                >
                  View
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Products",
            value: products.length,
            icon: Package,
            color: "text-primary",
          },
          {
            label: "Low Stock",
            value: lowStockCount,
            icon: TrendingDown,
            color: "text-warning",
          },
          {
            label: "Out of Stock",
            value: outOfStockCount,
            icon: XCircle,
            color: "text-destructive",
          },
          {
            label: "Paused",
            value: pausedCount,
            icon: Pause,
            color: "text-muted-foreground",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className={`text-2xl font-extrabold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {tab === "Low Stock" && lowStockCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-warning/20 text-warning rounded-full text-[10px]">
                  {lowStockCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm md:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bulk Edit Bar */}
      <div className="flex items-center gap-3">
        <Button
          variant={bulkEditMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setBulkEditMode(!bulkEditMode);
            setSelectedIds([]);
          }}
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          {bulkEditMode ? "Exit Bulk Edit" : "Bulk Stock Edit"}
        </Button>
        <AnimatePresence mode="popLayout">
          {bulkEditMode && selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {selectedIds.length} selected →
              </span>
              <Input
                type="number"
                placeholder="New stock"
                value={bulkStockValue}
                onChange={(e) => setBulkStockValue(e.target.value)}
                className="w-24 h-8 text-sm"
              />
              <Button size="sm" className="h-8" onClick={applyBulkStock}>
                Apply
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {bulkEditMode && (
                  <th className="py-3 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-border cursor-pointer"
                    />
                  </th>
                )}
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Stock
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Oversell Guard
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => {
                  const stockLevel = getStockLevel(product);
                  const statusStyle = statusConfig[product.status];
                  return (
                    <motion.tr
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`border-b border-border/50 last:border-0 transition-colors ${
                        stockLevel === "zero"
                          ? "bg-destructive/[0.03]"
                          : stockLevel === "low"
                            ? "bg-warning/[0.03]"
                            : "hover:bg-muted/30"
                      }`}
                    >
                      {bulkEditMode && (
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(product.id)}
                            onChange={() => toggleSelect(product.id)}
                            className="rounded border-border cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg relative">
                            {product.image}
                            {stockLevel === "low" && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-warning rounded-full flex items-center justify-center border-2 border-background">
                                <AlertTriangle className="h-2 w-2 text-warning-foreground" />
                              </span>
                            )}
                            {stockLevel === "zero" && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive rounded-full flex items-center justify-center border-2 border-background">
                                <Ban className="h-2 w-2 text-destructive-foreground" />
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block">
                              {product.name}
                            </span>
                            {product.autoDisabled && (
                              <p className="text-[10px] text-destructive font-bold mt-0.5">
                                Auto-disabled · 0 stock
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">
                        {product.price}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-extrabold tabular-nums ${
                              stockLevel === "zero"
                                ? "text-destructive"
                                : stockLevel === "low"
                                  ? "text-warning"
                                  : "text-foreground"
                            }`}
                          >
                            {product.stock}
                          </span>
                          <span className="text-muted-foreground text-[10px] font-medium">
                            units
                          </span>
                          {stockLevel === "low" && (
                            <span className="text-[10px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded-full">
                              LOW
                            </span>
                          )}
                        </div>
                        {/* Mini stock bar */}
                        <div className="w-16 h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
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
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {statusStyle.icon}
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <Switch
                            checked={product.oversellProtection}
                            onCheckedChange={() =>
                              toggleOversellProtection(product.id)
                            }
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => togglePause(product.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              product.status === "Paused"
                                ? "bg-success/10 text-success hover:bg-success/20"
                                : "hover:bg-muted text-muted-foreground"
                            }`}
                            title={
                              product.status === "Paused"
                                ? "Resume product"
                                : "Pause product"
                            }
                          >
                            {product.status === "Paused" ? (
                              <Play className="h-4 w-4" />
                            ) : (
                              <Pause className="h-4 w-4" />
                            )}
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
