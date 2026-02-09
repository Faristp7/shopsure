'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Eye } from "lucide-react"

const orders = [
    {
        id: "ORD-7829",
        customer: "Alice Smith",
        seller: "TechWorld Inc.",
        date: "2024-02-09",
        total: "$129.99",
        status: "Processing",
        payment: "Paid",
    },
    {
        id: "ORD-7830",
        customer: "Bob Jones",
        seller: "Fashion Hub",
        date: "2024-02-08",
        total: "$240.50",
        status: "Shipped",
        payment: "Paid",
    },
    {
        id: "ORD-7831",
        customer: "Charlie Brown",
        seller: "TechWorld Inc.",
        date: "2024-02-08",
        total: "$45.00",
        status: "Delivered",
        payment: "Paid",
    },
    {
        id: "ORD-7832",
        customer: "Diana Prince",
        seller: "ElectroGadgets",
        date: "2024-02-07",
        total: "$890.00",
        status: "Cancelled",
        payment: "Refunded",
    },
]

export default function AdminOrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">Global order history and management.</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Input placeholder="Search orders..." className="md:w-[300px]" />
                <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Seller</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.seller}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.total}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={order.status === "Cancelled" ? "destructive" : "secondary"}
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{order.payment}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
