'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { ordersService } from "@/services/orders.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusVariant = (s: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (s?.toUpperCase()) {
    case "DELIVERED": return "default";
    case "SHIPPED": return "secondary";
    case "CANCELLED": return "destructive";
    default: return "outline";
  }
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => ordersService.getAdminOrders(page, 20),
    staleTime: 30_000,
  });

  const { data: orderDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["admin-order-detail", selectedOrderId],
    queryFn: () => ordersService.getBuyerOrder(selectedOrderId!),
    enabled: !!selectedOrderId,
  });

  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filtered = orders.filter((o: any) => {
    const matchSearch =
      !search ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.sellerName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || o.status?.toLowerCase() === status.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Global order history — {data?.total ?? 0} total orders
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Search by order ID, customer, or seller..."
          className="md:w-[340px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium font-mono">{order.id}</TableCell>
                    <TableCell>{order.buyerName ?? "—"}</TableCell>
                    <TableCell>{order.sellerName ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{parseFloat(order.totalAmount ?? "0").toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>{order.itemCount ?? order.items?.length ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.paymentMethod ?? "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
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

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orderDetail ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Order ID</p>
                  <p className="font-mono font-bold">{orderDetail.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Status</p>
                  <Badge variant={statusVariant(orderDetail.status)}>{orderDetail.status}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Payment</p>
                  <p className="font-semibold">{orderDetail.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Placed</p>
                  <p className="font-semibold">{orderDetail.placedAt ? new Date(orderDetail.placedAt).toLocaleDateString("en-IN") : "—"}</p>
                </div>
              </div>
              {orderDetail.shippingAddress && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-bold mb-2">Shipping Address</p>
                  <div className="bg-muted/40 rounded-lg p-3 text-sm">
                    <p className="font-semibold">{orderDetail.shippingAddress.name}</p>
                    <p>{orderDetail.shippingAddress.street}, {orderDetail.shippingAddress.city}</p>
                    <p>{orderDetail.shippingAddress.state} — {orderDetail.shippingAddress.zip}</p>
                    <p>{orderDetail.shippingAddress.phone}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs uppercase font-bold mb-2">Items</p>
                <div className="space-y-2">
                  {orderDetail.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-muted/20 rounded-lg px-3 py-2 text-sm">
                      <div>
                        <p className="font-semibold">{item.productTitle}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">₹{parseFloat(item.lineTotal).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{parseFloat(orderDetail.subtotalAmount).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>₹{parseFloat(orderDetail.shippingAmount).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>₹{parseFloat(orderDetail.taxAmount).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Total</span><span>₹{parseFloat(orderDetail.totalAmount).toLocaleString("en-IN")}</span></div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
