"use client"

import * as React from "react"
import { Reorder } from "framer-motion"
import {
  Eye,
  ImageIcon,
  LayoutTemplate,
  Plus,
  Rows3,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import type { BannerRecord, CategoryStripRow } from "@/types/banner"
import type { Banner } from "./types"
import { AdminSectionShell } from "@/components/admin/admin-section-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { BannerCard, BannerCardSkeleton } from "./banner-card"
import { BannerEditorDialog } from "./banner-editor-dialog"
import { HomepagePreviewDialog } from "./homepage-preview-dialog"
import { bannerToRecord, recordToBanner } from "./banner-mappers"
import type { BannersWorkspace } from "./types"
import {
  INITIAL_CAROUSEL_IDS,
  INITIAL_HERO_IDS,
  INITIAL_STRIP_ROWS,
  MOCK_BANNERS,
} from "./initial-data"
import { createDefaultBanner, generateId } from "./utils"

type EditorContext =
  | { kind: "hero"; mode: "create" | "edit"; bannerId?: string }
  | { kind: "carousel"; mode: "create" | "edit"; bannerId?: string }
  | { kind: "strip"; mode: "create" | "edit"; rowId: string; bannerId?: string }

export function BannerManagement() {
  const [loading, setLoading] = React.useState(true)
  const [banners, setBanners] = React.useState<Record<string, BannerRecord>>(() => ({ ...MOCK_BANNERS }))
  const [heroIds, setHeroIds] = React.useState<string[]>(() => [...INITIAL_HERO_IDS])
  const [carouselIds, setCarouselIds] = React.useState<string[]>(() => [...INITIAL_CAROUSEL_IDS])
  const [stripRows, setStripRows] = React.useState<CategoryStripRow[]>(() =>
    INITIAL_STRIP_ROWS.map((r) => ({ ...r, bannerIds: [...r.bannerIds] }))
  )

  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [editorCtx, setEditorCtx] = React.useState<EditorContext | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 700)
    return () => window.clearTimeout(t)
  }, [])

  const removeBannerEverywhere = (id: string) => {
    setBanners((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setHeroIds((ids) => ids.filter((x) => x !== id))
    setCarouselIds((ids) => ids.filter((x) => x !== id))
    setStripRows((rows) =>
      rows.map((r) => ({ ...r, bannerIds: r.bannerIds.filter((x) => x !== id) }))
    )
  }

  const openCreate = (ctx: EditorContext) => {
    setEditorCtx(ctx)
    setEditorOpen(true)
  }

  const openEdit = (ctx: EditorContext) => {
    setEditorCtx(ctx)
    setEditorOpen(true)
  }

  const getEditorBanner = (): Banner | null => {
    if (!editorCtx) return null
    if (editorCtx.mode === "edit" && editorCtx.bannerId) {
      const r = banners[editorCtx.bannerId]
      return r ? recordToBanner(r) : null
    }
    return null
  }

  const getSlotLabel = () => {
    if (!editorCtx) return ""
    if (editorCtx.kind === "hero") return "Homepage hero"
    if (editorCtx.kind === "carousel") return "Carousel banners"
    const row = stripRows.find((r) => r.id === editorCtx.rowId)
    return `Category strip · ${row?.label ?? "Row"}`
  }

  const handleSaveBanner = (saved: Banner) => {
    const record = bannerToRecord(saved)
    if (!editorCtx) return

    if (editorCtx.mode === "create" && editorCtx.kind === "hero") {
      setBanners((prev) => {
        const next = { ...prev, [record.id]: record }
        const oldId = heroIds[0]
        if (oldId) delete next[oldId]
        return next
      })
      setHeroIds([record.id])
      toast.success("Hero banner saved")
      return
    }

    setBanners((prev) => ({ ...prev, [record.id]: record }))

    if (editorCtx.mode === "create") {
      if (editorCtx.kind === "carousel") {
        setCarouselIds((ids) => [...ids, record.id])
      } else if (editorCtx.kind === "strip") {
        const rowId = editorCtx.rowId
        setStripRows((rows) =>
          rows.map((r) =>
            r.id === rowId ? { ...r, bannerIds: [...r.bannerIds, record.id] } : r
          )
        )
      }
      toast.success("Banner created")
    } else {
      toast.success("Banner updated")
    }
  }

  const handleDuplicate = (id: string) => {
    const src = banners[id]
    if (!src) return
    const copy = createDefaultBanner({
      ...src,
      id: generateId(),
      headline: `${src.headline} (copy)`,
      analytics: { clicks: 0, impressions: 0 },
    })

    if (heroIds.includes(id)) {
      setBanners((prev) => {
        const next = { ...prev, [copy.id]: copy }
        delete next[id]
        return next
      })
      setHeroIds([copy.id])
    } else {
      setBanners((prev) => ({ ...prev, [copy.id]: copy }))
      if (carouselIds.includes(id)) {
        setCarouselIds((ids) => {
          const i = ids.indexOf(id)
          const next = [...ids]
          next.splice(i + 1, 0, copy.id)
          return next
        })
      } else {
        setStripRows((rows) =>
          rows.map((r) => {
            const i = r.bannerIds.indexOf(id)
            if (i === -1) return r
            const nextIds = [...r.bannerIds]
            nextIds.splice(i + 1, 0, copy.id)
            return { ...r, bannerIds: nextIds }
          })
        )
      }
    }
    toast.success("Banner duplicated")
  }

  const handleActivate = (id: string) => {
    const b = banners[id]
    if (!b) return
    const now = Date.now()
    let startsAt = b.startsAt
    let endsAt = b.endsAt
    if (new Date(endsAt).getTime() < now) {
      endsAt = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    if (new Date(startsAt).getTime() > now) {
      startsAt = new Date(now).toISOString()
    }
    setBanners((prev) => ({
      ...prev,
      [id]: { ...b, status: "active", startsAt, endsAt },
    }))
    toast.success("Banner activated")
  }

  const confirmDelete = () => {
    if (deleteId) {
      removeBannerEverywhere(deleteId)
      toast.success("Banner removed")
    }
    setDeleteId(null)
  }

  const addStripRow = () => {
    const id = `strip_${generateId()}`
    setStripRows((rows) => [
      ...rows,
      { id, label: `Category strip ${rows.length + 1}`, bannerIds: [] },
    ])
  }

  const updateStripLabel = (rowId: string, label: string) => {
    setStripRows((rows) => rows.map((r) => (r.id === rowId ? { ...r, label } : r)))
  }

  const removeStripRow = (rowId: string) => {
    setStripRows((rows) => {
      const row = rows.find((r) => r.id === rowId)
      if (!row) return rows
      setBanners((prev) => {
        const next = { ...prev }
        for (const bid of row.bannerIds) delete next[bid]
        return next
      })
      return rows.filter((r) => r.id !== rowId)
    })
    toast.message("Category strip removed")
  }

  const previewWorkspace = React.useMemo((): BannersWorkspace => {
    const hero = heroIds[0] && banners[heroIds[0]] ? [recordToBanner(banners[heroIds[0]])] : []
    const carousel = carouselIds
      .map((id) => banners[id])
      .filter(Boolean)
      .map((r) => recordToBanner(r))
    const categoryStrips = stripRows.map((row) => ({
      id: row.id,
      label: row.label,
      banners: row.bannerIds
        .map((id) => banners[id])
        .filter(Boolean)
        .map((r) => recordToBanner(r)),
    }))
    return { hero, carousel, categoryStrips }
  }, [banners, heroIds, carouselIds, stripRows])

  return (
    <>
      <AdminSectionShell
        title="Banners"
        description="Lifecycle and placement for homepage hero, carousel, and category strips — drag to reorder priority."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <LayoutTemplate className="size-4" />
            <span>Marketing · Promotions · Banners</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="size-4" />
              Preview storefront
            </Button>
          </div>
        </div>

        <div className="space-y-10">
          <SlotSection
            icon={<Sparkles className="size-4 text-amber-500" />}
            title="Homepage hero"
            description="Single slot above the fold — your strongest campaign."
            loading={loading}
            empty={
              <EmptySlot
                title="No hero banner yet"
                hint="Add a high-impact visual with a clear CTA. Recommended desktop artboard 1920×600."
                actionLabel="Create hero banner"
                onAction={() => openCreate({ kind: "hero", mode: "create" })}
              />
            }
            showContent={heroIds.length > 0}
          >
            <Reorder.Group
              axis="y"
              values={heroIds}
              onReorder={setHeroIds}
              className="space-y-3"
              as="div"
            >
              {heroIds.map((id) => {
                const b = banners[id]
                if (!b) return null
                return (
                  <Reorder.Item key={id} value={id} as="div" className="relative">
                    <BannerCard
                      banner={recordToBanner(b)}
                      onEdit={() => openEdit({ kind: "hero", mode: "edit", bannerId: id })}
                      onDelete={() => setDeleteId(id)}
                      onDuplicate={() => handleDuplicate(id)}
                      onActivate={() => handleActivate(id)}
                      dragProps={{ className: "touch-none" }}
                    />
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>
            {heroIds.length > 0 ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={() => openCreate({ kind: "hero", mode: "create" })}
              >
                Replace hero banner
              </Button>
            ) : null}
          </SlotSection>

          <Separator className="opacity-60" />

          <SlotSection
            icon={<ImageIcon className="size-4 text-sky-500" />}
            title="Carousel banners"
            description="Rotating promos below the hero — order sets default priority."
            loading={loading}
            empty={
              <EmptySlot
                title="Carousel is empty"
                hint="Use 2–4 tiles for seasonal promos, shipping perks, or loyalty."
                actionLabel="Add carousel banner"
                onAction={() => openCreate({ kind: "carousel", mode: "create" })}
              />
            }
            showContent={carouselIds.length > 0}
          >
            <Reorder.Group
              axis="y"
              values={carouselIds}
              onReorder={setCarouselIds}
              className="space-y-3"
              as="div"
            >
              {carouselIds.map((id) => {
                const b = banners[id]
                if (!b) return null
                return (
                  <Reorder.Item key={id} value={id} as="div">
                    <BannerCard
                      banner={recordToBanner(b)}
                      onEdit={() => openEdit({ kind: "carousel", mode: "edit", bannerId: id })}
                      onDelete={() => setDeleteId(id)}
                      onDuplicate={() => handleDuplicate(id)}
                      onActivate={() => handleActivate(id)}
                      dragProps={{ className: "touch-none" }}
                    />
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => openCreate({ kind: "carousel", mode: "create" })}
            >
              <Plus className="size-4" />
              Add carousel banner
            </Button>
          </SlotSection>

          <Separator className="opacity-60" />

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
                  <Rows3 className="size-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold tracking-tight">Category strips</h4>
                  <p className="text-muted-foreground text-sm">
                    Optional rows of tiles for verticals — add multiple strips as your taxonomy grows.
                  </p>
                </div>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={addStripRow}>
                <Plus className="size-4" />
                Add strip row
              </Button>
            </div>

            {loading ? (
              <div className="space-y-3">
                <BannerCardSkeleton />
              </div>
            ) : stripRows.length === 0 ? (
              <Card className="border-dashed shadow-sm">
                <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                  <Rows3 className="text-muted-foreground size-10" />
                  <div>
                    <p className="font-medium">No category strips</p>
                    <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                      Strips highlight collections on the homepage grid. Create a row to get started.
                    </p>
                  </div>
                  <Button type="button" onClick={addStripRow}>
                    Create first strip
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {stripRows.map((row) => (
                  <Card key={row.id} className="overflow-hidden shadow-sm">
                    <CardHeader className="flex flex-col gap-4 border-b bg-muted/20 pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">Strip row</CardTitle>
                        <CardDescription>Drag banners to reorder within this strip.</CardDescription>
                      </div>
                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <Input
                          value={row.label}
                          onChange={(e) => updateStripLabel(row.id, e.target.value)}
                          className="max-w-xs bg-background"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeStripRow(row.id)}
                        >
                          Remove row
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {row.bannerIds.length === 0 ? (
                        <EmptySlot
                          title="No banners in this strip"
                          hint="Tiles work best at 4:3 or 1:1 for dense grids."
                          actionLabel="Add strip banner"
                          onAction={() => openCreate({ kind: "strip", mode: "create", rowId: row.id })}
                        />
                      ) : (
                        <Reorder.Group
                          axis="y"
                          values={row.bannerIds}
                          onReorder={(next) =>
                            setStripRows((rows) =>
                              rows.map((r) => (r.id === row.id ? { ...r, bannerIds: next } : r))
                            )
                          }
                          className="space-y-3"
                          as="div"
                        >
                          {row.bannerIds.map((id) => {
                            const b = banners[id]
                            if (!b) return null
                            return (
                              <Reorder.Item key={id} value={id} as="div">
                                <BannerCard
                                  banner={recordToBanner(b)}
                                  onEdit={() =>
                                    openEdit({ kind: "strip", mode: "edit", rowId: row.id, bannerId: id })
                                  }
                                  onDelete={() => setDeleteId(id)}
                                  onDuplicate={() => handleDuplicate(id)}
                                  onActivate={() => handleActivate(id)}
                                  dragProps={{ className: "touch-none" }}
                                />
                              </Reorder.Item>
                            )
                          })}
                        </Reorder.Group>
                      )}
                      {row.bannerIds.length > 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => openCreate({ kind: "strip", mode: "create", rowId: row.id })}
                        >
                          <Plus className="size-4" />
                          Add banner to strip
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </AdminSectionShell>

      <BannerEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        banner={getEditorBanner()}
        slotLabel={getSlotLabel()}
        onSave={handleSaveBanner}
      />

      <HomepagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        workspace={previewWorkspace}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the creative from all placements. Connected campaign analytics stay in your warehouse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function SlotSection({
  icon,
  title,
  description,
  loading,
  empty,
  showContent,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  loading: boolean
  empty: React.ReactNode
  showContent: boolean
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-muted p-2">{icon}</div>
        <div>
          <h4 className="text-base font-semibold tracking-tight">{title}</h4>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          <BannerCardSkeleton />
        </div>
      ) : showContent ? (
        children
      ) : (
        empty
      )}
    </section>
  )
}

function EmptySlot({
  title,
  hint,
  actionLabel,
  onAction,
}: {
  title: string
  hint: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <Card className="border-dashed shadow-sm">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="rounded-full bg-muted p-3">
          <ImageIcon className="text-muted-foreground size-8" />
        </div>
        <div className="max-w-md space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground text-sm">{hint}</p>
        </div>
        <Button type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
