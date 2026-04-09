export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 animate-pulse">
      {/* Breadcrumb */}
      <div className="py-4 container">
        <div className="h-4 bg-muted rounded w-40" />
      </div>

      <main className="container">
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Gallery skeleton */}
          <div className="flex flex-col gap-4">
            <div className="bg-muted rounded-2xl aspect-[4/5]" />
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-24 h-24 flex-shrink-0 bg-muted rounded-xl" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="flex flex-col gap-5">
            <div className="h-6 bg-muted rounded-full w-28" />
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="flex items-center gap-3 mt-2">
                <div className="h-6 bg-muted rounded w-20" />
                <div className="h-4 bg-muted rounded w-16" />
                <div className="h-5 bg-muted rounded-full w-16" />
              </div>
            </div>
            <div className="h-10 bg-muted rounded-full" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-14 h-12 bg-muted rounded-xl" />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-muted rounded-full" />
              <div className="w-12 h-12 bg-muted rounded-full" />
            </div>
            <div className="h-12 bg-muted rounded-full" />
            <div className="h-14 bg-muted rounded-2xl" />
            <div className="h-14 bg-muted rounded-2xl" />
          </div>
        </div>

        {/* Rating skeleton */}
        <div className="bg-muted rounded-2xl h-48 mb-10" />

        {/* Related products skeleton */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-muted rounded w-40" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-muted rounded-2xl overflow-hidden">
                <div className="aspect-[3/4]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted/60 rounded w-3/4" />
                  <div className="h-3 bg-muted/60 rounded w-1/2" />
                  <div className="h-4 bg-muted/60 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
