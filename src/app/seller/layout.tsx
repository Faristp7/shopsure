import { Plus_Jakarta_Sans } from "next/font/google";
import "./index.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootSellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`font-sans antialiased ${fontSans.variable}`}>
      {children}
    </div>
  );
}
