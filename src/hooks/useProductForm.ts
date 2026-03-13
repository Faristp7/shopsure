'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { mediaService } from '@/services/media.service';
import { sellerProductService } from '@/services/seller-product.service';
import {
  ProductFormState,
  ProductFormErrors,
  CreateProductPayload,
  ImageFormItem,
  VariantFormRow,
} from '@/types/product';

const initialFormState: ProductFormState = {
  title: '',
  description: '',
  categoryId: '',
  categoryDisplayName: '',
  brand: '',
  sku: '',
  tags: [],
  sellingPrice: '',
  originalPrice: '',
  stock: '',
  images: [],
  hasVariants: false,
  variants: [{ id: '1', type: 'Size', value: '', stock: '', price: '' }],
  shipping: {
    weight: '',
    length: '',
    width: '',
    height: '',
  },
};

export function useProductForm() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(initialFormState);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Field setters ---

  const setField = useCallback(<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    setErrors((prev) => {
      if (prev[key as string]) {
        const next = { ...prev };
        delete next[key as string];
        return next;
      }
      return prev;
    });
  }, []);

  const setShippingField = useCallback((key: keyof ProductFormState['shipping'], value: string) => {
    setForm((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [key]: value },
    }));
  }, []);

  // --- Images ---

  const addImages = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setForm((prev) => {
      const remaining = 6 - prev.images.length;
      const newItems: ImageFormItem[] = fileArray.slice(0, remaining).map((file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: URL.createObjectURL(file),
      }));
      return { ...prev, images: [...prev.images, ...newItems] };
    });
    setErrors((prev) => {
      if (prev.images) {
        const next = { ...prev };
        delete next.images;
        return next;
      }
      return prev;
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setForm((prev) => {
      const target = prev.images.find((img) => img.id === id);
      if (target?.preview && target.file) {
        URL.revokeObjectURL(target.preview);
      }
      return { ...prev, images: prev.images.filter((img) => img.id !== id) };
    });
  }, []);

  // --- Tags ---

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    setForm((prev) => {
      if (prev.tags.includes(trimmed)) return prev;
      return { ...prev, tags: [...prev.tags, trimmed] };
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  // --- Variants ---

  const updateVariant = useCallback((id: string, field: keyof VariantFormRow, value: string) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    }));
  }, []);

  const addVariant = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { id: Date.now().toString(), type: 'Size', value: '', stock: '', price: '' },
      ],
    }));
  }, []);

  const removeVariant = useCallback((id: string) => {
    setForm((prev) => {
      if (prev.variants.length <= 1) return prev;
      return { ...prev, variants: prev.variants.filter((v) => v.id !== id) };
    });
  }, []);

  // --- Validation ---

  const validate = useCallback((): ProductFormErrors => {
    const errs: ProductFormErrors = {};

    if (!form.title.trim()) errs.title = 'Product title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.categoryId) errs.categoryId = 'Please select a category';
    if (!form.sellingPrice || Number(form.sellingPrice) <= 0)
      errs.sellingPrice = 'Selling price must be greater than 0';
    if (!form.stock || Number(form.stock) < 0) errs.stock = 'Stock quantity is required';
    if (form.images.length === 0) errs.images = 'At least one image is required';

    return errs;
  }, [form]);

  // --- Submit ---

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before publishing');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload images that haven't been uploaded yet
      const uploadedImages = await Promise.all(
        form.images.map(async (img, index) => {
          if (img.url) {
            // Already uploaded
            return { url: img.url, isCover: index === 0 };
          }
          if (img.file) {
            const result = await mediaService.uploadProductImage(img.file);
            return { url: result.url, isCover: index === 0 };
          }
          throw new Error('Image has no file or URL');
        }),
      );

      // 2. Auto-generate SKU if empty
      const sku = form.sku.trim() || `SKU-${Date.now()}`;

      // 3. Build payload
      const payload: CreateProductPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        sku,
        tags: form.tags,
        sellingPrice: Number(form.sellingPrice),
        stock: Number(form.stock),
        images: uploadedImages,
        shipping: {
          weight: Number(form.shipping.weight) || 0,
          length: Number(form.shipping.length) || 0,
          width: Number(form.shipping.width) || 0,
          height: Number(form.shipping.height) || 0,
        },
      };

      if (form.brand.trim()) {
        payload.brand = form.brand.trim();
      }

      if (form.originalPrice && Number(form.originalPrice) > 0) {
        payload.originalPrice = Number(form.originalPrice);
      }

      if (form.hasVariants && form.variants.length > 0) {
        const validVariants = form.variants.filter((v) => v.value.trim());
        if (validVariants.length > 0) {
          payload.variants = validVariants.map((v) => ({
            type: v.type,
            value: v.value.trim(),
            stock: Number(v.stock) || 0,
            price: Number(v.price) || 0,
          }));
        }
      }

      // 4. Create product
      await sellerProductService.createProduct(payload);

      toast.success('Product published successfully!');
      router.push('/seller/products');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create product';
      toast.error(typeof message === 'string' ? message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validate, router]);

  // --- Computed values ---

  const discount =
    form.sellingPrice && form.originalPrice && Number(form.originalPrice) > Number(form.sellingPrice)
      ? Math.round(((Number(form.originalPrice) - Number(form.sellingPrice)) / Number(form.originalPrice)) * 100)
      : null;

  return {
    form,
    errors,
    isSubmitting,
    discount,
    setField,
    setShippingField,
    addImages,
    removeImage,
    addTag,
    removeTag,
    addVariant,
    removeVariant,
    updateVariant,
    handleSubmit,
  };
}
