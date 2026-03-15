'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryService, buildCategoryTree } from '@/services/category.service';
import { CategoryTreeNode } from '@/types/product';
import { Category } from '@/types/category';
import { useMemo } from 'react';

export function useCategories() {
  const query = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => categoryService.getAllCategories(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const flatList: Category[] = query.data?.items ?? [];
  const tree: CategoryTreeNode[] = useMemo(
    () => (flatList.length > 0 ? buildCategoryTree(flatList) : []),
    [flatList],
  );

  return {
    tree,
    flatList,
    isLoading: query.isLoading,
    error: query.error,
  };
}
