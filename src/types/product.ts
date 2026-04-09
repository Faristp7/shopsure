import { Category } from './category';

// --- API payload types ---

export interface ProductImage {
  url: string;
  isCover: boolean;
}

export interface ProductVariant {
  type: string;
  value: string;
  stock: number;
  price: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductShipping {
  weight: number;
  length: number;
  width: number;
  height: number;
}

// --- Seller product listing types ---

export interface SellerProduct {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  brand: string;
  sku: string;
  price: string;
  originalPrice: string;
  gstRate: string;
  stock: number;
  tags: string[];
  images: (ProductImage & { sortOrder: number })[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  shipping: ProductShipping;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ListSellerProductsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListSellerProductsResponse {
  items: SellerProduct[];
  meta: ListSellerProductsMeta;
}

export interface ListSellerProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

// --- Admin product listing types ---

export type AdminProductModerationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'FLAGGED';

export interface AdminProduct extends SellerProduct {
  moderationStatus?: AdminProductModerationStatus;
  sellerName?: string;
  image?: string | null;
  status: 'ACTIVE' | 'DISABLED_BY_ADMIN' | 'DELETED' | 'OUT_OF_STOCK';
}

/** Display status for admin product list filter (All | Active | Disabled by Admin | Out of Stock) */
export type AdminProductListStatusFilter =
  | 'ALL'
  | 'ACTIVE'
  | 'DISABLED_BY_ADMIN'
  | 'OUT_OF_STOCK';

export interface ListAdminProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminProductModerationStatus | AdminProductListStatusFilter | string;
  categoryId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ListAdminProductsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListAdminProductsResponse {
  items: AdminProduct[];
  meta: ListAdminProductsMeta;
}

export interface CreateProductPayload {
  title: string;
  description: string;
  categoryId: string;
  // Brand is required in backend DTO
  brand: string;
  sku: string;
  tags: string[];
  sellingPrice: number;
  // Original price is required in backend DTO
  originalPrice: number;
  stock: number;
  images: ProductImage[];
  // Backend requires at least one variant
  variants: ProductVariant[];
  // Backend requires at least one attribute
  attributes: ProductAttribute[];
  shipping: ProductShipping;
}

// --- Form state types ---

export interface VariantFormRow {
  id: string;
  type: string;
  value: string;
  stock: string;
  price: string;
}

export interface AttributeFormRow {
  id: string;
  name: string;
  value: string;
}

export interface ImageFormItem {
  id: string;
  file?: File;
  url?: string;        // Set after upload
  preview: string;     // Local preview URL (blob URL or uploaded URL)
  isUploading?: boolean;
}

export interface ProductFormState {
  title: string;
  description: string;
  categoryId: string;
  categoryDisplayName: string;
  brand: string;
  sku: string;
  tags: string[];
  sellingPrice: string;
  originalPrice: string;
  stock: string;
  images: ImageFormItem[];
  hasVariants: boolean;
  variants: VariantFormRow[];
   attributes: AttributeFormRow[];
  shipping: {
    weight: string;
    length: string;
    width: string;
    height: string;
  };
}

export interface ProductFormErrors {
  title?: string;
  description?: string;
  categoryId?: string;
  brand?: string;
  sellingPrice?: string;
  originalPrice?: string;
  stock?: string;
  images?: string;
  sku?: string;
  tags?: string;
  attributes?: string;
  variants?: string;
  [key: string]: string | undefined;
}

// --- Buyer product detail type ---

export interface BuyerProductDetail {
  id: string;
  title: string;
  description: string | null;
  brand: string | null;
  sku: string;
  price: string;
  originalPrice: string | null;
  stock: number;
  tags: string[] | null;
  images: Array<{ url: string; isCover: boolean; sortOrder: number }> | null;
  variants: Array<{ type: string; value: string; stock: number; price: number }> | null;
  attributes: Array<{ name: string; value: string }> | null;
  averageRating: string | null;
  ratingCount: number;
  status: string;
  category: { id: string; name: string; slug: string } | null;
  seller: { id: string; name: string };
}

// --- Buyer product listing types ---

export interface BuyerProductImage {
  url: string;
  isCover: boolean;
  sortOrder: number;
}

export interface BuyerProduct {
  id: string;
  title: string;
  brand: string | null;
  price: string;
  originalPrice: string | null;
  averageRating: string | null;
  ratingCount: number;
  images: BuyerProductImage[] | null;
  status: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ListBuyerProductsQuery {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface ListBuyerProductsResponse {
  items: BuyerProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// --- Category tree ---

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}
