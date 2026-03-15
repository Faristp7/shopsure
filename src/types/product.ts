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

// --- Category tree ---

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}
