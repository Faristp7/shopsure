"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminSectionShell } from "@/components/admin/admin-section-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, PowerOff, Search } from "lucide-react";
import { couponsService, type Coupon, type DiscountType, type CouponStatus } from "@/services/coupons.service";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface CouponForm {
  code: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  startDate?: string;
  endDate?: string;
}

const statusColor = (s: CouponStatus) => {
  switch (s) {
    case "ACTIVE": return "bg-success/10 text-success border-success/20";
    case "INACTIVE": return "bg-muted text-muted-foreground";
    case "EXPIRED": return "bg-destructive/10 text-destructive border-destructive/20";
  }
};

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CouponForm>({
    defaultValues: { type: "PERCENTAGE", value: 10 },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons", statusFilter],
    queryFn: () => couponsService.getCoupons(1, statusFilter === "all" ? undefined : (statusFilter as CouponStatus)),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: couponsService.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setShowCreate(false);
      reset();
      toast({ title: "Coupon created successfully" });
    },
    onError: () => toast({ title: "Failed to create coupon", variant: "destructive" }),
  });

  const deactivateMutation = useMutation({
    mutationFn: couponsService.deactivateCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast({ title: "Coupon deactivated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: couponsService.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast({ title: "Coupon deleted" });
    },
  });

  const coupons = (data?.data ?? []).filter((c: Coupon) =>
    !search || c.code.toLowerCase().includes(search.toLowerCase())
  );

  const couponType = watch("type");

  return (
    <AdminSectionShell
      title="Coupons"
      description="Percentage or fixed discounts, usage limits, and eligibility rules."
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search code..."
              className="pl-9 w-[200px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Used / Max</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                    No coupons found
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((c: Coupon) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono font-bold">{c.code}</TableCell>
                    <TableCell className="text-sm">{c.type.replace("_", " ")}</TableCell>
                    <TableCell className="font-semibold">
                      {c.type === "PERCENTAGE" ? `${c.value}%` : c.type === "FIXED" ? `₹${c.value}` : "Free Shipping"}
                    </TableCell>
                    <TableCell className="text-sm">{c.minOrderAmount ? `₹${c.minOrderAmount}` : "—"}</TableCell>
                    <TableCell className="text-sm">{c.usedCount} / {c.maxUses ?? "∞"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.endDate ? new Date(c.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No expiry"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs font-bold ${statusColor(c.status)}`}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {c.status === "ACTIVE" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deactivateMutation.mutate(c.id)}
                            disabled={deactivateMutation.isPending}
                          >
                            <PowerOff className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(c.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Coupon</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input placeholder="SPRING20" className="font-mono uppercase" {...register("code", { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue="PERCENTAGE" onValueChange={(v) => {}}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage off</SelectItem>
                    <SelectItem value="FIXED">Fixed amount</SelectItem>
                    <SelectItem value="FREE_SHIPPING">Free shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input type="number" min={0} placeholder="20" {...register("value", { required: true, valueAsNumber: true })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Order (₹)</Label>
                <Input type="number" min={0} placeholder="500" {...register("minOrderAmount", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Max Uses</Label>
                <Input type="number" min={1} placeholder="100" {...register("maxUses", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" {...register("startDate")} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" {...register("endDate")} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Create Coupon
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminSectionShell>
  );
}
