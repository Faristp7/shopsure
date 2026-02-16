'use client';

import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"

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
import { useQuery } from "@tanstack/react-query"
import { adminSellerService } from "@/services/admin-seller"
import { SellerStatus } from "@/types/seller"
import { format } from "date-fns"

export default function SellersClient() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<SellerStatus | 'ALL'>(SellerStatus.ONBOARDING_INCOMPLETE);
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin-sellers', status, debouncedSearch],
        queryFn: () => adminSellerService.getSellers({
            status: status === 'ALL' ? undefined : status,
            search: debouncedSearch || undefined
        }),
    });

    const sellers = data?.items || [];

    if (isError) return <div>Error loading sellers.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sellers</h2>
                    <p className="text-muted-foreground">Manage and monitor seller accounts.</p>
                </div>
                <Button>Export List</Button>
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    placeholder="Search sellers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={status} onValueChange={(val) => setStatus(val as SellerStatus | 'ALL')}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value={SellerStatus.PENDING_EMAIL_VERIFICATION}>Pending Email</SelectItem>
                        <SelectItem value={SellerStatus.ONBOARDING_INCOMPLETE}>Onboarding Incomplete</SelectItem>
                        <SelectItem value={SellerStatus.PENDING_ADMIN_APPROVAL}>Pending Approval</SelectItem>
                        <SelectItem value={SellerStatus.APPROVED}>Approved</SelectItem>
                        <SelectItem value={SellerStatus.REJECTED}>Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="flex flex-col space-y-2">
                                            <Skeleton className="h-4 w-[120px]" />
                                            <Skeleton className="h-3 w-[150px]" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-5 w-[100px] rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : sellers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No sellers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sellers.map((seller) => (
                                <TableRow key={seller.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{seller.name}</span>
                                            <span className="text-xs text-muted-foreground">{seller.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                seller.status === SellerStatus.APPROVED ? "default" :
                                                    seller.status === SellerStatus.PENDING_ADMIN_APPROVAL ? "outline" :
                                                        seller.status === SellerStatus.ONBOARDING_INCOMPLETE ? "outline" : "destructive"
                                            }
                                        >
                                            {seller.status.replace(/_/g, ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(seller.createdAt), 'dd MMM yyyy')}</TableCell>
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
