"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ImageIcon,
  LayoutGrid,
  MonitorPlay,
  PanelsTopLeft,
  Plus,
  Rows3,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { Banner, BannersWorkspace, CategoryStripRow } from "./types"
import { createBannerId } from "./banner-helpers"
import { createInitialWorkspace } from "./initial-workspace"
import { SortableBannerList } from "./sortable-banner-list"
import { BannerEditorDialog } from "./banner-editor-dialog"
import { HomepagePreviewDialog } from "./homepage-preview-dialog"
import { BannersManagementSkeleton } from "./banners-skeleton"

type EditorPlacement =
  | { kind: "hero" }
  | { kind: "carousel" }
  | { kind: "strip"; rowId: string }

type DeleteTarget =
  | { kind: "hero"; bannerId: string }
  | { kind: "carousel"; bannerId: string }
  | { kind: "strip"; rowId: string; bannerId: string }
  | { kind: "stripRow"; rowId: string }

function duplicateBanner(b: Banner): Banner {
  return {
    ...b,
    id: createBannerId(),
    status: "draft",
    impressions: 0,
    clicks: 0,
  }
}

function activateBanner(b: Banner): Banner {
  const now = new Date()
  const end = new Date(b.endAt)
  let startAt = b.startAt
  let endAt = b.endAt
  if (end.getTime() <= now.getTime()) {
    endAt = new Date(now.getTime() + 14 * 86400000).toISOString()
    startAt = now.toISOString()
  } else if (new Date(b.startAt).getTime() > now.getTime()) {
    startAt = now.toISOString()
  }
  return { ...b, status: "active" as const, startAt, endAt }
}

function EmptySlot({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center">
      <div className="mb-3 rounded-full bg-muted p-3 text-muted-foreground">
        <ImageIcon className="size-6" aria-hidden />
      </div>
      <h4 className="font-semibold tracking-tight">{title}</h4>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  )
}

export function BannersManagement() {
  const [loading, setLoading] = useState(true)
  const [workspace, setWorkspace] = useState<BannersWorkspace>(() => createInitialWorkspace())
  const [previewOpen, setPreviewOpen] = useState(false)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [placement, setPlacement] = useState<EditorPlacement | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 700)
    return () => window.clearTimeout(t)
  }, [])

  const editorSlotLabel = useMemo(() => {
    if (!placement) return "Banner"
    if (placement.kind === "hero") return "Homepage hero"
    if (placement.kind === "carousel") return "Carousel"
    const row = workspace.categoryStrips.find((r) => r.id === placement.rowId)
    return row ? `Category strip · ${row.label}` : "Category strip"
  }, [placement, workspace.categoryStrips])

  function openCreate(p: EditorPlacement) {
    if (p.kind === "hero" && workspace.hero.length >= 1) {
      toast.message("Hero allows one banner", {
        description: "Saving a new hero replaces the current one.",
      })
    }
    setPlacement(p)
    setEditing(null)
    setEditorOpen(true)
  }

  function openEdit(p: EditorPlacement, banner: Banner) {
    setPlacement(p)
    setEditing(banner)
    setEditorOpen(true)
  }

  function handleSaveBanner(banner: Banner) {
    if (!placement) return
    setWorkspace((ws) => {
      if (placement.kind === "hero") {
        return { ...ws, hero: [banner] }
      }
      if (placement.kind === "carousel") {
        const list = ws.carousel
        const i = list.findIndex((b) => b.id === banner.id)
        if (i >= 0) {
          const next = [...list]
          next[i] = banner
          return { ...ws, carousel: next }
        }
        return { ...ws, carousel: [...list, banner] }
      }
      return {
        ...ws,
        categoryStrips: ws.categoryStrips.map((row) =>
          row.id === placement.rowId
            ? {
                ...row,
                banners: (() => {
                  const idx = row.banners.findIndex((b) => b.id === banner.id)
                  if (idx >= 0) {
                    const n = [...row.banners]
                    n[idx] = banner
                    return n
                  }
                  return [...row.banners, banner]
                })(),
              }
            : row
        ),
      }
    })
  }

  function removeBannerFromWorkspace(target: DeleteTarget) {
    setWorkspace((ws) => {
      if (target.kind === "hero") {
        return { ...ws, hero: ws.hero.filter((b) => b.id !== target.bannerId) }
      }
      if (target.kind === "carousel") {
        return {
          ...ws,
          carousel: ws.carousel.filter((b) => b.id !== target.bannerId),
        }
      }
      if (target.kind === "stripRow") {
        return {
          ...ws,
          categoryStrips: ws.categoryStrips.filter((r) => r.id !== target.rowId),
        }
      }
      return {
        ...ws,
        categoryStrips: ws.categoryStrips.map((row) =>
          row.id === target.rowId
            ? { ...row, banners: row.banners.filter((b) => b.id !== target.bannerId) }
            : row
        ),
      }
    })
    toast.success("Removed")
  }

  function requestDelete(target: DeleteTarget) {
    setDeleteTarget(target)
  }

  function confirmDelete() {
    if (deleteTarget) {
      removeBannerFromWorkspace(deleteTarget)
    }
    setDeleteTarget(null)
  }

  function handleDuplicate(p: EditorPlacement, banner: Banner) {
    const next = duplicateBanner(banner)
    if (p.kind === "hero") {
      setWorkspace((ws) => ({ ...ws, hero: [next] }))
      toast.success("Hero duplicated as draft")
      return
    }
    if (p.kind === "carousel") {
      setWorkspace((ws) => ({ ...ws, carousel: [...ws.carousel, next] }))
      toast.success("Duplicated to carousel")
      return
    }
    setWorkspace((ws) => ({
      ...ws,
      categoryStrips: ws.categoryStrips.map((row) =>
        row.id === p.rowId ? { ...row, banners: [...row.banners, next] } : row
      ),
    }))
    toast.success("Duplicated into strip")
  }

  function handleActivate(p: EditorPlacement, banner: Banner) {
    const next = activateBanner(banner)
    setWorkspace((ws) => {
      if (p.kind === "hero") {
        return { ...ws, hero: ws.hero.map((b) => (b.id === next.id ? next : b)) }
      }
      if (p.kind === "carousel") {
        return {
          ...ws,
          carousel: ws.carousel.map((b) => (b.id === next.id ? next : b)),
        }
      }
      return {
        ...ws,
        categoryStrips: ws.categoryStrips.map((row) =>
          row.id === p.rowId
            ? {
                ...row,
                banners: row.banners.map((b) => (b.id === next.id ? next : b)),
              }
            : row
        ),
      }
    })
    toast.success("Banner activated")
  }

  function addStripRow() {
    const row: CategoryStripRow = {
      id: `strip-${createBannerId()}`,
      label: "New category strip",
      banners: [],
    }
    setWorkspace((ws) => ({ ...ws, categoryStrips: [...ws.categoryStrips, row] }))
    toast.success("Strip row added")
  }

  if (loading) {
    return <BannersManagementSkeleton />
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Banners</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage homepage placements, carousel rotation, and category strips. Drag cards to set
            visual order; priority is used for tie-breaks and reporting.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="gap-2 shadow-sm" onClick={() => setPreviewOpen(true)}>
            <MonitorPlay className="size-4" />
            Preview homepage
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PanelsTopLeft className="size-4 text-muted-foreground" />
                Homepage hero
              </CardTitle>
              <CardDescription>
                Single full-width slot above the fold. Recommended desktop 1920×600px.
              </CardDescription>
            </div>
            <Button type="button" size="sm" className="gap-1.5 shadow-sm" onClick={() => openCreate({ kind: "hero" })}>
              <Plus className="size-3.5" />
              {workspace.hero.length ? "Replace hero" : "Add hero"}
            </Button>
          </CardHeader>
          <CardContent>
            <SortableBannerList
              banners={workspace.hero}
              onReorder={(next) => setWorkspace((ws) => ({ ...ws, hero: next }))}
              onEdit={(b) => openEdit({ kind: "hero" }, b)}
              onDelete={(b) => requestDelete({ kind: "hero", bannerId: b.id })}
              onDuplicate={(b) => handleDuplicate({ kind: "hero" }, b)}
              onActivate={(b) => handleActivate({ kind: "hero" }, b)}
              emptyState={
                <EmptySlot
                  title="No hero banner yet"
                  description="Create a hero to anchor campaigns and seasonal moments on your storefront."
                >
                  <Button type="button" onClick={() => openCreate({ kind: "hero" })}>
                    <Plus className="mr-2 size-4" />
                    Add hero banner
                  </Button>
                </EmptySlot>
              }
            />
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <LayoutGrid className="size-4 text-muted-foreground" />
                Carousel banners
              </CardTitle>
              <CardDescription>Multiple slides with drag-to-order sequencing.</CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="gap-1.5 shadow-sm"
              onClick={() => openCreate({ kind: "carousel" })}
            >
              <Plus className="size-3.5" />
              Add carousel slide
            </Button>
          </CardHeader>
          <CardContent>
            <SortableBannerList
              banners={workspace.carousel}
              onReorder={(next) => setWorkspace((ws) => ({ ...ws, carousel: next }))}
              onEdit={(b) => openEdit({ kind: "carousel" }, b)}
              onDelete={(b) => requestDelete({ kind: "carousel", bannerId: b.id })}
              onDuplicate={(b) => handleDuplicate({ kind: "carousel" }, b)}
              onActivate={(b) => handleActivate({ kind: "carousel" }, b)}
              emptyState={
                <EmptySlot
                  title="No carousel slides"
                  description="Add secondary stories, promos, and partner highlights that rotate below the hero."
                >
                  <Button type="button" onClick={() => openCreate({ kind: "carousel" })}>
                    <Plus className="mr-2 size-4" />
                    Add slide
                  </Button>
                </EmptySlot>
              }
            />
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <Rows3 className="size-4 text-muted-foreground" />
                Category strips
              </h2>
              <p className="text-sm text-muted-foreground">
                Optional rows of narrow tiles for category or collection highlights.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-1.5 w-fit shadow-sm" onClick={addStripRow}>
              <Plus className="size-3.5" />
              Add strip row
            </Button>
          </div>

          {workspace.categoryStrips.length === 0 ? (
            <Card className="border-dashed border-border/80 shadow-sm">
              <CardContent className="py-12">
                <EmptySlot
                  title="No category strips"
                  description="Add a row to merchandise categories alongside the main funnel."
                >
                  <Button type="button" onClick={addStripRow}>
                    <Plus className="mr-2 size-4" />
                    Add first row
                  </Button>
                </EmptySlot>
              </CardContent>
            </Card>
          ) : (
            workspace.categoryStrips.map((row) => (
              <Card key={row.id} className="border-border/70 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-base">{row.label}</CardTitle>
                    <CardDescription>Reorder tiles for this row independently.</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="gap-1.5"
                      onClick={() => openCreate({ kind: "strip", rowId: row.id })}
                    >
                      <Plus className="size-3.5" />
                      Add tile
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove strip row"
                      onClick={() => requestDelete({ kind: "stripRow", rowId: row.id })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <SortableBannerList
                    banners={row.banners}
                    onReorder={(next) =>
                      setWorkspace((ws) => ({
                        ...ws,
                        categoryStrips: ws.categoryStrips.map((r) =>
                          r.id === row.id ? { ...r, banners: next } : r
                        ),
                      }))
                    }
                    onEdit={(b) => openEdit({ kind: "strip", rowId: row.id }, b)}
                    onDelete={(b) => requestDelete({ kind: "strip", rowId: row.id, bannerId: b.id })}
                    onDuplicate={(b) => handleDuplicate({ kind: "strip", rowId: row.id }, b)}
                    onActivate={(b) => handleActivate({ kind: "strip", rowId: row.id }, b)}
                    emptyState={
                      <EmptySlot
                        title="Empty row"
                        description="Add tiles that deep-link to collections or curated lists."
                      >
                        <Button type="button" onClick={() => openCreate({ kind: "strip", rowId: row.id })}>
                          <Plus className="mr-2 size-4" />
                          Add tile
                        </Button>
                      </EmptySlot>
                    }
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <BannerEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        banner={editing}
        slotLabel={editorSlotLabel}
        onSave={handleSaveBanner}
      />

      <HomepagePreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} workspace={workspace} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.kind === "stripRow" ? "Remove strip row?" : "Delete banner?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.kind === "stripRow"
                ? "Banners in this row will be removed from the workspace. This cannot be undone from the UI."
                : "This banner will be removed from the slot. You can recreate it from a duplicate if needed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
