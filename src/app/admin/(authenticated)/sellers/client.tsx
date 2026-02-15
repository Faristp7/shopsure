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
import { useQuery } from "@tanstack/react-query"
import { adminSellerService } from "@/services/admin-seller"
import { SellerStatus } from "@/types/seller"
import { format } from "date-fns"

export default function SellersClient() {
    // Default to fetching ONBOARDING_INCOMPLETE as per user request, 
    // but we can potentially make this dynamic with URL search params later.
    // For now, I'll fetch ALL or just the requested status? 
    // The user said: "fileter will be status=ONBOARDING_INCOMPLETE and the status will change"
    // This implies we might want a tab or filter UI. 
    // For the initial implementation matching the request "fetch all the data also make sure api call is like refer the verification page",
    // and "if we are not pass status it will fetch all".
    // I will implement a basic hook that fetches based on a local state or just fetches default for now.
    // Let's verify what the User specifically asked: "fileter will be status=ONBOARDING_INCOMPLETE"
    // I will fetch with that status for now.

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin-sellers', SellerStatus.ONBOARDING_INCOMPLETE],
        queryFn: () => adminSellerService.getSellers({ status: SellerStatus.ONBOARDING_INCOMPLETE }),
    });

    const sellers = data?.items || [];

    if (isLoading) return <div>Loading...</div>;
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
                        {sellers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No sellers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sellers.map((seller) => (
                                <TableRow key={seller.id}>
                                    <TableCell className="font-medium">{seller.id.substring(0, 8)}...</TableCell>
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
                                    <TableCell>{format(new Date(seller.createdAt), 'yyyy-MM-dd')}</TableCell>
                                    <TableCell className="text-right">--</TableCell> {/* Revenue not in Seller interface yet */}
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
