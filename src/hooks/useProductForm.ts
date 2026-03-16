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
  AttributeFormRow,
  SellerProduct,
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
  attributes: [{ id: '1', name: '', value: '' }],
  shipping: {
    weight: '',
    length: '',
    width: '',
    height: '',
  },
};

export function useProductForm(productId?: string) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(initialFormState);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justCreated, setJustCreated] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

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

  const initializeFromExisting = useCallback((product: SellerProduct) => {
    const hasRealVariants =
      Array.isArray(product.variants) &&
      product.variants.length > 0 &&
      !(product.variants.length === 1 &&
        product.variants[0].type === 'Default' &&
        product.variants[0].value === 'Default');

    const images: ImageFormItem[] =
      product.images?.map((img) => ({
        id: `img-${img.sortOrder}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: img.url,
        preview: img.url,
      })) ?? [];

    const variants: VariantFormRow[] =
      hasRealVariants && product.variants.length > 0
        ? product.variants.map((v, index) => ({
            id: `var-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type: v.type,
            value: v.value,
            stock: v.stock != null ? String(v.stock) : '',
            price: v.price != null ? String(v.price) : '',
          }))
        : initialFormState.variants;

    const attributes: AttributeFormRow[] =
      product.attributes && product.attributes.length > 0
        ? product.attributes.map((a, index) => ({
            id: `attr-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: a.name,
            value: a.value,
          }))
        : initialFormState.attributes;

    setForm({
      title: product.title ?? '',
      description: product.description ?? '',
      categoryId: product.categoryId,
      categoryDisplayName: product.category?.name ?? '',
      brand: product.brand ?? '',
      sku: product.sku ?? '',
      tags: product.tags ?? [],
      sellingPrice: product.price != null ? String(product.price) : '',
      originalPrice: product.originalPrice != null ? String(product.originalPrice) : '',
      stock: product.stock != null ? String(product.stock) : '',
      images,
      hasVariants: hasRealVariants,
      variants,
      attributes,
      shipping: {
        weight: product.shipping?.weight != null ? String(product.shipping.weight) : '',
        length: product.shipping?.length != null ? String(product.shipping.length) : '',
        width: product.shipping?.width != null ? String(product.shipping.width) : '',
        height: product.shipping?.height != null ? String(product.shipping.height) : '',
      },
    });
    setErrors({});
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

  // --- Attributes ---

  const updateAttribute = useCallback(
    (id: string, field: keyof AttributeFormRow, value: string) => {
      setForm((prev) => ({
        ...prev,
        attributes: prev.attributes.map((a) =>
          a.id === id ? { ...a, [field]: value } : a,
        ),
      }));
    },
    [],
  );

  const addAttribute = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        { id: Date.now().toString(), name: '', value: '' },
      ],
    }));
  }, []);

  const removeAttribute = useCallback((id: string) => {
    setForm((prev) => {
      if (prev.attributes.length <= 1) return prev;
      return {
        ...prev,
        attributes: prev.attributes.filter((a) => a.id !== id),
      };
    });
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
    if (!form.brand.trim()) errs.brand = 'Brand is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (!form.tags || form.tags.length === 0)
      errs.tags = 'Please add at least one tag';
    if (!form.sellingPrice || Number(form.sellingPrice) <= 0)
      errs.sellingPrice = 'Selling price must be greater than 0';
    if (!form.originalPrice || Number(form.originalPrice) <= 0) {
      errs.originalPrice = 'Original price is required';
    }
    if (
      form.originalPrice &&
      form.sellingPrice &&
      Number(form.originalPrice) < Number(form.sellingPrice)
    ) {
      errs.originalPrice =
        'Original price should be greater than or equal to selling price';
    }
    if (!form.stock || Number(form.stock) < 0) errs.stock = 'Stock quantity is required';
    if (form.images.length === 0) errs.images = 'At least one image is required';

    const filledAttributes = form.attributes.filter(
      (a) => a.name.trim() && a.value.trim(),
    );
    if (filledAttributes.length === 0) {
      errs.attributes = 'Please add at least one attribute';
    }

    if (form.hasVariants) {
      const filledVariants = form.variants.filter((v) => v.value.trim());
      if (filledVariants.length === 0) {
        errs.variants = 'Please add at least one variant';
      }
    }

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

      // 3. Build variants: use seller-defined variants or single default
      const variants =
        form.hasVariants && form.variants.length > 0
          ? form.variants
              .filter((v) => v.value.trim())
              .map((v) => ({
                type: v.type,
                value: v.value.trim(),
                stock: Number(v.stock) || 0,
                price: Number(v.price) || 0,
              }))
          : [
              {
                type: 'Default',
                value: 'Default',
                stock: Number(form.stock),
                price: Number(form.sellingPrice),
              },
            ];

      const payload: CreateProductPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        brand: form.brand.trim(),
        sku,
        tags: form.tags,
        sellingPrice: Number(form.sellingPrice),
        originalPrice: Number(form.originalPrice),
        stock: Number(form.stock),
        images: uploadedImages,
        variants,
        attributes: form.attributes
          .filter((a) => a.name.trim() && a.value.trim())
          .map((a) => ({
            name: a.name.trim(),
            value: a.value.trim(),
          })),
        shipping: {
          weight: Number(form.shipping.weight) || 0,
          length: Number(form.shipping.length) || 0,
          width: Number(form.shipping.width) || 0,
          height: Number(form.shipping.height) || 0,
        },
      };

      // 4. Create or update product
      if (productId) {
        await sellerProductService.updateProduct(productId, payload);
        setJustUpdated(true);
        setTimeout(() => {
          router.push('/seller/products');
        }, 1600);
        return;
      }
      await sellerProductService.createProduct(payload);
      setJustCreated(true);
      setTimeout(() => {
        router.push('/seller/products');
      }, 1600);
      return;
    } catch (error: any) {
      const fallback = productId ? 'Failed to update product' : 'Failed to create product';
      const message = error?.response?.data?.message || error?.message || fallback;
      toast.error(typeof message === 'string' ? message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validate, router, productId]);

  // --- Computed values ---

  const discount =
    form.sellingPrice && form.originalPrice && Number(form.originalPrice) > Number(form.sellingPrice)
      ? Math.round(((Number(form.originalPrice) - Number(form.sellingPrice)) / Number(form.originalPrice)) * 100)
      : null;

  return {
    form,
    errors,
    isSubmitting,
    justCreated,
    justUpdated,
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
    addAttribute,
    removeAttribute,
    updateAttribute,
    handleSubmit,
    initializeFromExisting,
  };
}
