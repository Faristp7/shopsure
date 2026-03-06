import { ProductDetailsPage } from '@/components/public/product-details/ProductDetailsPage';

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // In a real application, you would use the slug to fetch product data here.
    // const { slug } = await params;

    return <ProductDetailsPage />;
}
