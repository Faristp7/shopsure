import "./index.css";

export default function RootSellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`font-sans antialiased`}>
      {children}
    </div>
  );
}
