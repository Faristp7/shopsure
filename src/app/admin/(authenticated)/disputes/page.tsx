'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const disputes = [
    { id: "DSP-5501", orderId: "ORD-7832", buyer: "Diana Prince", seller: "ElectroGadgets", reason: "Item damaged", status: "Open", date: "2024-02-08" },
    { id: "DSP-5502", orderId: "ORD-7801", buyer: "John Doe", seller: "Fashion Hub", reason: "Not as described", status: "Resolved", date: "2024-01-20" },
]

export default function AdminDisputesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Disputes</h2>
                    <p className="text-muted-foreground">Resolve conflicts between buyers and sellers.</p>
                </div>
            </div>

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
                        {disputes.map((dispute) => (
                            <TableRow key={dispute.id}>
                                <TableCell className="font-medium">{dispute.id}</TableCell>
                                <TableCell>{dispute.orderId}</TableCell>
                                <TableCell>{dispute.buyer}</TableCell>
                                <TableCell>{dispute.seller}</TableCell>
                                <TableCell>{dispute.reason}</TableCell>
                                <TableCell>{dispute.date}</TableCell>
                                <TableCell>
                                    <Badge variant={dispute.status === "Open" ? "destructive" : "secondary"}>
                                        {dispute.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
