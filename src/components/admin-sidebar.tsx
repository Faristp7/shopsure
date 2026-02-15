'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar"
import {
    BarChart3,
    Users,
    ShoppingBag,
    Store,
    CreditCard,
    AlertTriangle,
    FileText,
    Settings,
    LogOut,
    Layers
} from "lucide-react"
import Link from "next/link";

// Admin menu items
const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: BarChart3,
    },
    {
        title: "Sellers",
        url: "/admin/sellers",
        icon: Store,
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: ShoppingBag,
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: FileText,
    },
    {
        title: "Payments",
        url: "/admin/payments",
        icon: CreditCard,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Categories",
        url: "/admin/categories",
        icon: Layers,
    },
    {
        title: "Disputes",
        url: "/admin/disputes",
        icon: AlertTriangle,
    },
    {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Audit Logs",
        url: "/admin/audit-logs",
        icon: FileText,
    },
]

export function AdminSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="border-b p-4">
                <h2 className="text-xl font-bold px-2">ShopSure Admin</h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/settings">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="text-destructive hover:text-destructive">
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
