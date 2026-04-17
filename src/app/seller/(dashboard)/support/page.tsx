"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Phone,
  Loader2,
  X,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportService, type Ticket, type TicketStatus, type TicketType, type TicketPriority } from "@/services/support.service";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<TicketStatus, { icon: React.ElementType; color: string; bg: string }> = {
  OPEN: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  IN_PROGRESS: { icon: Clock, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  RESOLVED: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10 border-success/20" },
  CLOSED: { icon: CheckCircle2, color: "text-muted-foreground", bg: "bg-muted border-border" },
};

const priorityStyles: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/20",
  MEDIUM: "bg-warning/10 text-warning border-warning/20",
  LOW: "bg-muted text-muted-foreground border-border",
};

export default function SupportPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newForm, setNewForm] = useState({ subject: "", type: "OTHER" as TicketType, priority: "MEDIUM" as TicketPriority, message: "" });
  const [replyText, setReplyText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["seller-tickets"],
    queryFn: () => supportService.getTickets(),
  });

  const { data: ticketDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["seller-ticket", selectedTicket?.id],
    queryFn: () => supportService.getTicket(selectedTicket!.id),
    enabled: !!selectedTicket,
  });

  const createMutation = useMutation({
    mutationFn: supportService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-tickets"] });
      setShowCreate(false);
      setNewForm({ subject: "", type: "OTHER", priority: "MEDIUM", message: "" });
      toast({ title: "Ticket created successfully" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: string; message: string }) =>
      supportService.replyToTicket(ticketId, { message }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["seller-ticket", selectedTicket?.id], updated);
      setReplyText("");
      toast({ title: "Reply sent" });
    },
  });

  const tickets = data?.data ?? [];
  const filtered = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Support & Disputes</h1>
          <p className="text-sm text-muted-foreground">Manage your help tickets and resolution requests</p>
        </div>
        <Button className="h-10 px-6 font-bold shadow-lg shadow-primary/10 rounded-xl" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New Ticket
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ticket ID or subject..." className="pl-10 h-10 border-border/60 font-medium" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No tickets found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket: Ticket) => {
            const statusInfo = statusStyles[ticket.status] ?? statusStyles.OPEN;
            const StatusIcon = statusInfo.icon;
            return (
              <Card
                key={ticket.id}
                className="cursor-pointer transition-all hover:shadow-md border-border/60 group hover:border-primary/20 overflow-hidden"
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-0 flex items-stretch">
                  <div className={`w-1.5 ${statusInfo.color.replace("text-", "bg-")}`}></div>
                  <div className="p-4 flex flex-1 items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${statusInfo.bg} ${statusInfo.color}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
                          {ticket.subject}
                        </p>
                        <Badge variant="outline" className={`text-[9px] font-black uppercase px-2 py-0 rounded-full border-0 ${priorityStyles[ticket.priority]}`}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        <span>{ticket.id}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{ticket.type}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                        {ticket.status.replace("_", " ")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <Card className="border-primary/20 bg-primary/[0.02] shadow-sm">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-foreground mb-1">Knowledge Base</h3>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
              Find answers to common questions about payouts, shipping, and returns.
            </p>
            <Button variant="link" className="p-0 h-auto mt-3 text-xs font-bold text-primary">
              Browse Tutorials →
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground mb-4 shadow-inner">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-foreground mb-1">Merchant Support</h3>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
              Need urgent help? Our merchant support team is available mon-sat, 10am-7pm.
            </p>
            <Button variant="link" className="p-0 h-auto mt-3 text-xs font-bold text-primary">
              Chat with us →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="Briefly describe your issue" value={newForm.subject} onChange={(e) => setNewForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newForm.type} onValueChange={(v) => setNewForm((f) => ({ ...f, type: v as TicketType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DISPUTE">Dispute</SelectItem>
                    <SelectItem value="PAYMENT">Payment</SelectItem>
                    <SelectItem value="RETURN">Return</SelectItem>
                    <SelectItem value="LISTING">Listing</SelectItem>
                    <SelectItem value="SHIPPING">Shipping</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newForm.priority} onValueChange={(v) => setNewForm((f) => ({ ...f, priority: v as TicketPriority }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Describe your issue in detail..." rows={4} value={newForm.message} onChange={(e) => setNewForm((f) => ({ ...f, message: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              disabled={!newForm.subject || !newForm.message || createMutation.isPending}
              onClick={() => createMutation.mutate(newForm)}
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-start justify-between gap-2 pr-8">
              <div>
                <DialogTitle className="text-base">{selectedTicket?.subject}</DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">{selectedTicket?.id} · {selectedTicket?.type}</p>
              </div>
            </div>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : ticketDetail ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 py-2">
                {ticketDetail.messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.isSupport ? "" : "flex-row-reverse"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.isSupport ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {msg.authorName[0]}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${msg.isSupport ? "" : "items-end flex flex-col"}`}>
                      <div className={`rounded-2xl px-4 py-3 text-sm ${msg.isSupport ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                        {msg.body}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                        {msg.authorName} · {new Date(msg.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {ticketDetail.status !== "RESOLVED" && ticketDetail.status !== "CLOSED" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Textarea
                    placeholder="Type a reply..."
                    rows={2}
                    className="flex-1 resize-none"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button
                    size="icon"
                    className="h-full"
                    disabled={!replyText.trim() || replyMutation.isPending}
                    onClick={() => replyMutation.mutate({ ticketId: ticketDetail.id, message: replyText })}
                  >
                    {replyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
