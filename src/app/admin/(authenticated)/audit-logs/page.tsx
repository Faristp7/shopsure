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

const logs = [
    { id: "LOG-1029", action: "User Suspended", actor: "Admin (Evan)", target: "Bob Jones", date: "2024-02-09 10:30 AM" },
    { id: "LOG-1028", action: "Product Approved", actor: "Admin (Evan)", target: "Wireless Headphones", date: "2024-02-09 09:15 AM" },
    { id: "LOG-1027", action: "Order Refunded", actor: "System", target: "ORD-7832", date: "2024-02-07 02:45 PM" },
    { id: "LOG-1026", action: "Seller Approved", actor: "Admin (Evan)", target: "Home Decore", date: "2024-02-06 11:20 AM" },
    { id: "LOG-1025", action: "Login Failed", actor: "Unknown IP", target: "System", date: "2024-02-05 04:00 AM" },
]

export default function AdminAuditLogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
                    <p className="text-muted-foreground">Track system activities and administrative actions.</p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Log ID</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Performed By</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Date & Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-mono text-xs">{log.id}</TableCell>
                                <TableCell className="font-medium">{log.action}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{log.actor}</Badge>
                                </TableCell>
                                <TableCell>{log.target}</TableCell>
                                <TableCell>{log.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
