"use client"

import { useState } from "react"
import { Monitor, Smartphone } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { BannersWorkspace } from "./types"
import { getDisplayStatus } from "./banner-helpers"

type HomepagePreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: BannersWorkspace
}

export function HomepagePreviewDialog({
  open,
  onOpenChange,
  workspace,
}: HomepagePreviewDialogProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop")

  const hero = workspace.hero[0]
  const carousel = workspace.carousel
  const strips = workspace.categoryStrips

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,880px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b px-6 py-4 text-left">
          <DialogTitle>Homepage preview</DialogTitle>
          <DialogDescription>
            Simulated storefront layout using your current draft workspace. Does not reflect caching or targeting rules.
          </DialogDescription>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Viewport</span>
            <div className="inline-flex rounded-lg border bg-muted/40 p-0.5">
              <Button
                type="button"
                variant={viewport === "desktop" ? "default" : "ghost"}
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setViewport("desktop")}
              >
                <Monitor className="size-3.5" />
                Desktop
              </Button>
              <Button
                type="button"
                variant={viewport === "mobile" ? "default" : "ghost"}
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setViewport("mobile")}
              >
                <Smartphone className="size-3.5" />
                Mobile
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6">
          <div
            className={cn(
              "mx-auto transition-[max-width] duration-300 ease-out",
              viewport === "desktop" ? "max-w-5xl" : "max-w-[390px]"
            )}
          >
            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
              {/* Nav chrome */}
              <div className="flex h-11 items-center justify-between border-b bg-muted/30 px-4">
                <div className="h-2 w-20 rounded-full bg-muted-foreground/20" />
                <div className="flex gap-2">
                  <div className="h-2 w-8 rounded-full bg-muted-foreground/15" />
                  <div className="h-2 w-8 rounded-full bg-muted-foreground/15" />
                </div>
              </div>

              {/* Hero */}
              <section className="relative border-b">
                {hero ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={viewport === "desktop" ? hero.desktopImageUrl : hero.mobileImageUrl}
                      alt=""
                      className={cn(
                        "w-full object-cover",
                        viewport === "desktop" ? "aspect-[16/5] max-h-[220px]" : "aspect-[3/4] max-h-[320px]"
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    {getDisplayStatus(hero) === "draft" ? (
                      <Badge className="absolute right-3 top-3 bg-amber-500/95 text-white border-0 shadow-sm">
                        Draft
                      </Badge>
                    ) : null}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6">
                      <p className="text-xs font-medium uppercase tracking-wide text-white/80">Featured</p>
                      <h2 className="mt-1 text-lg font-semibold leading-tight sm:text-2xl">{hero.headline}</h2>
                      {hero.subheadline ? (
                        <p className="mt-1 max-w-xl text-sm text-white/85">{hero.subheadline}</p>
                      ) : null}
                      {hero.ctaText ? (
                        <span className="mt-3 inline-flex rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900">
                          {hero.ctaText}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-[16/5] min-h-[120px] items-center justify-center bg-muted text-sm text-muted-foreground">
                    No hero banner in this slot
                  </div>
                )}
              </section>

              {/* Carousel */}
              <section className="space-y-2 border-b p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Carousel
                  </p>
                  <span className="text-[11px] text-muted-foreground">{carousel.length} slides</span>
                </div>
                <div
                  className={cn(
                    "flex gap-3 overflow-x-auto pb-1 scrollbar-thin",
                    viewport === "mobile" && "snap-x snap-mandatory"
                  )}
                >
                  {carousel.length === 0 ? (
                    <div className="flex h-28 w-full items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                      No carousel banners yet
                    </div>
                  ) : (
                    carousel.map((b) => (
                        <div
                          key={b.id}
                          className={cn(
                            "relative shrink-0 overflow-hidden rounded-lg border bg-card shadow-sm",
                            viewport === "desktop" ? "w-[min(280px,72vw)]" : "w-[78%] snap-center"
                          )}
                        >
                          {getDisplayStatus(b) === "draft" ? (
                            <Badge className="absolute right-2 top-2 z-10 bg-amber-500/95 text-[10px] text-white border-0">
                              Draft
                            </Badge>
                          ) : null}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={viewport === "desktop" ? b.desktopImageUrl : b.mobileImageUrl}
                            alt=""
                            className="aspect-[16/9] w-full object-cover"
                          />
                          <div className="space-y-0.5 p-2">
                            <p className="line-clamp-2 text-xs font-medium leading-snug">{b.headline}</p>
                            {b.ctaText ? (
                              <p className="text-[10px] font-medium text-primary">{b.ctaText}</p>
                            ) : null}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </section>

              {/* Category strips */}
              <section className="space-y-6 p-4">
                {strips.map((row) => (
                  <div key={row.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {row.banners.length === 0 ? (
                        <div className="flex h-20 w-full items-center justify-center rounded-lg border border-dashed text-[11px] text-muted-foreground">
                          Empty row
                        </div>
                      ) : (
                        row.banners.map((b) => (
                            <div
                              key={b.id}
                              className="relative w-[140px] shrink-0 overflow-hidden rounded-md border bg-card shadow-sm"
                            >
                              {getDisplayStatus(b) === "draft" ? (
                                <Badge className="absolute right-1 top-1 z-10 bg-amber-500/95 text-[9px] px-1 py-0 text-white border-0">
                                  Draft
                                </Badge>
                              ) : null}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={viewport === "desktop" ? b.desktopImageUrl : b.mobileImageUrl}
                                alt=""
                                className="aspect-[4/3] w-full object-cover"
                              />
                              <p className="line-clamp-2 p-1.5 text-[10px] font-medium leading-tight">
                                {b.headline}
                              </p>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                ))}
              </section>

              <div className="border-t bg-muted/20 px-4 py-6 text-center text-[11px] text-muted-foreground">
                Footer · trust badges · newsletter
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
