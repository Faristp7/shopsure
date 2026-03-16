import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-8 w-10" />
            </div>
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        ))}
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-lg shrink-0" />
          ))}
        </div>
        <div className="flex-1 max-w-sm md:ml-auto">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Bulk Edit Bar */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-4">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="text-left py-3 px-4">
                  <Skeleton className="h-4 w-14" />
                </th>
                <th className="text-left py-3 px-4">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="text-left py-3 px-4">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="text-center py-3 px-4">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </th>
                <th className="text-right py-3 px-4">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                <tr
                  key={row}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-4 w-14" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                    <Skeleton className="h-1 w-16 mt-1.5 rounded-full" />
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-9 rounded-md" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-1">
                      {[1, 2, 3, 4].map((btn) => (
                        <Skeleton
                          key={btn}
                          className="h-8 w-8 rounded-lg shrink-0"
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
