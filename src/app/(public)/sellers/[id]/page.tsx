export default async function SellerProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div className="container py-10">
            <h1 className="text-2xl font-bold">Seller Profile: {id}</h1>
        </div>
    );
}
