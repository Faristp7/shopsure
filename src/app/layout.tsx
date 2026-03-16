import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { PWASetup } from "@/components/pwa-setup";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "shopsure",
  description: "Modern Admin UI with Next.js & Shadcn",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
        <Toaster richColors position="top-right" />
        <PWASetup />
      </body>
    </html>
  );
}
