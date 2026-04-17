'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, ChevronLeft, ChevronRight, Send, CheckCircle2, ArrowUpCircle } from "lucide-react";
import { disputesService, type Dispute, type DisputeStatus } from "@/services/disputes.service";
import { useToast } from "@/hooks/use-toast";

const statusVariant = (s: DisputeStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (s) {
    case "OPEN": return "destructive";
    case "UNDER_REVIEW": return "outline";
    case "RESOLVED": return "default";
    case "ESCALATED": return "secondary";
    case "CLOSED": return "secondary";
  }
};

export default function AdminDisputesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [replyText, setReplyText] = useState("");
  const [resolution, setResolution] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-disputes", page, status, search],
    queryFn: () => disputesService.getDisputes(page, status === "all" ? undefined : (status as DisputeStatus), search || undefined),
    staleTime: 30_000,
  });

  const { data: disputeDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["admin-dispute", selectedDispute?.id],
    queryFn: () => disputesService.getDispute(selectedDispute!.id),
    enabled: !!selectedDispute,
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => disputesService.replyToDispute(id, message),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin-dispute", selectedDispute?.id], updated);
      setReplyText("");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => disputesService.resolveDispute(id, resolution, refundAmount || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
      setSelectedDispute(null);
      toast({ title: "Dispute resolved" });
    },
  });

  const escalateMutation = useMutation({
    mutationFn: disputesService.escalateDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
      setSelectedDispute(null);
      toast({ title: "Dispute escalated" });
    },
  });

  const disputes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Disputes</h2>
          <p className="text-muted-foreground">Resolve conflicts between buyers and sellers.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Search by order ID or buyer..."
          className="md:w-[300px]"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="ESCALATED">Escalated</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
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
                <TableHead>Dispute ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                    No disputes found
                  </TableCell>
                </TableRow>
              ) : (
                disputes.map((d: Dispute) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium font-mono">{d.id}</TableCell>
                    <TableCell className="font-mono text-sm">{d.orderId}</TableCell>
                    <TableCell>{d.buyerName}</TableCell>
                    <TableCell>{d.sellerName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{d.reason}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(d.status)}>{d.status.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDispute(d)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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

      {/* Dispute Detail Dialog */}
      <Dialog open={!!selectedDispute} onOpenChange={(open) => !open && setSelectedDispute(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>Dispute {selectedDispute?.id}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDispute?.buyerName} vs {selectedDispute?.sellerName} · Order {selectedDispute?.orderId}
            </p>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : disputeDetail ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-6">
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-1">Reason: {disputeDetail.reason}</p>
                <p className="text-muted-foreground">{disputeDetail.description}</p>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                {disputeDetail.messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "ADMIN" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.role === "BUYER" ? "bg-blue-100 text-blue-700" : msg.role === "SELLER" ? "bg-orange-100 text-orange-700" : "bg-primary/10 text-primary"}`}>
                      {msg.authorName[0]}
                    </div>
                    <div className={`flex-1 max-w-[75%] ${msg.role === "ADMIN" ? "items-end flex flex-col" : ""}`}>
                      <div className={`rounded-2xl px-3 py-2 text-sm ${msg.role === "ADMIN" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                        {msg.body}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {msg.authorName} ({msg.role}) · {new Date(msg.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              {disputeDetail.status !== "RESOLVED" && disputeDetail.status !== "CLOSED" && (
                <div className="flex gap-2 pt-2 border-t">
                  <Textarea placeholder="Admin message..." rows={2} className="flex-1 resize-none" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                  <Button size="icon" className="h-full" disabled={!replyText.trim() || replyMutation.isPending} onClick={() => replyMutation.mutate({ id: disputeDetail.id, message: replyText })}>
                    {replyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              )}

              {/* Resolve */}
              {disputeDetail.status !== "RESOLVED" && disputeDetail.status !== "CLOSED" && (
                <div className="border-t pt-4 space-y-3">
                  <p className="text-sm font-semibold">Resolve Dispute</p>
                  <div className="space-y-2">
                    <Label className="text-xs">Resolution Note</Label>
                    <Textarea placeholder="Explain the resolution..." rows={2} value={resolution} onChange={(e) => setResolution(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Refund Amount (optional)</Label>
                    <Input placeholder="e.g. 1500" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 gap-2"
                      disabled={!resolution || resolveMutation.isPending}
                      onClick={() => resolveMutation.mutate({ id: disputeDetail.id })}
                    >
                      {resolveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Mark Resolved
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={escalateMutation.isPending}
                      onClick={() => escalateMutation.mutate(disputeDetail.id)}
                    >
                      <ArrowUpCircle className="h-4 w-4" /> Escalate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
