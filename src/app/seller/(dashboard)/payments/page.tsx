"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  IndianRupee,
  Download,
  CalendarDays,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronRight,
  Search,
  ExternalLink,
  Shield,
  Building2,
  Eye,
  EyeOff,
  Copy,
  Pencil,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// --- Mock Data ---

const earningsChartData = [
  { period: "1 Feb", revenue: 8200, commission: 820, net: 7380 },
  { period: "5 Feb", revenue: 12400, commission: 1240, net: 11160 },
  { period: "9 Feb", revenue: 6800, commission: 680, net: 6120 },
  { period: "13 Feb", revenue: 15600, commission: 1560, net: 14040 },
  { period: "17 Feb", revenue: 9300, commission: 930, net: 8370 },
  { period: "21 Feb", revenue: 18900, commission: 1890, net: 17010 },
];

const payouts = [
  {
    id: "PO-2026-001",
    initiated: "18 Feb 2026",
    completed: "20 Feb 2026",
    gross: 25000,
    commission: 2500,
    net: 22500,
    status: "Paid" as const,
  },
  {
    id: "PO-2026-002",
    initiated: "11 Feb 2026",
    completed: "13 Feb 2026",
    gross: 18500,
    commission: 1850,
    net: 16650,
    status: "Paid" as const,
  },
  {
    id: "PO-2026-003",
    initiated: "22 Feb 2026",
    completed: "—",
    gross: 12300,
    commission: 1230,
    net: 11070,
    status: "Processing" as const,
  },
  {
    id: "PO-2026-004",
    initiated: "04 Feb 2026",
    completed: "06 Feb 2026",
    gross: 31200,
    commission: 3120,
    net: 28080,
    status: "Paid" as const,
  },
  {
    id: "PO-2026-005",
    initiated: "28 Jan 2026",
    completed: "—",
    gross: 5600,
    commission: 560,
    net: 5040,
    status: "Failed" as const,
  },
];

const transactions = [
  {
    orderId: "ORD-4521",
    buyer: "Ananya Singh",
    orderDate: "20 Feb 2026",
    deliveryDate: "22 Feb 2026",
    value: 3200,
    platformFee: 320,
    gatewayFee: 48,
    tax: 0,
    net: 2832,
    settlement: "Paid" as const,
    settlementDate: "22 Feb 2026",
  },
  {
    orderId: "ORD-4520",
    buyer: "Rahul Verma",
    orderDate: "19 Feb 2026",
    deliveryDate: "21 Feb 2026",
    value: 1850,
    platformFee: 185,
    gatewayFee: 28,
    tax: 0,
    net: 1637,
    settlement: "Paid" as const,
    settlementDate: "22 Feb 2026",
  },
  {
    orderId: "ORD-4519",
    buyer: "Meera Joshi",
    orderDate: "18 Feb 2026",
    deliveryDate: "—",
    value: 4500,
    platformFee: 450,
    gatewayFee: 68,
    tax: 0,
    net: 3982,
    settlement: "Pending" as const,
    settlementDate: "—",
  },
  {
    orderId: "ORD-4518",
    buyer: "Deepak Kumar",
    orderDate: "17 Feb 2026",
    deliveryDate: "19 Feb 2026",
    value: 2100,
    platformFee: 210,
    gatewayFee: 32,
    tax: 0,
    net: 1858,
    settlement: "Refunded" as const,
    settlementDate: "—",
  },
  {
    orderId: "ORD-4517",
    buyer: "Sanya Kapoor",
    orderDate: "16 Feb 2026",
    deliveryDate: "18 Feb 2026",
    value: 6700,
    platformFee: 670,
    gatewayFee: 101,
    tax: 0,
    net: 5929,
    settlement: "Paid" as const,
    settlementDate: "20 Feb 2026",
  },
];

const refunds = [
  {
    orderId: "ORD-4518",
    reason: "Buyer received wrong size",
    amount: 2100,
    status: "Refunded" as const,
  },
  {
    orderId: "ORD-4502",
    reason: "Item damaged in transit",
    amount: 1450,
    status: "Processing" as const,
  },
  {
    orderId: "ORD-4490",
    reason: "Chargeback by buyer bank",
    amount: 3200,
    status: "Disputed" as const,
  },
];

// --- Helpers ---

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const statusColor = (s: string) => {
  switch (s) {
    case "Paid":
      return "bg-success/10 text-success border-success/20";
    case "Completed":
      return "bg-success/10 text-success border-success/20";
    case "Processing":
      return "bg-warning/10 text-warning border-warning/20";
    case "Pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "Failed":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Refunded":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Disputed":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// --- Metric Card Sub-Component ---

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  tooltip: string;
  color: string;
  highlight?: boolean;
  isDate?: boolean;
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  tooltip,
  color,
  highlight,
  isDate,
}: MetricCardProps) => (
  <Card
    className={
      highlight ? "border-success/30 bg-success/5 shadow-sm" : "shadow-sm"
    }
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </div>
      <p
        className={`${isDate ? "text-lg" : "text-xl"} font-extrabold text-foreground leading-tight`}
      >
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
    </CardContent>
  </Card>
);

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [chartMetric, setChartMetric] = useState("all");
  const [chartGroup, setChartGroup] = useState("daily");
  const [txSearch, setTxSearch] = useState("");
  const [txFilter, setTxFilter] = useState("all");
  const [txPage, setTxPage] = useState(1);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [refundsOpen, setRefundsOpen] = useState(false);
  const [payoutDetailId, setPayoutDetailId] = useState<string | null>(null);

  const filteredTx = transactions.filter((tx) => {
    const matchSearch =
      tx.orderId.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.buyer.toLowerCase().includes(txSearch.toLowerCase());
    const matchFilter =
      txFilter === "all" || tx.settlement.toLowerCase() === txFilter;
    return matchSearch && matchFilter;
  });

  return (
    <TooltipProvider>
      <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Payments
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your earnings, commissions, and payouts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px] h-9 text-sm font-semibold">
                <CalendarDays className="h-4 w-4 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1.5 font-bold">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        {/* EARNINGS SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard
            icon={IndianRupee}
            label="Total Revenue"
            value={fmt(71200)}
            tooltip="Gross order value before any deductions"
            color="text-foreground"
          />
          <MetricCard
            icon={ArrowUpRight}
            label="Commission"
            value={fmt(7120)}
            tooltip="10% platform commission on delivered orders"
            color="text-destructive"
          />
          <MetricCard
            icon={TrendingUp}
            label="Net Earnings"
            value={fmt(64080)}
            tooltip="Revenue minus commission and fees"
            color="text-success"
            highlight
          />
          <MetricCard
            icon={Clock}
            label="Pending Payout"
            value={fmt(11070)}
            tooltip="Earnings not yet settled to your bank"
            color="text-warning"
          />
          <MetricCard
            icon={CheckCircle2}
            label="Paid Out"
            value={fmt(67230)}
            tooltip="Total amount transferred to your bank"
            color="text-success"
          />
          <MetricCard
            icon={CalendarDays}
            label="Next Payout"
            value="28 Feb"
            tooltip="Scheduled transfer date (T+7 after delivery)"
            color="text-primary"
            isDate
          />
        </div>

        {/* EARNINGS CHART */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base font-bold">
                Earnings Breakdown
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={chartMetric} onValueChange={setChartMetric}>
                  <SelectTrigger className="w-[130px] h-8 text-xs font-semibold bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Metrics</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                    <SelectItem value="net">Net Earnings</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={chartGroup} onValueChange={setChartGroup}>
                  <SelectTrigger className="w-[110px] h-8 text-xs font-semibold bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsChartData} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/40"
                    horizontal
                    vertical={false}
                  />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 13,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [fmt(value), ""]}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 11,
                      fontWeight: 600,
                      paddingTop: 20,
                    }}
                  />
                  {(chartMetric === "all" || chartMetric === "revenue") && (
                    <Bar
                      dataKey="revenue"
                      name="Revenue"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  )}
                  {(chartMetric === "all" || chartMetric === "commission") && (
                    <Bar
                      dataKey="commission"
                      name="Commission"
                      fill="hsl(var(--destructive)/0.8)"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  )}
                  {(chartMetric === "all" || chartMetric === "net") && (
                    <Bar
                      dataKey="net"
                      name="Net Earnings"
                      fill="hsl(var(--success))"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* PAYOUTS & TRANSACTIONS TABS */}
        <Tabs defaultValue="payouts" className="space-y-4">
          <TabsList className="bg-muted/40 p-1 rounded-xl">
            <TabsTrigger
              value="payouts"
              className="gap-1.5 font-bold px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Wallet className="h-4 w-4" /> Payouts
            </TabsTrigger>
            <TabsTrigger
              value="ledger"
              className="gap-1.5 font-bold px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <CreditCard className="h-4 w-4" /> Transactions
            </TabsTrigger>
          </TabsList>

          {/* PAYOUTS TABLE */}
          <TabsContent value="payouts" className="space-y-4">
            <Card className="shadow-sm border-border/60">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 border-b border-border/60">
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-[150px]">
                          Payout ID
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Initiated
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Completed
                        </TableHead>
                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Gross
                        </TableHead>
                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Commission
                        </TableHead>
                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Net Paid
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((p) => (
                        <TableRow
                          key={p.id}
                          className="hover:bg-muted/20 transition-colors border-b border-border/40 last:border-0 font-sans"
                        >
                          <TableCell className="font-bold text-foreground">
                            {p.id}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm font-medium">
                            {p.initiated}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm font-medium">
                            {p.completed}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {fmt(p.gross)}
                          </TableCell>
                          <TableCell className="text-right text-destructive text-sm font-bold">
                            -{fmt(p.commission)}
                          </TableCell>
                          <TableCell className="text-right font-extrabold text-success">
                            {fmt(p.net)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${statusColor(p.status)}`}
                            >
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs font-bold gap-1 hover:bg-muted/50"
                              onClick={() =>
                                setPayoutDetailId(
                                  payoutDetailId === p.id ? null : p.id,
                                )
                              }
                            >
                              {payoutDetailId === p.id ? "Hide" : "Details"}
                              <ChevronDown
                                className={`h-3 w-3 transition-transform duration-300 ${payoutDetailId === p.id ? "rotate-180" : ""}`}
                              />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Payout Detail Expansion */}
            {payoutDetailId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/20 bg-primary/[0.02] shadow-sm">
                  <CardHeader className="pb-3 px-6">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <ArrowDownRight className="h-4 w-4 text-primary" />
                      Payout {payoutDetailId} — Order Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30">
                            <TableHead className="font-bold text-[10px] uppercase">
                              Order ID
                            </TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase">
                              Order Value
                            </TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase">
                              Commission
                            </TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase">
                              Net
                            </TableHead>
                            <TableHead className="font-bold text-[10px] uppercase text-center">
                              Payment Method
                            </TableHead>
                            <TableHead className="font-bold text-[10px] uppercase">
                              Txn Ref
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-b border-border/40 font-sans">
                            <TableCell className="font-bold text-primary">
                              ORD-4521
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ₹3,200
                            </TableCell>
                            <TableCell className="text-right text-destructive font-bold">
                              -₹320
                            </TableCell>
                            <TableCell className="text-right font-extrabold text-success">
                              ₹2,880
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-bold text-center">
                              UPI
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-mono font-medium">
                              TXN89234AF
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-b border-border/40 font-sans">
                            <TableCell className="font-bold text-primary">
                              ORD-4520
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ₹1,850
                            </TableCell>
                            <TableCell className="text-right text-destructive font-bold">
                              -₹185
                            </TableCell>
                            <TableCell className="text-right font-extrabold text-success">
                              ₹1,665
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-bold text-center">
                              Card
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-mono font-medium">
                              TXN89235BG
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* TRANSACTIONS LEDGER */}
          <TabsContent value="ledger" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID or Buyer…"
                  className="pl-9 h-10 border-border/60 rounded-xl"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                />
              </div>
              <Select value={txFilter} onValueChange={setTxFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-10 border-border/60 rounded-xl font-semibold">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Settled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card className="shadow-sm border-border/60 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 border-b border-border/60">
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Order ID
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Buyer
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Date
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Delivery
                        </TableHead>
                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Value
                        </TableHead>
                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Fee
                        </TableHead>
                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Net
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTx.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-16 text-muted-foreground font-medium"
                          >
                            No transactions found for this search
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTx.map((tx) => (
                          <TableRow
                            key={tx.orderId}
                            className="hover:bg-muted/20 border-b border-border/40 font-sans"
                          >
                            <TableCell className="font-bold text-primary">
                              {tx.orderId}
                            </TableCell>
                            <TableCell className="font-semibold text-foreground text-sm">
                              {tx.buyer}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-medium">
                              {tx.orderDate}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-medium">
                              {tx.deliveryDate}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {fmt(tx.value)}
                            </TableCell>
                            <TableCell className="text-right text-destructive text-[11px] font-bold">
                              -{fmt(tx.platformFee + tx.gatewayFee)}
                            </TableCell>
                            <TableCell className="text-right font-extrabold text-success">
                              {fmt(tx.net)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-tighter ${statusColor(tx.settlement)}`}
                              >
                                {tx.settlement}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* BANK DETAILS & COMMISSION INFO */}
        <div className="grid lg:grid-cols-2 gap-6 pt-4">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3 border-b border-border/40 mb-4 px-6 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Settlement Account
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-bold gap-1 rounded-lg"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase font-extrabold tracking-widest mb-1.5 opacity-70">
                    Account Holder
                  </p>
                  <p className="font-bold text-foreground">Priya Sharma</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase font-extrabold tracking-widest mb-1.5 opacity-70">
                    Bank Name
                  </p>
                  <p className="font-bold text-foreground">
                    State Bank of India
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <p className="text-muted-foreground text-[10px] uppercase font-extrabold tracking-widest opacity-70">
                      Account Number
                    </p>
                    <button
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showAccountNumber ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <p className="font-bold text-foreground font-mono tracking-wider">
                    {showAccountNumber ? "9876543214567" : "•••• •••• 4567"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase font-extrabold tracking-widest mb-1.5 opacity-70">
                    IFSC Code
                  </p>
                  <p className="font-bold text-foreground font-mono tracking-widest">
                    SBIN0001234
                  </p>
                </div>
                <div className="col-span-2 p-3 bg-muted/40 rounded-xl flex items-center justify-between border border-border/40">
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase font-extrabold tracking-widest mb-0.5 opacity-70">
                      Active UPI ID
                    </p>
                    <p className="font-extrabold text-foreground tracking-tight">
                      priya@oksbi
                    </p>
                  </div>
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-primary border border-transparent hover:border-border shadow-sm">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.03] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Shield className="h-32 w-32" />
            </div>
            <CardHeader className="pb-3 px-6 pt-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-extrabold text-foreground">
                  How Payouts Work
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-muted-foreground/80">
                Full transparency on your business finances.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <div className="space-y-4 text-sm font-sans">
                {[
                  {
                    icon: TrendingUp,
                    label: "10% Flat Fee",
                    desc: "No hidden charges, all platform costs included.",
                  },
                  {
                    icon: Clock,
                    label: "T+7 Payouts",
                    desc: "Payments settled 7 days after customer delivery.",
                  },
                  {
                    icon: Wallet,
                    label: "Min. Payout ₹500",
                    desc: "Automatic transfer once threshold reached.",
                  },
                  {
                    icon: Info,
                    label: "GST Invoice",
                    desc: "Download tax invoice for all platform fees.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-extrabold text-foreground text-sm uppercase tracking-tight">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
