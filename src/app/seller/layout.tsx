import { Plus_Jakarta_Sans } from "next/font/google";
import "./index.css";

const fontSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`min-h-screen bg-background font-sans antialiased ${fontSans.variable}`}>
            {children}
        </div>
    );
}
