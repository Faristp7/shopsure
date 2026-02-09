import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Notifications } from "@/components/notifications"

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto bg-muted/5">
                    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
                        <SidebarTrigger />
                        <div className="flex-1" />
                        <Notifications />
                        <ModeToggle />
                    </header>
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
