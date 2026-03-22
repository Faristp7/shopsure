"use client"

import { Badge } from "@/components/ui/badge"
import type { DisplayStatus } from "./types"
import { cn } from "@/lib/utils"

const styles: Record<DisplayStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  scheduled: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
  expired: "bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30",
}

const labels: Record<DisplayStatus, string> = {
  draft: "Draft",
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
}

export function BannerStatusBadge({
  status,
  className,
}: {
  status: DisplayStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize shadow-none", styles[status], className)}
    >
      {labels[status]}
    </Badge>
  )
}
