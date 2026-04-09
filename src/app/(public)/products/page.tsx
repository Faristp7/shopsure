import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { buyerProductService } from "@/services/buyer-product.service";
import { buyerCategoryService } from "@/services/buyer-category.service";
import ProductsClient from "./ProductsClient";

interface Props {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [
        "buyer-products",
        { search: params.search, categoryId: params.categoryId, page },
      ],
      queryFn: () =>
        buyerProductService.listProducts({
          search: params.search,
          categoryId: params.categoryId,
          page,
          limit: 20,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["buyer-categories"],
      queryFn: () => buyerCategoryService.getCategories({ limit: 100 }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsClient
        initialSearch={params.search ?? ""}
        initialCategoryId={params.categoryId ?? null}
        initialPage={page}
      />
    </HydrationBoundary>
  );
}
