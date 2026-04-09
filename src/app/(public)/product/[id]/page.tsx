import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { buyerProductService } from "@/services/buyer-product.service";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // Fetch the product — if not found the service will throw a 404
  let product;
  try {
    product = await queryClient.fetchQuery({
      queryKey: ["buyer-product", id],
      queryFn: () => buyerProductService.getProductById(id),
    });
  } catch {
    notFound();
  }

  // Fetch related products from the same category (best-effort)
  const relatedProducts = await queryClient
    .fetchQuery({
      queryKey: ["buyer-products", { categoryId: product.category?.id, page: 1 }],
      queryFn: () =>
        buyerProductService.listProducts({
          categoryId: product.category?.id,
          limit: 5,
          page: 1,
        }),
    })
    .then((res) => res.items.filter((p) => p.id !== id))
    .catch(() => []);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </HydrationBoundary>
  );
}
