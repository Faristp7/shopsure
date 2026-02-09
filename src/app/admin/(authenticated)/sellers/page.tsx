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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, Ban, CheckCircle } from "lucide-react"

const sellers = [
    {
        id: "SEL-001",
        name: "TechWorld Inc.",
        email: "contact@techworld.com",
        status: "Active",
        joined: "2023-11-23",
        revenue: "$12,450.00"
    },
    {
        id: "SEL-002",
        name: "Fashion Hub",
        email: "sales@fashionhub.com",
        status: "Pending",
        joined: "2024-01-15",
        revenue: "$0.00"
    },
    {
        id: "SEL-003",
        name: "ElectroGadgets",
        email: "support@electrogadgets.com",
        status: "Suspended",
        joined: "2023-08-10",
        revenue: "$45,230.50"
    },
    {
        id: "SEL-004",
        name: "Home Decore",
        email: "hello@homedecore.com",
        status: "Active",
        joined: "2023-12-01",
        revenue: "$8,120.00"
    },
]

export default function AdminSellersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sellers</h2>
                    <p className="text-muted-foreground">Manage and monitor seller accounts.</p>
                </div>
                <Button>Export List</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Total Revenue</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sellers.map((seller) => (
                            <TableRow key={seller.id}>
                                <TableCell className="font-medium">{seller.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{seller.name}</span>
                                        <span className="text-xs text-muted-foreground">{seller.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            seller.status === "Active" ? "default" :
                                                seller.status === "Pending" ? "outline" : "destructive"
                                        }
                                    >
                                        {seller.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{seller.joined}</TableCell>
                                <TableCell className="text-right">{seller.revenue}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-green-600">
                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Ban className="mr-2 h-4 w-4" /> Suspend
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
