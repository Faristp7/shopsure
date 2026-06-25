"use client";

import { useDeferredValue, useMemo, useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AdminSectionShell } from "@/components/admin/admin-section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  couponsService,
  type Coupon,
  type CouponStatus,
  type DiscountType,
  type CouponValidationResult,
} from "@/services/coupons.service";
import {
  CalendarClock,
  Loader2,
  Pencil,
  Plus,
  Power,
  Search,
  TicketPercent,
  Trash2,
  WandSparkles,
} from "lucide-react";

const couponFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9][A-Z0-9_-]{3,31}$/, "Use 4-32 uppercase letters or numbers"),
    name: z.string().trim().min(2).max(80),
    description: z.string().trim().max(300).optional().or(z.literal("")),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    value: z.number().min(0.01, "Value must be greater than zero"),
    minimumOrderValue: z.number().min(0).optional(),
    usageLimit: z.number().int().min(1).optional(),
    startsAt: z.string().optional(),
    expiresAt: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === "PERCENTAGE" && value.value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: "Percentage discounts cannot exceed 100%",
      });
    }

    if (value.startsAt && value.expiresAt) {
      const startsAt = new Date(value.startsAt);
      const expiresAt = new Date(value.expiresAt);

      if (startsAt >= expiresAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expiresAt"],
          message: "Expiration must be after the start date",
        });
      }
    }
  });

type CouponFormValues = z.infer<typeof couponFormSchema>;

const previewSchema = z.object({
  orderAmount: z.number().min(0.01, "Enter an order amount"),
});

type PreviewValues = z.infer<typeof previewSchema>;

const DEFAULT_FORM_VALUES: CouponFormValues = {
  code: "",
  name: "",
  description: "",
  type: "PERCENTAGE",
  value: 10,
  minimumOrderValue: undefined,
  usageLimit: undefined,
  startsAt: "",
  expiresAt: "",
};

function statusClassName(status: CouponStatus) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
    case "INACTIVE":
      return "border-slate-300 bg-slate-100 text-slate-700";
    case "EXPIRED":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700";
  }
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDatetimeLocalValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function toApiDate(value?: string) {
  if (!value) {
    return undefined;
  }

  return new Date(value).toISOString();
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data?.message === "string") {
      return data.message;
    }
    if (Array.isArray(data?.message) && data.message.length > 0) {
      return String(data.message[0]);
    }
  }

  return fallback;
}

function mapCouponToFormValues(coupon: Coupon): CouponFormValues {
  return {
    code: coupon.code,
    name: coupon.name,
    description: coupon.description ?? "",
    type: coupon.type,
    value: coupon.value,
    minimumOrderValue: coupon.minimumOrderValue ?? undefined,
    usageLimit: coupon.usageLimit ?? undefined,
    startsAt: toDatetimeLocalValue(coupon.startsAt),
    expiresAt: toDatetimeLocalValue(coupon.expiresAt),
  };
}

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState<"all" | CouponStatus>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [validationPreview, setValidationPreview] =
    useState<CouponValidationResult | null>(null);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const previewForm = useForm<PreviewValues>({
    resolver: zodResolver(previewSchema),
    defaultValues: { orderAmount: 2500 },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons", statusFilter, deferredSearch],
    queryFn: () =>
      couponsService.getCoupons({
        page: 1,
        limit: 50,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: deferredSearch || undefined,
      }),
    staleTime: 30_000,
  });

  const coupons = data?.items ?? [];

  const metrics = useMemo(
    () => ({
      total: coupons.length,
      active: coupons.filter((coupon) => coupon.status === "ACTIVE").length,
      inactive: coupons.filter((coupon) => coupon.status === "INACTIVE").length,
      expired: coupons.filter((coupon) => coupon.status === "EXPIRED").length,
    }),
    [coupons],
  );

  const invalidateCoupons = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });

  const createMutation = useMutation({
    mutationFn: couponsService.createCoupon,
    onSuccess: async () => {
      await invalidateCoupons();
      setDialogOpen(false);
      setValidationPreview(null);
      form.reset(DEFAULT_FORM_VALUES);
      toast({ title: "Coupon created" });
    },
    onError: (error) =>
      toast({
        title: getApiErrorMessage(error, "Failed to create coupon"),
        variant: "destructive",
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      couponId,
      payload,
    }: {
      couponId: string;
      payload: Partial<CouponFormValues>;
    }) => couponsService.updateCoupon(couponId, payload),
    onSuccess: async () => {
      await invalidateCoupons();
      setDialogOpen(false);
      setEditingCoupon(null);
      setValidationPreview(null);
      form.reset(DEFAULT_FORM_VALUES);
      toast({ title: "Coupon updated" });
    },
    onError: (error) =>
      toast({
        title: getApiErrorMessage(error, "Failed to update coupon"),
        variant: "destructive",
      }),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      couponId,
      isActive,
    }: {
      couponId: string;
      isActive: boolean;
    }) => couponsService.updateCouponStatus(couponId, isActive),
    onSuccess: async (_, variables) => {
      await invalidateCoupons();
      toast({ title: variables.isActive ? "Coupon activated" : "Coupon deactivated" });
    },
    onError: (error) =>
      toast({
        title: getApiErrorMessage(error, "Failed to update status"),
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: couponsService.deleteCoupon,
    onSuccess: async () => {
      await invalidateCoupons();
      toast({ title: "Coupon deleted" });
    },
    onError: (error) =>
      toast({
        title: getApiErrorMessage(error, "Failed to delete coupon"),
        variant: "destructive",
      }),
  });

  const generateMutation = useMutation({
    mutationFn: couponsService.generateCouponCode,
    onSuccess: ({ code }) => {
      form.setValue("code", code, { shouldDirty: true, shouldValidate: true });
      toast({ title: "Coupon code generated" });
    },
    onError: (error) =>
      toast({
        title: getApiErrorMessage(error, "Could not generate code"),
        variant: "destructive",
      }),
  });

  const validateMutation = useMutation({
    mutationFn: ({
      code,
      orderAmount,
    }: {
      code: string;
      orderAmount: number;
    }) => couponsService.validateCoupon({ code, orderAmount }, true),
    onSuccess: (result) => {
      setValidationPreview(result);
      toast({ title: "Coupon is valid for the preview amount" });
    },
    onError: (error) => {
      setValidationPreview(null);
      toast({
        title: getApiErrorMessage(error, "Coupon validation failed"),
        variant: "destructive",
      });
    },
  });

  function openCreateDialog() {
    setEditingCoupon(null);
    setValidationPreview(null);
    previewForm.reset({ orderAmount: 2500 });
    form.reset(DEFAULT_FORM_VALUES);
    setDialogOpen(true);
  }

  function openEditDialog(coupon: Coupon) {
    setEditingCoupon(coupon);
    setValidationPreview(null);
    previewForm.reset({ orderAmount: coupon.minimumOrderValue ?? 2500 });
    form.reset(mapCouponToFormValues(coupon));
    setDialogOpen(true);
  }

  function buildPayload(values: CouponFormValues) {
    return {
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      type: values.type,
      value: values.value,
      minimumOrderValue: values.minimumOrderValue,
      usageLimit: values.usageLimit,
      startsAt: toApiDate(values.startsAt),
      expiresAt: toApiDate(values.expiresAt),
    };
  }

  const selectedType = form.watch("type");

  return (
    <AdminSectionShell
      title="Coupons"
      description="Create, validate, activate, and retire promotional coupon codes."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total coupons</CardDescription>
            <CardTitle>{metrics.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle>{metrics.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive</CardDescription>
            <CardTitle>{metrics.inactive}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired</CardDescription>
            <CardTitle>{metrics.expired}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Manage coupons</CardTitle>
            <CardDescription>
              Search, filter, and maintain discount rules without leaving the admin panel.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by code or name"
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | CouponStatus)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              New coupon
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Minimum order</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                        No coupons match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-mono text-sm font-semibold">{coupon.code}</div>
                            <div className="font-medium">{coupon.name}</div>
                            {coupon.description ? (
                              <div className="text-sm text-muted-foreground">
                                {coupon.description}
                              </div>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {coupon.type === "PERCENTAGE"
                            ? `${coupon.value}% off`
                            : `${formatCurrency(coupon.value)} off`}
                        </TableCell>
                        <TableCell>{formatCurrency(coupon.minimumOrderValue)}</TableCell>
                        <TableCell>
                          {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>Starts: {formatDate(coupon.startsAt)}</div>
                            <div>Ends: {formatDate(coupon.expiresAt)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusClassName(coupon.status)}>
                            {coupon.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(coupon)}
                              aria-label={`Edit ${coupon.code}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                statusMutation.mutate({
                                  couponId: coupon.id,
                                  isActive: !coupon.isActive,
                                })
                              }
                              aria-label={
                                coupon.isActive ? `Deactivate ${coupon.code}` : `Activate ${coupon.code}`
                              }
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteMutation.mutate(coupon.id)}
                              aria-label={`Delete ${coupon.code}`}
                            >
                              <Trash2 className="h-4 w-4" />
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
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingCoupon(null);
            setValidationPreview(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit coupon" : "Create coupon"}</DialogTitle>
            <DialogDescription>
              Configure discount rules, schedule, and a preview validation scenario.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit((values) => {
              const payload = buildPayload(values);
              if (editingCoupon) {
                updateMutation.mutate({ couponId: editingCoupon.id, payload });
                return;
              }
              createMutation.mutate(payload);
            })}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coupon-code">Coupon code</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon-code"
                    {...form.register("code")}
                    className="font-mono uppercase"
                    placeholder="WELCOME10"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    disabled={generateMutation.isPending}
                    onClick={() =>
                      generateMutation.mutate({
                        prefix: form.getValues("name")
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .slice(0, 6)
                          .toUpperCase() || undefined,
                        length: 10,
                      })
                    }
                  >
                    {generateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <WandSparkles className="h-4 w-4" />
                    )}
                    Generate
                  </Button>
                </div>
                {form.formState.errors.code ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.code.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-name">Internal name</Label>
                <Input
                  id="coupon-name"
                  {...form.register("name")}
                  placeholder="Welcome Offer"
                />
                {form.formState.errors.name ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupon-description">Description</Label>
              <Textarea
                id="coupon-description"
                {...form.register("description")}
                placeholder="Optional admin note about where this coupon should be used."
                rows={3}
              />
              {form.formState.errors.description ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Discount type</Label>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        <SelectItem value="FIXED_AMOUNT">Fixed amount</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-value">
                  {selectedType === "PERCENTAGE" ? "Discount %" : "Discount amount"}
                </Label>
                <Input
                  id="coupon-value"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...form.register("value", { valueAsNumber: true })}
                />
                {form.formState.errors.value ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.value.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-min-order">Minimum order</Label>
                <Input
                  id="coupon-min-order"
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register("minimumOrderValue", {
                    setValueAs: (value) => (value === "" ? undefined : Number(value)),
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-usage-limit">Usage limit</Label>
                <Input
                  id="coupon-usage-limit"
                  type="number"
                  min="1"
                  step="1"
                  {...form.register("usageLimit", {
                    setValueAs: (value) => (value === "" ? undefined : Number(value)),
                  })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coupon-starts-at">Start date</Label>
                <Input id="coupon-starts-at" type="datetime-local" {...form.register("startsAt")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-expires-at">Expiration date</Label>
                <Input id="coupon-expires-at" type="datetime-local" {...form.register("expiresAt")} />
                {form.formState.errors.expiresAt ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.expiresAt.message}
                  </p>
                ) : null}
              </div>
            </div>

            <Card className="border-dashed">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TicketPercent className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Validation preview</CardTitle>
                </div>
                <CardDescription>
                  Test the current coupon against a sample order amount using the backend validation API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="preview-order-amount">Order amount</Label>
                    <Input
                      id="preview-order-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      {...previewForm.register("orderAmount", {
                        valueAsNumber: true,
                      })}
                    />
                    {previewForm.formState.errors.orderAmount ? (
                      <p className="text-sm text-destructive">
                        {previewForm.formState.errors.orderAmount.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      disabled={validateMutation.isPending}
                      onClick={previewForm.handleSubmit(({ orderAmount }) => {
                        const code = form.getValues("code");
                        if (!code) {
                          form.setError("code", {
                            type: "manual",
                            message: "Enter or generate a coupon code first",
                          });
                          return;
                        }
                        validateMutation.mutate({ code, orderAmount });
                      })}
                    >
                      {validateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CalendarClock className="h-4 w-4" />
                      )}
                      Validate
                    </Button>
                  </div>
                </div>

                {validationPreview ? (
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <div className="text-muted-foreground">Discount</div>
                        <div className="font-semibold">
                          {formatCurrency(validationPreview.discountAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Final amount</div>
                        <div className="font-semibold">
                          {formatCurrency(validationPreview.finalAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Minimum order</div>
                        <div className="font-semibold">
                          {formatCurrency(validationPreview.minimumOrderValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingCoupon ? (
                  "Save changes"
                ) : (
                  "Create coupon"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminSectionShell>
  );
}
