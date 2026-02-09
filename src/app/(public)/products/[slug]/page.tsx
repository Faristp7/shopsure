export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return (
        <div className="container py-10">
            <h1 className="text-2xl font-bold">Product: {slug}</h1>
        </div>
    );
}
