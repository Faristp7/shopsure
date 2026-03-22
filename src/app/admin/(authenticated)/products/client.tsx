'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Search,
  RotateCcw,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { adminProductService } from '@/services/admin-product.service';
import { adminCategoryService } from '@/services/admin-category';
import { adminSellerService } from '@/services/admin-seller';
import { useDebounce } from '@/hooks/use-debounce';
import type {
  AdminProduct,
  AdminProductListStatusFilter,
} from '@/types/product';

const STATUS_FILTER_OPTIONS: { value: AdminProductListStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DISABLED_BY_ADMIN', label: 'Disabled by Admin' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

const PAGE_SIZE = 10;

type DisplayStatus = 'ACTIVE' | 'DISABLED_BY_ADMIN' | 'OUT_OF_STOCK';

function getDisplayStatus(product: AdminProduct): DisplayStatus {
  const stock = typeof product.stock === 'number' ? product.stock : parseInt(String(product.stock), 10) || 0;
  if (stock === 0) return 'OUT_OF_STOCK';
  const status = (product.status || '').toLowerCase();
  if (status === 'disabled' || product.moderationStatus === 'REJECTED') return 'DISABLED_BY_ADMIN';
  return 'ACTIVE';
}

function StatusBadge({ status }: { status: DisplayStatus }) {
  if (status === 'ACTIVE') {
    return (
      <Badge className="bg-green-600 hover:bg-green-600/90 text-white border-0">
        Active
      </Badge>
    );
  }
  if (status === 'DISABLED_BY_ADMIN') {
    return (
      <Badge variant="destructive" className="border-0">
        Disabled
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0">
      Out of stock
    </Badge>
  );
}

function ProductViewModal({
  product,
  open,
  onOpenChange,
}: {
  product: AdminProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!product) return null;
  const coverImage = product.images?.find((img) => img.isCover) ?? product.images?.[0];
  const displayStatus = getDisplayStatus(product);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product details</DialogTitle>
          <DialogDescription>{product.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {coverImage?.url && (
            <div className="aspect-video w-full rounded-md overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage.url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">SKU / ID</span>
            <span>{product.sku || product.id}</span>
            <span className="text-muted-foreground">Seller</span>
            <span>{product.sellerName ?? product.sellerId ?? '—'}</span>
            <span className="text-muted-foreground">Category</span>
            <span>{product.category?.name ?? '—'}</span>
            <span className="text-muted-foreground">Price</span>
            <span>{product.price ? `₹${product.price}` : '—'}</span>
            <span className="text-muted-foreground">Stock</span>
            <span>{product.stock ?? '—'}</span>
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={displayStatus} />
            <span className="text-muted-foreground">Created</span>
            <span>{product.createdAt ? format(new Date(product.createdAt), 'dd MMM yyyy') : '—'}</span>
          </div>
          {product.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm line-clamp-4">{product.description}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProductsClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdminProductListStatusFilter>('ALL');
  const [categoryId, setCategoryId] = useState<string>('ALL');
  const [sellerId, setSellerId] = useState<string>('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [productToDisable, setProductToDisable] = useState<AdminProduct | null>(null);
  const [viewProduct, setViewProduct] = useState<AdminProduct | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  const queryParams = useMemo(() => {
    const params: Parameters<typeof adminProductService.listProducts>[0] = {
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
    };
    if (statusFilter !== 'ALL') params.status = statusFilter;
    if (categoryId && categoryId !== 'ALL') params.categoryId = categoryId;
    if (sellerId && sellerId !== 'ALL') params.sellerId = sellerId;
    const min = minPrice.trim() ? parseFloat(minPrice) : undefined;
    const max = maxPrice.trim() ? parseFloat(maxPrice) : undefined;
    if (min != null && !Number.isNaN(min)) params.minPrice = min;
    if (max != null && !Number.isNaN(max)) params.maxPrice = max;
    return params;
  }, [page, debouncedSearch, statusFilter, categoryId, sellerId, minPrice, maxPrice]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-products', queryParams],
    queryFn: () => adminProductService.listProducts(queryParams),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: () => adminCategoryService.getCategories({ isActive: true, limit: 10 }),
  });

  const { data: sellersData } = useQuery({
    queryKey: ['admin-sellers-list'],
    queryFn: () => adminSellerService.getSellers({ limit: 10 }),
  });

  const disableMutation = useMutation({
    mutationFn: (id: string) => adminProductService.disableProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setProductToDisable(null);
      setSelectedIds((prev) => new Set(prev));
      toast.success('Product disabled');
    },
    onError: () => toast.error('Failed to disable product'),
  });

  const enableMutation = useMutation({
    mutationFn: (id: string) => adminProductService.enableProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSelectedIds((prev) => new Set(prev));
      toast.success('Product enabled');
    },
    onError: () => toast.error('Failed to enable product'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSelectedIds((prev) => new Set(prev));
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const items: AdminProduct[] = data?.items ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const categories = categoriesData?.items ?? [];
  const sellers = sellersData?.items ?? [];

  const resetFilters = () => {
    setSearchInput('');
    setStatusFilter('ALL');
    setCategoryId('ALL');
    setSellerId('ALL');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setSelectedIds(new Set());
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(items.map((p) => p.id)));
    else setSelectedIds(new Set());
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0;

  const handleBulkDisable = () => {
    selectedIds.forEach((id) => disableMutation.mutate(id));
    setSelectedIds(new Set());
  };

  const handleBulkEnable = () => {
    selectedIds.forEach((id) => enableMutation.mutate(id));
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selectedIds.size} product(s)? This cannot be undone.`)) return;
    selectedIds.forEach((id) => deleteMutation.mutate(id));
    setSelectedIds(new Set());
  };

  const handleView = (product: AdminProduct) => setViewProduct(product);
  const handleEdit = (product: AdminProduct) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const isBusy = disableMutation.isPending || enableMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">Manage all seller products</p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or seller..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdminProductListStatusFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sellerId} onValueChange={setSellerId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All sellers</SelectItem>
            {sellers.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-28"
            min={0}
            step={0.01}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-28"
            min={0}
            step={0.01}
          />
        </div>
        <Button variant="outline" size="icon" onClick={resetFilters} title="Reset filters">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Bulk actions */}
      {someSelected && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDisable}
            disabled={isBusy}
          >
            Disable selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkEnable}
            disabled={isBusy}
          >
            Enable selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleBulkDelete}
            disabled={isBusy}
          >
            Delete selected
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU / Product ID</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
              {!isLoading && isError && (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center">
                    <AlertCircle className="h-10 w-10 mx-auto text-destructive mb-2" />
                    <p className="text-destructive">
                      {error instanceof Error ? error.message : 'Failed to load products'}
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="h-48 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground font-medium">No products found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting filters or search terms
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                !isError &&
                items.map((product) => {
                  const displayStatus = getDisplayStatus(product);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={(checked) => toggleSelectOne(product.id, !!checked)}
                          aria-label={`Select ${product.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                            {product?.image? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product?.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                                —
                              </div>
                            )}
                          </div>
                          <span className="font-medium truncate max-w-[180px]" title={product.title}>
                            {product.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.sku || product.id}
                      </TableCell>
                      <TableCell>{product.sellerName ?? product.sellerId ?? '—'}</TableCell>
                      <TableCell>{product.category?.name ?? '—'}</TableCell>
                      <TableCell>{product.price ? `₹${product.price}` : '—'}</TableCell>
                      <TableCell>{product.stock ?? '—'}</TableCell>
                      <TableCell>
                        <StatusBadge status={displayStatus} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.createdAt
                          ? format(new Date(product.createdAt), 'dd MMM yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(product)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View product details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {displayStatus === 'DISABLED_BY_ADMIN' ? (
                              <DropdownMenuItem
                                onClick={() => enableMutation.mutate(product.id)}
                                disabled={isBusy}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Enable product
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => setProductToDisable(product)}
                                disabled={isBusy || displayStatus === 'OUT_OF_STOCK'}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Disable product
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                if (confirm(`Delete "${product.title}"? This cannot be undone.`)) {
                                  deleteMutation.mutate(product.id);
                                }
                              }}
                              disabled={isBusy}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Disable confirmation modal */}
      <Dialog open={!!productToDisable} onOpenChange={(open) => !open && setProductToDisable(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to disable this product? Buyers will not be able to see it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDisable(null)} disabled={disableMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (productToDisable) {
                  disableMutation.mutate(productToDisable.id);
                }
              }}
              disabled={disableMutation.isPending}
            >
              {disableMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                'Confirm Disable'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductViewModal
        product={viewProduct}
        open={!!viewProduct}
        onOpenChange={(open) => !open && setViewProduct(null)}
      />
    </div>
  );
}
