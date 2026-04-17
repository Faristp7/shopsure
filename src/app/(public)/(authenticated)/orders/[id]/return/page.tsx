"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ordersService } from "@/services/orders.service";
import { returnsService, type ReturnReason } from "@/services/returns.service";
import { useToast } from "@/hooks/use-toast";

const REASONS: { value: ReturnReason; label: string }[] = [
  { value: "WRONG_ITEM", label: "Received wrong item" },
  { value: "DAMAGED", label: "Item arrived damaged" },
  { value: "NOT_AS_DESCRIBED", label: "Not as described" },
  { value: "SIZE_FIT", label: "Size / fit issue" },
  { value: "CHANGED_MIND", label: "Changed my mind" },
  { value: "OTHER", label: "Other" },
];

export default function ReturnRequestPage() {
  const { id: orderId } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [reason, setReason] = useState<ReturnReason>("WRONG_ITEM");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["buyer-order", orderId],
    queryFn: () => ordersService.getBuyerOrder(orderId),
  });

  const returnMutation = useMutation({
    mutationFn: returnsService.createReturn,
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Return request submitted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to submit return request", variant: "destructive" });
    },
  });

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!selectedItems.size || !description.trim()) return;
    returnMutation.mutate({
      orderId,
      reason,
      description,
      items: Array.from(selectedItems).map((id) => ({ orderItemId: id, quantity: 1 })),
    });
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Return Request Submitted</h1>
        <p className="text-muted-foreground mb-8">
          Your return request has been submitted. We will review it within 24–48 hours and update you via email.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/orders">My Orders</Link>
          </Button>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      {/* Breadcrumb */}
      <Link href={`/orders/${orderId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Order
      </Link>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <RotateCcw className="h-6 w-6" />
            Request a Return
          </h1>
          <p className="text-muted-foreground mt-1">Order #{orderId}</p>
        </div>

        {/* Select Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Items to Return</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => toggleItem(item.id)}
              >
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.productTitle}</p>
                  <p className="text-xs text-muted-foreground">SKU: {item.sku} · Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-sm">₹{parseFloat(item.lineTotal).toLocaleString("en-IN")}</p>
              </div>
            ))}
            {selectedItems.size === 0 && (
              <p className="text-xs text-muted-foreground">Please select at least one item to return.</p>
            )}
          </CardContent>
        </Card>

        {/* Reason */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reason for Return</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select a reason</Label>
              <Select value={reason} onValueChange={(v) => setReason(v as ReturnReason)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Please describe the issue in detail. Include any relevant information such as size discrepancy, damage location, etc."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Policy Note */}
        <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground border border-border/40">
          <p className="font-semibold text-foreground mb-1">Return Policy</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Items must be returned within 7 days of delivery</li>
            <li>Products must be unused and in original packaging</li>
            <li>Refund will be processed within 5–7 business days after pickup</li>
          </ul>
        </div>

        {/* Submit */}
        <Button
          className="w-full gap-2"
          size="lg"
          disabled={!selectedItems.size || !description.trim() || returnMutation.isPending}
          onClick={handleSubmit}
        >
          {returnMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Submit Return Request
        </Button>
      </div>
    </div>
  );
}
