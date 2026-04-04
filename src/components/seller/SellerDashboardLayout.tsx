"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  BarChart3,
  LifeBuoy,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  MoreHorizontal,
  User,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { authService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { sellerSettingsService } from "@/services/seller-settings.service";

const navItems = [
  {
    href: "/seller/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    end: true,
  },
  { href: "/seller/products", icon: Package, label: "Products" },
  { href: "/seller/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/seller/payments", icon: Wallet, label: "Payments" },
  { href: "/seller/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/seller/support", icon: LifeBuoy, label: "Support" },
  { href: "/seller/notifications", icon: Bell, label: "Notifications" },
  { href: "/seller/settings", icon: Settings, label: "Settings" },
];

// Primary bottom nav items (most used) — max 5 for thumb reach
const bottomNavPrimary = navItems.slice(0, 4); // Dashboard, Products, Orders, Payments
const bottomNavSecondary = navItems.slice(4); // Analytics, Support, Notifications, Settings

interface SellerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function SellerDashboardLayout({
  children,
}: SellerDashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ["seller-settings"],
    queryFn: sellerSettingsService.getSettings,
    staleTime: 5 * 60 * 1000,
  });

  const brandName = settingsData?.brand.brandName;
  const brandInitial = brandName?.[0]?.toUpperCase() ?? "S";

  const isActive = (href: string, end?: boolean) =>
    end ? pathname === href : pathname.startsWith(href);

  // Check if any secondary item is active
  const secondaryActive = bottomNavSecondary.some((item) =>
    isActive(item.href),
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Clear cookies
      document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      // Redirect to login
      router.push("/seller");
    }
  };


  // MOBILE LAYOUT
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">
        {/* Main content — no header on mobile */}
        <main className="flex-1 overflow-y-auto p-4 pb-24">{children}</main>

        {/* More menu overlay */}
        {moreMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/30"
            onClick={() => setMoreMenuOpen(false)}
          />
        )}

        {/* More menu popover */}
        {moreMenuOpen && (
          <div className="fixed bottom-[72px] right-2 left-2 z-50 bg-card border border-border rounded-xl shadow-lg p-2 animate-in slide-in-from-bottom-4 duration-200">
            <div className="grid grid-cols-4 gap-1">
              {bottomNavSecondary.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setMoreMenuOpen(false);
                  }}
                  className={`flex flex-col items-center gap-1 py-3 px-1 rounded-lg text-xs font-medium transition-colors ${isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-border mt-2 pt-2 flex gap-2">
              <button
                onClick={() => {
                  router.push("/seller/settings");
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Bottom navigation bar */}
        <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border safe-bottom">
          <div className="flex items-stretch justify-around h-16">
            {bottomNavPrimary.map((item) => {
              const active = isActive(item.href, item.end);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 gap-0.5 text-[10px] font-medium transition-colors relative ${active ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {/* More button */}
            <button
              onClick={() => setMoreMenuOpen((v) => !v)}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 text-[10px] font-medium transition-colors relative ${moreMenuOpen || secondaryActive
                  ? "text-primary"
                  : "text-muted-foreground"
                }`}
            >
              {(moreMenuOpen || secondaryActive) && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <MoreHorizontal className="h-5 w-5" />
              <span>More</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // DESKTOP LAYOUT
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-extrabold text-sm">
                S
              </span>
            </div>
            <span className="font-bold text-sidebar-primary-foreground text-lg">
              SellerHub
            </span>
          </div>
          <button
            className="lg:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.end);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                    ? "bg-sidebar-accent text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <button
            className="lg:hidden text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="text-sm font-semibold text-foreground">
              {brandName ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/seller/notifications")}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {brandInitial}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
