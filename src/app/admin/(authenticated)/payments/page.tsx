'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { IndianRupee, Clock, CheckCircle2, Loader2, Play } from "lucide-react";
import { paymentsService, type Payout } from "@/services/payments.service";
import { useToast } from "@/hooks/use-toast";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const statusColor = (s: string) => {
  switch (s) {
    case "PAID": return "bg-success/10 text-success border-success/20";
    case "PROCESSING": return "bg-warning/10 text-warning border-warning/20";
    case "FAILED": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["admin-payments-summary"],
    queryFn: paymentsService.getAdminSummary,
    staleTime: 60_000,
  });

  const { data: payoutsData, isLoading: payoutsLoading } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: () => paymentsService.getAdminPayouts(),
    staleTime: 30_000,
  });

  const payouts = payoutsData?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payments & Commission</h2>
        <p className="text-muted-foreground">Monitor platform revenue and seller payouts.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {summaryLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-20 p-6" />
            </Card>
          ))
        ) : summary ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Settled</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fmt(summary.totalSettled)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fmt(summary.totalPending)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Refunds</CardTitle>
                <IndianRupee className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fmt(summary.totalRefunds)}</div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      <Tabs defaultValue="payouts">
        <TabsList>
          <TabsTrigger value="payouts">Seller Payouts</TabsTrigger>
        </TabsList>
        <TabsContent value="payouts" className="mt-4">
          {payoutsLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Initiated</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                        No payouts yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    payouts.map((p: Payout) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium font-mono">{p.id}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(p.initiatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {p.completedAt ? new Date(p.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </TableCell>
                        <TableCell className="text-right">{fmt(p.gross)}</TableCell>
                        <TableCell className="text-right text-destructive">-{fmt(p.commission)}</TableCell>
                        <TableCell className="text-right font-bold text-success">{fmt(p.net)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs font-bold ${statusColor(p.status)}`}>
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
