export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b">
                <div className="container flex h-16 items-center px-4">
                    <h1 className="text-xl font-bold">ShopSure</h1>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
                <div className="container px-4 text-center text-sm text-muted-foreground">
                    © 2024 ShopSure. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
