"use client";

import {
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const tickets = [
  {
    id: "TKT-101",
    subject: "Order #1230 - Customer claims wrong item",
    status: "Open",
    type: "Dispute",
    date: "15 Feb 2026",
    priority: "High",
  },
  {
    id: "TKT-100",
    subject: "Payout delay for January earnings",
    status: "Resolved",
    type: "Payment",
    date: "12 Feb 2026",
    priority: "Medium",
  },
  {
    id: "TKT-099",
    subject: "Return request for Silk Saree",
    status: "In Progress",
    type: "Return",
    date: "10 Feb 2026",
    priority: "Low",
  },
  {
    id: "TKT-098",
    subject: "Product listing rejected - guidelines clarification",
    status: "Resolved",
    type: "Listing",
    date: "08 Feb 2026",
    priority: "Medium",
  },
];

const statusStyles: Record<string, { icon: any; color: string; bg: string }> = {
  Open: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
  },
  "In Progress": {
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  Resolved: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10 border-success/20",
  },
};

const priorityStyles: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-muted text-muted-foreground border-border",
};

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Support & Disputes
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your help tickets and resolution requests
          </p>
        </div>
        <Button className="h-10 px-6 font-bold shadow-lg shadow-primary/10 rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Create New Ticket
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ticket ID or subject..."
            className="pl-10 h-10 border-border/60 font-medium"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-border/60"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket, i) => {
          const statusInfo = statusStyles[ticket.status] || statusStyles.Open;
          const StatusIcon = statusInfo.icon;
          return (
            <Card
              key={ticket.id}
              className="cursor-pointer transition-all hover:shadow-md border-border/60 group hover:border-primary/20 overflow-hidden"
            >
              <CardContent className="p-0 flex items-stretch">
                <div
                  className={`w-1.5 ${statusInfo.color.replace("text-", "bg-")}`}
                ></div>
                <div className="p-4 flex flex-1 items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${statusInfo.bg} ${statusInfo.color}`}
                  >
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
                        {ticket.subject}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-black uppercase px-2 py-0 rounded-full border-0 ${priorityStyles[ticket.priority]}`}
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      <span>{ticket.id}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{ticket.type}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{ticket.date}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}
                    >
                      {ticket.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <Card className="border-primary/20 bg-primary/[0.02] shadow-sm">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-foreground mb-1">
              Knowledge Base
            </h3>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
              Find answers to common questions about payouts, shipping, and
              returns.
            </p>
            <Button
              variant="link"
              className="p-0 h-auto mt-3 text-xs font-bold text-primary"
            >
              Browse Tutorials →
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground mb-4 shadow-inner">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-foreground mb-1">
              Merchant Support
            </h3>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
              Need urgent help? Our merchant support team is available mon-sat,
              10am-7pm.
            </p>
            <Button
              variant="link"
              className="p-0 h-auto mt-3 text-xs font-bold text-primary"
            >
              Chat with us →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
