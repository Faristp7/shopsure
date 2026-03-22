"use client"

import { useState } from "react"
import {
  Copy,
  ExternalLink,
  GripVertical,
  Pencil,
  Play,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Banner } from "./types"
import { BannerStatusBadge } from "./banner-status-badge"
import { BannerAnalyticsInline } from "./banner-analytics-inline"
import { formatDateTime, getDisplayStatus } from "./banner-helpers"

type BannerCardProps = {
  banner: Banner
  dragHandle?: React.ReactNode
  dragProps?: React.HTMLAttributes<HTMLDivElement>
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onActivate: () => void
  className?: string
}

export function BannerCard({
  banner,
  dragHandle,
  dragProps,
  onEdit,
  onDelete,
  onDuplicate,
  onActivate,
  className,
}: BannerCardProps) {
  const [preview, setPreview] = useState<"desktop" | "mobile">("desktop")
  const display = getDisplayStatus(banner)

  return (
    <div
      className={cn(
        "group relative flex gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {dragHandle ?? (
        <div
          {...dragProps}
          className={cn(
            "hidden w-8 shrink-0 cursor-grab touch-none items-start justify-center pt-1 text-muted-foreground opacity-40 active:cursor-grabbing sm:flex",
            dragProps?.className
          )}
        >
          <GripVertical className="size-5" aria-hidden />
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div className="w-full max-w-[min(100%,280px)] shrink-0 space-y-2">
            <Tabs value={preview} onValueChange={(v) => setPreview(v as "desktop" | "mobile")}>
              <TabsList className="grid h-8 w-full grid-cols-2">
                <TabsTrigger value="desktop" className="text-xs">
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="mobile" className="text-xs">
                  Mobile
                </TabsTrigger>
              </TabsList>
              <TabsContent value="desktop" className="mt-2">
                {banner.desktopImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={banner.desktopImageUrl}
                    alt=""
                    className="aspect-[16/5] w-full rounded-lg border object-cover bg-muted"
                  />
                ) : (
                  <div className="flex aspect-[16/5] w-full items-center justify-center rounded-lg border border-dashed bg-muted/40 text-xs text-muted-foreground">
                    No desktop image
                  </div>
                )}
              </TabsContent>
              <TabsContent value="mobile" className="mt-2">
                {banner.mobileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={banner.mobileImageUrl}
                    alt=""
                    className="mx-auto aspect-[3/4] w-[min(100%,140px)] rounded-lg border object-cover bg-muted"
                  />
                ) : (
                  <div className="mx-auto flex aspect-[3/4] w-[min(100%,140px)] items-center justify-center rounded-lg border border-dashed bg-muted/40 px-2 text-center text-xs text-muted-foreground">
                    No mobile image
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 space-y-1">
                <h3 className="font-semibold leading-tight tracking-tight line-clamp-2">
                  {banner.headline}
                </h3>
                <a
                  href={banner.destinationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex max-w-full items-center gap-1 text-xs text-primary hover:underline"
                >
                  <span className="truncate">{banner.destinationUrl}</span>
                  <ExternalLink className="size-3 shrink-0 opacity-70" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <BannerStatusBadge status={display} />
                <span className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                  Priority {banner.priority}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">Schedule: </span>
              {formatDateTime(banner.startAt)} → {formatDateTime(banner.endAt)}
            </p>

            <BannerAnalyticsInline banner={banner} />

            <TooltipProvider delayDuration={300}>
              <div className="flex flex-wrap gap-1 pt-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-8" onClick={onEdit}>
                      <Pencil className="size-3.5" />
                      <span className="ml-1.5 hidden sm:inline">Edit</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit banner</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={onActivate}
                      disabled={display === "active" || display === "expired"}
                    >
                      <Play className="size-3.5" />
                      <span className="ml-1.5 hidden sm:inline">Activate</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Set live now</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-8" onClick={onDuplicate}>
                      <Copy className="size-3.5" />
                      <span className="ml-1.5 hidden sm:inline">Duplicate</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate as draft</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-8 text-destructive hover:text-destructive" onClick={onDelete}>
                      <Trash2 className="size-3.5" />
                      <span className="ml-1.5 hidden sm:inline">Delete</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove banner</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BannerCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row">
      <div className="aspect-[16/5] w-full animate-pulse rounded-lg bg-muted sm:max-w-[280px]" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted sm:max-w-md" />
      </div>
    </div>
  )
}
