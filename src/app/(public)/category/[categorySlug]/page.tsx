import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { buyerCategoryService } from "@/services/buyer-category.service";
import { buyerProductService } from "@/services/buyer-product.service";
import CategoryClient from "./CategoryClient";

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams?: Promise<{ search?: string; page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const search = sParams.search ?? "";
  const page = sParams.page ? parseInt(sParams.page, 10) : 1;

  const queryClient = getQueryClient();

  let categoriesData;
  try {
    categoriesData = await queryClient.fetchQuery({
      queryKey: ["buyer-categories"],
      queryFn: () => buyerCategoryService.getCategories({ limit: 100 }),
    });
  } catch (error) {
    console.error("Failed to fetch buyer categories:", error);
    notFound();
  }

  const category = categoriesData?.items?.find(
    (c) => c.slug?.toLowerCase() === categorySlug.toLowerCase()
  );

  if (!category) {
    notFound();
  }

  // Prefetch products for the specific category
  try {
    await queryClient.prefetchQuery({
      queryKey: [
        "buyer-products",
        { search, categoryId: category.id, page },
      ],
      queryFn: () =>
        buyerProductService.listProducts({
          search: search || undefined,
          categoryId: category.id,
          page,
          limit: 20,
        }),
    });
  } catch (error) {
    console.error(`Failed to prefetch products for category ${category.name}:`, error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryClient
        categorySlug={categorySlug}
        category={category}
        initialSearch={search}
        initialPage={page}
      />
    </HydrationBoundary>
  );
}
