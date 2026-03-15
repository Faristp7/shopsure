import { Category, ListCategoriesResponse } from '@/types/category';
import { CategoryTreeNode } from '@/types/product';
import { adminCategoryService } from './admin-category';

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
   * Fetch all active categories for seller flows.
   * Reuses the admin categories endpoint via adminCategoryService.
   */
  getAllCategories: async (): Promise<ListCategoriesResponse> => {
    return adminCategoryService.getCategories({
      // API enforces max limit of 100
      limit: 100,
      rootsOnly: false,
      isActive: true,
      sortBy: 'sortOrder',
      sortDirection: 'asc',
    });
  },
};
