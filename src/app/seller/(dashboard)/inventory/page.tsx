"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plus,
  Minus,
  History,
  ShieldCheck,
  AlertTriangle,
  Package,
  Search,
  Loader2,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { inventoryService, type InventoryItem, type StockHistory } from "@/services/inventory.service";
import { useToast } from "@/hooks/use-toast";

const statusColor = (s: string) => {
  switch (s) {
    case "IN_STOCK": return "bg-success/10 text-success border-success/20";
    case "LOW_STOCK": return "bg-warning/10 text-warning border-warning/20";
    case "OUT_OF_STOCK": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const changeTypeIcon: Record<string, React.ElementType> = {
  SALE: TrendingDown,
  RESTOCK: TrendingUp,
  ADJUSTMENT: Package,
  RETURN: RotateCcw,
};

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [adjustTarget, setAdjustTarget] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustNote, setAdjustNote] = useState("");

  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ["seller-inventory", page, statusFilter, search],
    queryFn: () => inventoryService.getInventory(page, statusFilter === "all" ? undefined : statusFilter, search || undefined),
    staleTime: 30_000,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["seller-inventory-history", historyPage],
    queryFn: () => inventoryService.getHistory(historyPage),
    staleTime: 60_000,
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["seller-inventory-settings"],
    queryFn: inventoryService.getSettings,
    staleTime: 5 * 60_000,
  });

  const adjustMutation = useMutation({
    mutationFn: inventoryService.adjustStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["seller-inventory-history"] });
      setAdjustTarget(null);
      setAdjustQty(0);
      setAdjustNote("");
      toast({ title: "Stock adjusted successfully" });
    },
    onError: () => toast({ title: "Failed to adjust stock", variant: "destructive" }),
  });

  const settingsMutation = useMutation({
    mutationFn: inventoryService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-inventory-settings"] });
      toast({ title: "Settings saved" });
    },
  });

  const items = inventoryData?.data ?? [];
  const totalPages = inventoryData?.totalPages ?? 1;
  const historyItems = historyData?.data ?? [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage your product stock levels</p>
        </div>
      </div>

      <Tabs defaultValue="stock">
        <TabsList className="bg-muted/40 p-1 rounded-xl">
          <TabsTrigger value="stock" className="gap-1.5 font-bold px-5 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Package className="h-4 w-4" /> Stock Levels
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 font-bold px-5 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="h-4 w-4" /> Change History
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5 font-bold px-5 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShieldCheck className="h-4 w-4" /> Protection
          </TabsTrigger>
        </TabsList>

        {/* STOCK LEVELS */}
        <TabsContent value="stock" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or SKU..."
                className="pl-9 border-border/60"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px] border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Card className="shadow-sm border-border/60">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-bold text-xs uppercase">Product</TableHead>
                        <TableHead className="font-bold text-xs uppercase">SKU</TableHead>
                        <TableHead className="text-center font-bold text-xs uppercase">Stock</TableHead>
                        <TableHead className="text-center font-bold text-xs uppercase">Threshold</TableHead>
                        <TableHead className="font-bold text-xs uppercase">Status</TableHead>
                        <TableHead className="font-bold text-xs uppercase">Last Updated</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((item: InventoryItem) => (
                          <TableRow key={item.id} className="hover:bg-muted/20 border-b border-border/40">
                            <TableCell className="font-semibold">{item.productTitle}</TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">{item.sku}</TableCell>
                            <TableCell className="text-center font-bold">{item.currentStock}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{item.lowStockThreshold}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] font-bold ${statusColor(item.status)}`}>
                                {item.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(item.lastUpdated).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-bold"
                                onClick={() => setAdjustTarget(item)}
                              >
                                Adjust
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history" className="space-y-4 mt-4">
          {historyLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Card className="shadow-sm border-border/60">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-bold text-xs uppercase">Product / SKU</TableHead>
                        <TableHead className="font-bold text-xs uppercase">Type</TableHead>
                        <TableHead className="text-center font-bold text-xs uppercase">Change</TableHead>
                        <TableHead className="text-center font-bold text-xs uppercase">After</TableHead>
                        <TableHead className="font-bold text-xs uppercase">Note</TableHead>
                        <TableHead className="font-bold text-xs uppercase">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                            No history yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        historyItems.map((h: StockHistory) => {
                          const Icon = changeTypeIcon[h.changeType] ?? Package;
                          return (
                            <TableRow key={h.id} className="hover:bg-muted/20 border-b border-border/40">
                              <TableCell>
                                <p className="font-semibold text-sm">{h.productTitle}</p>
                                <p className="text-xs text-muted-foreground font-mono">{h.sku}</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5 text-sm">
                                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{h.changeType}</span>
                                </div>
                              </TableCell>
                              <TableCell className={`text-center font-bold ${h.quantityChange > 0 ? "text-success" : "text-destructive"}`}>
                                {h.quantityChange > 0 ? `+${h.quantityChange}` : h.quantityChange}
                              </TableCell>
                              <TableCell className="text-center font-semibold">{h.stockAfter}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{h.note ?? "—"}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(h.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SETTINGS */}
        <TabsContent value="settings" className="space-y-4 mt-4">
          {settingsLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : settings ? (
            <Card className="max-w-lg shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Inventory Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/20">
                  <div>
                    <p className="text-sm font-bold">Low Stock Alerts</p>
                    <p className="text-xs text-muted-foreground">Get notified when stock is low</p>
                  </div>
                  <Switch
                    checked={settings.lowStockAlerts}
                    onCheckedChange={(v) => settingsMutation.mutate({ lowStockAlerts: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/20">
                  <div>
                    <p className="text-sm font-bold">Auto-hide Out of Stock</p>
                    <p className="text-xs text-muted-foreground">Hide products when stock hits 0</p>
                  </div>
                  <Switch
                    checked={settings.autoHideOutOfStock}
                    onCheckedChange={(v) => settingsMutation.mutate({ autoHideOutOfStock: v })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Default Low Stock Threshold
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      defaultValue={settings.lowStockThreshold}
                      className="w-28 font-bold border-border/60"
                      onBlur={(e) => settingsMutation.mutate({ lowStockThreshold: Number(e.target.value) })}
                    />
                    <span className="flex items-center text-sm text-muted-foreground">units</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>

      {/* Adjust Stock Dialog */}
      <Dialog open={!!adjustTarget} onOpenChange={(open) => !open && setAdjustTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          {adjustTarget && (
            <div className="space-y-4 py-2">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="font-semibold text-sm">{adjustTarget.productTitle}</p>
                <p className="text-xs text-muted-foreground">Current stock: <span className="font-bold text-foreground">{adjustTarget.currentStock}</span></p>
              </div>
              <div className="space-y-2">
                <Label>Quantity change</Label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setAdjustQty((q) => q - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    className="text-center font-bold w-20"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                  />
                  <Button variant="outline" size="icon" onClick={() => setAdjustQty((q) => q + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  New stock: <span className="font-bold text-foreground">{adjustTarget.currentStock + adjustQty}</span>
                </p>
              </div>
              <div className="space-y-2">
                <Label>Note (optional)</Label>
                <Input placeholder="e.g. Restocked from supplier" value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustTarget(null)}>Cancel</Button>
            <Button
              disabled={adjustQty === 0 || adjustMutation.isPending}
              onClick={() => adjustMutation.mutate({
                productId: adjustTarget!.productId,
                quantity: adjustQty,
                note: adjustNote || undefined,
              })}
            >
              {adjustMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
