'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const transactions = [
    { id: "TXN-001", type: "Commission", amount: "$12.99", date: "2024-02-09", status: "Completed", user: "TechWorld Inc." },
    { id: "TXN-002", type: "Payout", amount: "$117.00", date: "2024-02-08", status: "Processing", user: "TechWorld Inc." },
    { id: "TXN-003", type: "Commission", amount: "$4.50", date: "2024-02-08", status: "Completed", user: "Fashion Hub" },
]

export default function AdminPaymentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Payments & Commission</h2>
                <p className="text-muted-foreground">Monitor platform revenue and seller payouts.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Commission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450.32</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$4,200.00</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                    <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions" className="mt-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((txn) => (
                                    <TableRow key={txn.id}>
                                        <TableCell className="font-medium">{txn.id}</TableCell>
                                        <TableCell>{txn.type}</TableCell>
                                        <TableCell className={txn.type === 'Payout' ? 'text-destructive' : 'text-green-600'}>
                                            {txn.type === 'Payout' ? '-' : '+'}{txn.amount}
                                        </TableCell>
                                        <TableCell>{txn.user}</TableCell>
                                        <TableCell>{txn.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{txn.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
                <TabsContent value="payouts">
                    <div className="flex h-32 items-center justify-center border border-dashed rounded-md text-muted-foreground">
                        No pending payout requests.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
