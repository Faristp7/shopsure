import { apiService } from './api';
import { Category, ListCategoriesResponse } from '@/types/category';
import { CategoryTreeNode } from '@/types/product';

/**
 * Build a hierarchical tree from a flat array of categories with parentId.
 */
export function buildCategoryTree(items: Category[]): CategoryTreeNode[] {
  const map = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  // First pass: create tree nodes
  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  // Second pass: wire parent → child relationships
  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export const categoryService = {
  /**
   * Fetch all categories (reuses admin endpoint, no new API)
   */
  getAllCategories: async (): Promise<ListCategoriesResponse> => {
    return apiService.get<ListCategoriesResponse>('v1/admin/categories?limit=500');
  },
};
