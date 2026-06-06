"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  ChevronDown,
  AlertTriangle,
  IndianRupee,
  AlertCircle,
  Download,
  Printer,
  Plus,
  StickyNote,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

type OrderStatus = "CREATED" | "PENDING_PAYMENT" | "PAID" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  CREATED: { color: "bg-secondary text-muted-foreground border-border", label: "New", icon: <ShoppingBag className="h-3.5 w-3.5" /> },
  PENDING_PAYMENT: { color: "bg-warning/10 text-warning border-warning/20", label: "Awaiting Payment", icon: <Clock className="h-3.5 w-3.5" /> },
  PAID: { color: "bg-success/10 text-success border-success/20", label: "Paid", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  CONFIRMED: { color: "bg-primary/10 text-primary border-primary/20", label: "Confirmed", icon: <Package className="h-3.5 w-3.5" /> },
  SHIPPED: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "Shipped", icon: <Truck className="h-3.5 w-3.5" /> },
  DELIVERED: { color: "bg-success/10 text-success border-success/20", label: "Delivered", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  CANCELLED: { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Cancelled", icon: <XCircle className="h-3.5 w-3.5" /> },
  RETURNED: { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Returned", icon: <XCircle className="h-3.5 w-3.5" /> },
};

const paymentColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  PAID: "bg-success/10 text-success border-success/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20",
  REFUNDED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  PARTIALLY_REFUNDED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

// --- Collapsible Section Wrapper ---
const Section = ({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden shadow-sm border-border/60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
          <h2 className="text-base font-extrabold text-foreground">{title}</h2>
        </div>
        <div
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>
      {open && (
        <CardContent className="pt-0 px-4 sm:px-5 pb-4 sm:pb-5 animate-fade-in">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [courierInput, setCourierInput] = useState("");
  const [trackingInput, setTrackingInput] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["seller-order", id],
    queryFn: () => ordersService.getSellerOrder(id),
  });

  const confirmMutation = useMutation({
    mutationFn: () => ordersService.confirmOrder(id),
    onSuccess: () => {
      toast.success("Order confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["seller-order", id] });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Failed to confirm order"),
  });

  const shipMutation = useMutation({
    mutationFn: () => ordersService.shipOrder(id),
    onSuccess: () => {
      toast.success("Order marked as shipped");
      queryClient.invalidateQueries({ queryKey: ["seller-order", id] });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Failed"),
  });

  const deliverMutation = useMutation({
    mutationFn: () => ordersService.deliverOrder(id),
    onSuccess: () => {
      toast.success("Order marked as delivered");
      queryClient.invalidateQueries({ queryKey: ["seller-order", id] });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Failed"),
  });

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        {[1, 2, 3].map((i) => <div key={i} className="bg-card rounded-xl p-6 h-32 animate-pulse border border-border" />)}
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive/50 mb-4" />
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Button variant="outline" onClick={() => router.push("/seller/orders")}>Back to Orders</Button>
      </div>
    );
  }

  const cfg = statusConfig[order.status] ?? statusConfig.CREATED;
  const shippingAddr = order.shippingAddress as any;
  const totalAmount = parseFloat(order.totalAmount);
  const commission = parseFloat(order.commissionAmount);
  const netPayout = parseFloat(order.sellerPayableAmount);
  const subtotal = parseFloat(order.subtotalAmount ?? order.totalAmount);
  const grandTotal = totalAmount;

  const addNote = () => {
    if (!newNote.trim()) return;
    setNewNote("");
    toast.success("Note added");
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
    toast.success("Message sent");
  };

  const actions: { label: string; onClick: () => void; variant?: "default" | "destructive" | "outline"; loading?: boolean }[] = [];
  if (order.status === "PAID") {
    actions.push({ label: "Confirm Order", onClick: () => confirmMutation.mutate(), variant: "default", loading: confirmMutation.isPending });
  }
  if (order.status === "CONFIRMED") {
    actions.push({ label: "Mark as Shipped", onClick: () => shipMutation.mutate(), variant: "default", loading: shipMutation.isPending });
  }
  if (order.status === "SHIPPED") {
    actions.push({ label: "Mark as Delivered", onClick: () => deliverMutation.mutate(), variant: "default", loading: deliverMutation.isPending });
  }

  const timeline = [
    { stage: "Order Placed", done: true, date: order.createdAt },
    { stage: "Confirmed", done: ["CONFIRMED", "SHIPPED", "DELIVERED"].includes(order.status) },
    { stage: "Shipped", done: ["SHIPPED", "DELIVERED"].includes(order.status) },
    { stage: "Delivered", done: order.status === "DELIVERED" },
  ];

  return (
    <div className="space-y-4 pb-28 sm:pb-6 animate-fade-in max-w-5xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/seller/orders")}
          className="shrink-0 rounded-xl hover:bg-muted border border-transparent hover:border-border"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {order.id}
            </h1>
            <Badge
              variant="outline"
              className={`font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] ${statusConfig[order.status].color}`}
            >
              {statusConfig[order.status].icon}{" "}
              <span className="ml-1">{order.status}</span>
            </Badge>
            <Badge
              variant="outline"
              className={`font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] ${paymentColors[order.paymentStatus]}`}
            >
              {order.paymentStatus}
            </Badge>
          </div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
            {order.date}
          </p>
        </div>
      </div>

      {/* ── 1. PAYOUT SUMMARY ── */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-background shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <IndianRupee className="h-24 w-24 text-primary" />
        </div>
        <CardContent className="p-5 sm:p-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-70">
                Order Value
              </p>
              <p className="text-xl font-extrabold text-foreground flex items-center gap-0.5 tabular-nums">
                ₹{order?.total?.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-70">
                Commission (10%)
              </p>
              <p className="text-xl font-extrabold text-destructive flex items-center gap-0.5 tabular-nums">
                -{order?.commission?.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary/80">
                Net Payout
              </p>
              <p className="text-2xl font-black text-success flex items-center gap-0.5 tabular-nums">
                ₹{order?.netPayout?.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-70">
                Payout On
              </p>
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5 mt-1">
                <Clock className="h-4 w-4 text-warning" />
                {order?.expectedPayout}
              </p>
            </div>
          </div>

          {/* Desktop action bar */}
          {!isMobile && (
            <div className="flex flex-wrap gap-2.5 mt-6 pt-5 border-t border-primary/10">
              {actions.map((a) => (
                <Button
                  key={a.label}
                  variant={a.variant || "outline"}
                  size="sm"
                  onClick={a.onClick}
                  className="font-bold px-4 rounded-lg shadow-sm"
                >
                  {a.label}
                </Button>
              ))}
              <div className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-bold border-border/60"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-bold border-border/60"
                >
                  <Printer className="h-3.5 w-3.5 mr-1.5" />
                  Label
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* ── 2. ORDERED ITEMS ── */}
          <Section
            title="Ordered Items"
            icon={<ShoppingBag className="h-4 w-4" />}
          >
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-start p-4 rounded-xl bg-muted/20 border border-border/40 hover:border-primary/20 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-card flex items-center justify-center text-3xl shadow-sm border border-border/60 shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1 tracking-tight">
                      {item.variant}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground/60 uppercase mt-0.5">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-foreground tabular-nums">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 tabular-nums">
                      {item.qty} × ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
              <Separator className="bg-border/60" />
              <div className="space-y-2 text-sm px-1">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground tabular-nums">
                    ₹{subtotal?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {order?.shipping === 0 ? "Free" : `₹${order?.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Commission</span>
                  <span className="text-destructive tabular-nums">
                    -₹{order?.commission?.toLocaleString("en-IN")}
                  </span>
                </div>
                <Separator className="my-2 bg-border/40" />
                <div className="flex justify-between">
                  <span className="font-extrabold uppercase tracking-wider text-xs">
                    Grand Total
                  </span>
                  <span className="font-black text-lg text-foreground tabular-nums tracking-tight">
                    ₹{grandTotal?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* ── 3. CUSTOMER DETAILS ── */}
          <Section title="Customer Details" icon={<Mail className="h-4 w-4" />}>
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-extrabold text-foreground">
                    {order.customer?.name}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <a
                      href={`tel:${order.customer?.phone}`}
                      className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {order.customer?.phone}
                    </a>
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {order.customer?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/40 relative group">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/60" />
                  <div className="flex-1 min-w-0 pr-8">
                    <p className="text-sm font-bold text-foreground leading-relaxed">
                      {order.customer?.address}
                    </p>
                    {order.customer?.landmark && (
                      <p className="text-xs font-medium text-muted-foreground mt-1.5 bg-background/50 inline-block px-2 py-0.5 rounded border border-border/40">
                        Landmark: {order.customer?.landmark}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-lg hover:bg-background border border-transparent hover:border-border shadow-sm text-muted-foreground hover:text-primary transition-all"
                  onClick={() => copyAddress(order.customer.address)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                {copied && (
                  <p className="absolute -bottom-6 left-7 text-[10px] font-bold text-success uppercase tracking-wider animate-fade-in">
                    Address copied!
                  </p>
                )}
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          {/* ── 4. ORDER TIMELINE ── */}
          <Section title="Order Timeline" icon={<Clock className="h-4 w-4" />}>
            <div className="relative pl-2 py-2">
              {order?.timeline?.map((step: any, i: number) => (
                <div key={step.stage} className="relative pb-6 last:pb-0">
                  {/* Vertical line */}
                  {i < (order?.timeline?.length || 0) - 1 && (
                    <div
                      className={`absolute left-1.5 top-4 w-0.5 h-full ${step.done ? "bg-success" : "bg-border/60"}`}
                    />
                  )}
                  {/* Dot */}
                  <div
                    className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 z-10 ${step.done ? "bg-success border-success shadow-[0_0_8px_rgba(34,197,94,0.3)]" : "bg-background border-border/60"}`}
                  />
                  <div className="ml-6">
                    <p
                      className={`text-xs font-extrabold uppercase tracking-wider ${step.done ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.stage}
                    </p>
                    {step.done && step.date && (
                      <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                        {step.date.split(",")[0]}{" "}
                        <span className="opacity-50 mx-1">·</span> {step.by}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {order.cancellation && (
                <div className="mt-4 p-3 rounded-xl bg-destructive/[0.03] border border-destructive/20 shadow-sm">
                  <p className="text-xs font-extrabold text-destructive flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="h-3.5 w-3.5" /> Order Cancelled
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-2 leading-tight">
                    Reason: {order.cancellation.reason}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase">
                    By: {order.cancellation.by}
                  </p>
                </div>
              )}
            </div>
          </Section>

          {/* ── 5. SHIPPING INFO ── */}
          <Section title="Logistics" icon={<Truck className="h-4 w-4" />}>
            {order.status === "Shipped" || order.status === "Delivered" ? (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-70">
                      Courier Partner
                    </p>
                    <p className="text-sm font-bold text-foreground mt-0.5">
                      {order.courier || "Delhivery Logistics"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-70">
                      AWB Tracking ID
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-sm font-mono font-bold text-primary tracking-wider">
                        {order.trackingId || "DEL1234567890"}
                      </p>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-full font-bold h-10 shadow-lg shadow-primary/10"
                >
                  Track Real-time
                </Button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
                  Configure shipping details to generate manifest.
                </p>
                <div className="space-y-2">
                  <Select value={courierInput} onValueChange={setCourierInput}>
                    <SelectTrigger className="font-bold border-border/60">
                      <SelectValue placeholder="Select Partner" />
                    </SelectTrigger>
                    <SelectContent className="font-bold">
                      <SelectItem value="delhivery">Delhivery</SelectItem>
                      <SelectItem value="bluedart">Blue Dart</SelectItem>
                      <SelectItem value="dtdc">DTDC</SelectItem>
                      <SelectItem value="ecom">Ecom Express</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Enter Tracking AWB"
                    className="font-bold border-border/60"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-bold text-xs h-9 border-border/60"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Print Shipping Label
                </Button>
              </div>
            )}
          </Section>
        </div>
      </div>

      {/* ── 6. MESSAGES & NOTES ── */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <Section
          title="Communication"
          icon={<MessageSquare className="h-4 w-4" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1 no-scrollbar">
              {order?.messages?.map((msg: any, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl text-sm relative group ${msg.from === "Seller" ? "bg-primary/10 ml-8" : "bg-muted/40 mr-8"}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground/80">
                      {msg.from}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type message to buyer…"
                className="font-medium h-10 border-border/60"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                className="shrink-0 h-10 w-10 rounded-xl shadow-md"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Section>

        <Section
          title="Internal Merchant Notes"
          icon={<StickyNote className="h-4 w-4" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {order?.notes?.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-muted-foreground/40 border-2 border-dashed border-border/40 rounded-xl">
                  <StickyNote className="h-8 w-8 mb-2" />
                  <p className="text-[10px] font-extrabold uppercase tracking-widest">
                    No internal notes yet
                  </p>
                </div>
              ) : (
                order?.notes?.map((note: any, i: number) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-warning/[0.03] border border-warning/10 shadow-sm relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-warning/40"></div>
                    <p className="text-sm font-bold text-foreground leading-relaxed">
                      {note.text}
                    </p>
                    <p className="text-[10px] font-extrabold text-muted-foreground/60 mt-2 uppercase tracking-tight">
                      {note.time}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Private note (only you can see)…"
                className="font-medium h-10"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
              />
              <Button
                size="icon"
                onClick={addNote}
                className="shrink-0 h-10 w-10 rounded-xl bg-warning hover:bg-warning/90 text-warning-foreground shadow-md shadow-warning/10 transition-all"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Section>
      </div>

      {/* ── 9. MOBILE STICKY BOTTOM BAR ── */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/60 p-4 pb-6 flex gap-3 overflow-x-auto no-scrollbar shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          {actions.map((a) => (
            <Button
              key={a.label}
              variant={a.variant || "default"}
              size="sm"
              onClick={a.onClick}
              className="whitespace-nowrap shrink-0 flex-1 h-11 font-extrabold rounded-xl shadow-lg shadow-primary/10 uppercase tracking-widest text-[10px]"
            >
              {a.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 h-11 w-11 rounded-xl border-border/60 bg-background/50"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 h-11 w-11 rounded-xl border-border/60 bg-background/50"
          >
            <Printer className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
}
