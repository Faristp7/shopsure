import SellerDashboardLayout from "@/components/seller/SellerDashboardLayout";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SellerDashboardLayout>{children}</SellerDashboardLayout>
    </div>
  );
}
