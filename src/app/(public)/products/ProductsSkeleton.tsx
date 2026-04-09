export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/4 mt-2" />
      </div>
    </div>
  );
}

export function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ProductsPageSkeleton() {
  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 bg-muted rounded w-12 animate-pulse" />
        <span className="text-muted-foreground">/</span>
        <div className="h-4 bg-muted rounded w-24 animate-pulse" />
      </div>

      {/* Search bar */}
      <div className="h-11 bg-card rounded-xl shadow-card animate-pulse mb-6" />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="h-10 bg-card rounded-xl shadow-card w-20 animate-pulse" />
          <div className="h-10 bg-card rounded-xl shadow-card w-36 animate-pulse" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-card rounded-2xl shadow-card p-5 space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-16" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-xl" />
            ))}
            <div className="h-4 bg-muted rounded w-24 mt-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-xl" />
            ))}
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1">
          <ProductsGridSkeleton />
        </div>
      </div>
    </div>
  );
}
