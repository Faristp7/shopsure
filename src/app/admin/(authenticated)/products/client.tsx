'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { adminProductService } from '@/services/admin-product.service';
import { sellerProductService } from '@/services/seller-product.service';
import type { AdminProduct, AdminProductModerationStatus, SellerProduct } from '@/types/product';

const statusToTab: Record<string, AdminProductModerationStatus | undefined> = {
  pending: 'PENDING',
  flagged: 'FLAGGED',
  all: undefined,
};

function ProductCard({
  product,
  onApprove,
  onReject,
  isActionLoading,
}: {
  product: SellerProduct;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isActionLoading: boolean;
}) {
  const coverImage =
    product.images?.find((img) => img.isCover) ?? product.images?.[0];
  const categoryName = product.category?.name ?? 'Uncategorized';
  const sellerName = product.sellerId ?? 'Unknown seller';
  const price = product.price ? `₹${product.price}` : '—';

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-muted relative">
        {coverImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage.url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
            Product Image
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <Badge variant="outline">{categoryName}</Badge>
          <span className="font-bold">{price}</span>
        </div>
        <CardTitle className="text-lg mt-2">{product.title}</CardTitle>
        <p className="text-sm text-muted-foreground">by {sellerName}</p>
      </CardHeader>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => onApprove(product.id)}
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Approve
        </Button>
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onReject(product.id)}
          disabled={isActionLoading}
        >
          <X className="mr-2 h-4 w-4" /> Reject
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function AdminProductsClient() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'flagged' | 'all'>('pending');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const status = statusToTab[activeTab];

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-products', { status, page: 1, limit: 50 }],
    queryFn: () =>
      sellerProductService.listProducts({
        page: 1,
        limit: 50,
        ...(status ? { status } : {}),
      }),
  });

  const { data: pendingData } = useQuery({
    queryKey: ['admin-products', { status: 'PENDING', page: 1, limit: 1 }],
    queryFn: () =>
      sellerProductService.listProducts({
        page: 1,
        limit: 1,
        status: 'PENDING',
      }),
  });

  const items: SellerProduct[] = data?.items ?? [];
  const pendingCount = pendingData?.meta?.total ?? 0;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
  };

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await adminProductService.approveProduct(id);
      toast.success('Product approved');
      invalidate();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(typeof message === 'string' ? message : 'Failed to approve product');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      await adminProductService.rejectProduct(id);
      toast.success('Product rejected');
      invalidate();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(typeof message === 'string' ? message : 'Failed to reject product');
    } finally {
      setActionLoadingId(null);
    }
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? 'Failed to load products. Please try again.'
        : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Moderation</h2>
          <p className="text-muted-foreground">
            Review and approve new product listings.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pending' | 'flagged' | 'all')} className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="flagged">Flagged Items</TabsTrigger>
          <TabsTrigger value="all">All Products</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-video w-full bg-muted" />
                  <CardHeader className="p-4 space-y-2">
                    <div className="h-5 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 gap-2">
                    <div className="h-9 bg-muted rounded w-full" />
                    <div className="h-9 bg-muted rounded w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && errorMessage && (
            <div className="flex flex-col items-center justify-center h-64 text-destructive border rounded-lg border-dashed">
              <AlertCircle className="h-10 w-10 mb-4" />
              <p>{errorMessage}</p>
            </div>
          )}
          {!isLoading && !errorMessage && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-lg border-dashed">
              <AlertCircle className="h-10 w-10 mb-4" />
              <p>No products pending review.</p>
            </div>
          )}
          {!isLoading && !errorMessage && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isActionLoading={actionLoadingId === product.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="flagged" className="mt-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-lg border-dashed">
              <Loader2 className="h-10 w-10 mb-4 animate-spin" />
              <p>Loading...</p>
            </div>
          )}
          {!isLoading && errorMessage && (
            <div className="flex flex-col items-center justify-center h-64 text-destructive border rounded-lg border-dashed">
              <AlertCircle className="h-10 w-10 mb-4" />
              <p>{errorMessage}</p>
            </div>
          )}
          {!isLoading && !errorMessage && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-lg border-dashed">
              <AlertCircle className="h-10 w-10 mb-4" />
              <p>No flagged items at the moment.</p>
            </div>
          )}
          {!isLoading && !errorMessage && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isActionLoading={actionLoadingId === product.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-video w-full bg-muted" />
                  <CardHeader className="p-4 space-y-2">
                    <div className="h-5 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 gap-2">
                    <div className="h-9 bg-muted rounded w-full" />
                    <div className="h-9 bg-muted rounded w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && errorMessage && (
            <div className="flex flex-col items-center justify-center h-64 text-destructive border rounded-lg border-dashed">
              <AlertCircle className="h-10 w-10 mb-4" />
              <p>{errorMessage}</p>
            </div>
          )}
          {!isLoading && !errorMessage && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-lg border-dashed">
              <AlertCircle className="h-10 w-10 mb-4" />
              <p>No products found.</p>
            </div>
          )}
          {!isLoading && !errorMessage && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isActionLoading={actionLoadingId === product.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
