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
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ShieldOff, ShieldCheck } from "lucide-react"

const users = [
    { id: "USR-001", name: "Alice Smith", email: "alice@example.com", role: "User", status: "Active", joined: "2023-10-12" },
    { id: "USR-002", name: "Bob Jones", email: "bob@example.com", role: "User", status: "Suspended", joined: "2024-01-05" },
    { id: "USR-003", name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Active", joined: "2023-09-22" },
    { id: "USR-004", name: "Diana Prince", email: "diana@example.com", role: "Seller", status: "Active", joined: "2023-11-30" },
    { id: "USR-005", name: "Evan Wright", email: "evan@example.com", role: "Admin", status: "Active", joined: "2023-05-15" },
]

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">Manage all user accounts and roles.</p>
                </div>
                <Button>Add User</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={user.status === "Active" ? "default" : "destructive"}
                                    >
                                        {user.status}
                                    </Badge>
                                </TableCell>
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
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            {user.status === 'Active' ? (
                                                <DropdownMenuItem className="text-destructive">
                                                    <ShieldOff className="mr-2 h-4 w-4" /> Suspend User
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem className="text-green-600">
                                                    <ShieldCheck className="mr-2 h-4 w-4" /> Activate User
                                                </DropdownMenuItem>
                                            )}
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
