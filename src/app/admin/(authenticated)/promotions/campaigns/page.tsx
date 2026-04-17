"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminSectionShell } from "@/components/admin/admin-section-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Loader2, Plus, XCircle, Megaphone } from "lucide-react";
import { campaignsService, type Campaign, type CampaignStatus, type CampaignType } from "@/services/campaigns.service";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface CampaignForm {
  name: string;
  type: CampaignType;
  discountPercent: number;
  startDate: string;
  endDate: string;
}

const statusColor = (s: CampaignStatus) => {
  switch (s) {
    case "ACTIVE": return "bg-success/10 text-success border-success/20";
    case "SCHEDULED": return "bg-primary/10 text-primary border-primary/20";
    case "DRAFT": return "bg-muted text-muted-foreground";
    case "ENDED": return "bg-muted text-muted-foreground";
    case "CANCELLED": return "bg-destructive/10 text-destructive border-destructive/20";
  }
};

export default function AdminCampaignsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const { register, handleSubmit, reset } = useForm<CampaignForm>({
    defaultValues: { type: "SEASONAL", discountPercent: 20 },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-campaigns", statusFilter],
    queryFn: () => campaignsService.getCampaigns(1, statusFilter === "all" ? undefined : (statusFilter as CampaignStatus)),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (form: CampaignForm) => campaignsService.createCampaign({ ...form, productIds: [] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] });
      setShowCreate(false);
      reset();
      toast({ title: "Campaign created" });
    },
    onError: () => toast({ title: "Failed to create campaign", variant: "destructive" }),
  });

  const cancelMutation = useMutation({
    mutationFn: campaignsService.cancelCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] });
      toast({ title: "Campaign cancelled" });
    },
  });

  const campaigns = data?.data ?? [];

  return (
    <AdminSectionShell
      title="Campaigns"
      description="Named marketing campaigns with date ranges and linked creatives."
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="ENDED">Ended</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <Megaphone className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground font-medium">No campaigns yet</p>
          <Button className="mt-4 gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Create your first campaign
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c: Campaign) => (
                <TableRow key={c.id}>
                  <TableCell className="font-semibold">{c.name}</TableCell>
                  <TableCell className="text-sm">{c.type.replace(/_/g, " ")}</TableCell>
                  <TableCell className="font-bold">{c.discountPercent}%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(c.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(c.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </TableCell>
                  <TableCell>{c.productCount}</TableCell>
                  <TableCell>{c.totalRevenue != null ? `₹${c.totalRevenue.toLocaleString("en-IN")}` : "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs font-bold ${statusColor(c.status)}`}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(c.status === "SCHEDULED" || c.status === "ACTIVE") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => cancelMutation.mutate(c.id)}
                        disabled={cancelMutation.isPending}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input placeholder="Summer Sale 2026" {...register("name", { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue="SEASONAL">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLASH_SALE">Flash Sale</SelectItem>
                    <SelectItem value="SEASONAL">Seasonal</SelectItem>
                    <SelectItem value="CLEARANCE">Clearance</SelectItem>
                    <SelectItem value="BUNDLE">Bundle</SelectItem>
                    <SelectItem value="LOYALTY">Loyalty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input type="number" min={1} max={90} {...register("discountPercent", { required: true, valueAsNumber: true })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="datetime-local" {...register("startDate", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="datetime-local" {...register("endDate", { required: true })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminSectionShell>
  );
}
