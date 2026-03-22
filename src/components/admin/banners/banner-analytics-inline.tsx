"use client"

import { BarChart3, MousePointerClick, Eye } from "lucide-react"
import { ctrPercent } from "./banner-helpers"
import type { Banner } from "./types"

export function BannerAnalyticsInline({ banner }: { banner: Banner }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground border-t pt-3 mt-3">
      <span className="inline-flex items-center gap-1.5">
        <Eye className="size-3.5 shrink-0 opacity-70" aria-hidden />
        <span className="tabular-nums text-foreground">{banner.impressions.toLocaleString()}</span>
        <span>impressions</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MousePointerClick className="size-3.5 shrink-0 opacity-70" aria-hidden />
        <span className="tabular-nums text-foreground">{banner.clicks.toLocaleString()}</span>
        <span>clicks</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <BarChart3 className="size-3.5 shrink-0 opacity-70" aria-hidden />
        <span className="tabular-nums font-medium text-foreground">
          CTR {ctrPercent(banner.clicks, banner.impressions)}
        </span>
      </span>
    </div>
  )
}
