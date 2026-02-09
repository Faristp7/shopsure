"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const notifications = [
    {
        id: 1,
        title: "New Order Received",
        description: "Order #VM-1234 from Alice Smith",
        time: "2 min ago",
        unread: true,
    },
    {
        id: 2,
        title: "Product Approved",
        description: "Wireless Headphones is now live",
        time: "1 hour ago",
        unread: true,
    },
    {
        id: 3,
        title: "System Update",
        description: "Maintenance scheduled for tonight",
        time: "3 hours ago",
        unread: false,
    },
    {
        id: 4,
        title: "New Seller Registration",
        description: "TechGiants Inc. applied to join",
        time: "5 hours ago",
        unread: false,
    },
]

export function Notifications() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <Badge variant="secondary" className="text-xs">2 New</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className="cursor-pointer flex flex-col items-start gap-1 p-3">
                            <div className="flex items-center justify-between w-full">
                                <span className={`font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                </span>
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {notification.description}
                            </p>
                        </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                    View All Notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
