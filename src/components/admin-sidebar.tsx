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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  Layers,
  LineChart,
  Megaphone,
  Tag,
  Building2,
  ChevronRight,
  LayoutGrid,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { authService } from "@/services/auth.service"
import { cn } from "@/lib/utils"

const managementItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: BarChart3 },
  { title: "Sellers", url: "/admin/sellers", icon: Store },
  { title: "Products", url: "/admin/products", icon: ShoppingBag },
  { title: "Orders", url: "/admin/orders", icon: FileText },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Categories", url: "/admin/categories", icon: Layers },
  { title: "Disputes", url: "/admin/disputes", icon: AlertTriangle },
  { title: "Analytics", url: "/admin/analytics", icon: LineChart },
  { title: "Audit Logs", url: "/admin/audit-logs", icon: FileText },
]

function NavCollapsible({
  title,
  icon: Icon,
  basePath,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  basePath: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const active = pathname.startsWith(basePath)
  const [open, setOpen] = useState(active)

  useEffect(() => {
    setOpen(active)
  }, [active])

  return (
    <SidebarMenuItem>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible w-full"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            isActive={active}
            className="w-full justify-between [&[data-state=open]>svg:last-child]:rotate-90"
          >
            <span className="flex items-center gap-2 truncate">
              <Icon className="shrink-0" />
              <span className="truncate">{title}</span>
            </span>
            <ChevronRight className="ml-auto shrink-0 transition-transform duration-200" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>{children}</SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      document.cookie =
        "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      document.cookie =
        "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      router.push("/admin/auth")
    }
  }

  const linkActive = (url: string) => pathname === url

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
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={linkActive(item.url)}
                    tooltip={item.title}
                  >
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

        <SidebarGroup>
          <SidebarGroupLabel>Marketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavCollapsible
                title="Promotions"
                icon={Megaphone}
                basePath="/admin/promotions"
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/promotions/banners")}
                  >
                    <Link href="/admin/promotions/banners">Banners</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/promotions/campaigns")}
                  >
                    <Link href="/admin/promotions/campaigns">Campaigns</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/promotions/coupons")}
                  >
                    <Link href="/admin/promotions/coupons">Coupons</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </NavCollapsible>

              <NavCollapsible title="Deals" icon={Tag} basePath="/admin/deals">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/deals/flash")}
                  >
                    <Link href="/admin/deals/flash">Flash deals</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/deals/scheduled")}
                  >
                    <Link href="/admin/deals/scheduled">Scheduled deals</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </NavCollapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Merchandising</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavCollapsible
                title="Content control"
                icon={LayoutGrid}
                basePath="/admin/content"
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/content/featured")}
                  >
                    <Link href="/admin/content/featured">Featured products</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/content/trending")}
                  >
                    <Link href="/admin/content/trending">Trending products</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </NavCollapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={linkActive("/admin/brands")}
                  tooltip="Brands"
                >
                  <Link href="/admin/brands">
                    <Building2 />
                    <span>Brands</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavCollapsible
                title="Site settings"
                icon={Settings}
                basePath="/admin/settings"
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/settings/general")}
                  >
                    <Link href="/admin/settings/general">General</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/settings/payment")}
                  >
                    <Link href="/admin/settings/payment">Payment config</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/settings/commission")}
                  >
                    <Link href="/admin/settings/commission">Commission %</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkActive("/admin/settings/features")}
                  >
                    <Link href="/admin/settings/features">Feature toggles</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </NavCollapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "text-destructive hover:text-destructive w-full justify-start cursor-pointer"
              )}
              onClick={handleLogout}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
