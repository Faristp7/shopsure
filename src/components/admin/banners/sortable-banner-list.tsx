"use client"

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Banner } from "./types"
import { cn } from "@/lib/utils"
import { BannerCard } from "./banner-card"

type SortableBannerListProps = {
  banners: Banner[]
  onReorder: (next: Banner[]) => void
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
  onDuplicate: (banner: Banner) => void
  onActivate: (banner: Banner) => void
  emptyState?: React.ReactNode
}

function SortableRow({
  banner,
  onEdit,
  onDelete,
  onDuplicate,
  onActivate,
}: {
  banner: Banner
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
  onDuplicate: (banner: Banner) => void
  onActivate: (banner: Banner) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative", isDragging && "z-10 opacity-90")}
    >
      <BannerCard
        banner={banner}
        dragHandle={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-0.5 size-9 shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-5" />
          </Button>
        }
        onEdit={() => onEdit(banner)}
        onDelete={() => onDelete(banner)}
        onDuplicate={() => onDuplicate(banner)}
        onActivate={() => onActivate(banner)}
      />
    </div>
  )
}

export function SortableBannerList({
  banners,
  onReorder,
  onEdit,
  onDelete,
  onDuplicate,
  onActivate,
  emptyState,
}: SortableBannerListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = banners.findIndex((b) => b.id === active.id)
    const newIndex = banners.findIndex((b) => b.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    onReorder(arrayMove(banners, oldIndex, newIndex))
  }

  if (banners.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={banners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {banners.map((banner) => (
            <SortableRow
              key={banner.id}
              banner={banner}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onActivate={onActivate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
