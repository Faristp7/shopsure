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

export interface ProductShipping {
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface CreateProductPayload {
  title: string;
  description: string;
  categoryId: string;
  brand?: string;
  sku: string;
  tags: string[];
  sellingPrice: number;
  originalPrice?: number;
  stock: number;
  images: ProductImage[];
  variants?: ProductVariant[];
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
  sellingPrice?: string;
  stock?: string;
  images?: string;
  sku?: string;
  [key: string]: string | undefined;
}

// --- Category tree ---

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}
