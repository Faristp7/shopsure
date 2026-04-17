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
import { Loader2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { auditService, type AuditLog } from "@/services/audit.service";

const actionCategories = [
  "USER_SUSPENDED",
  "USER_ACTIVATED",
  "PRODUCT_APPROVED",
  "PRODUCT_REJECTED",
  "ORDER_REFUNDED",
  "SELLER_APPROVED",
  "SELLER_REJECTED",
  "DISPUTE_RESOLVED",
  "COUPON_CREATED",
  "SETTINGS_UPDATED",
  "LOGIN_FAILED",
];

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit-logs", page, search, action],
    queryFn: () => auditService.getLogs(page, search || undefined, action === "all" ? undefined : action),
    staleTime: 30_000,
  });

  const logs = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">Track system activities and administrative actions.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Search by actor, action, or target..."
          className="md:w-[320px]"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <Select value={action} onValueChange={(v) => { setAction(v); setPage(1); }}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {actionCategories.map((a) => (
              <SelectItem key={a} value={a}>{a.replace(/_/g, " ")}</SelectItem>
            ))}
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
                <TableHead>Log ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log: AuditLog) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.id}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {log.action.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{log.actorName}</p>
                        <p className="text-xs text-muted-foreground">{log.actorRole}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{log.targetLabel}</p>
                        <p className="text-xs text-muted-foreground">{log.targetType}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {log.ipAddress ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
    </div>
  );
}
