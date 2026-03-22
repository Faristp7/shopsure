'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableProductCard, FeaturedProductData } from './SortableProductCard';

interface FeaturedRailProps {
  products: FeaturedProductData[];
  onReorder: (products: FeaturedProductData[]) => void;
  onRemove: (id: string) => void;
}

export function FeaturedRail({ products, onReorder, onRemove }: FeaturedRailProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      onReorder(arrayMove(products, oldIndex, newIndex));
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 lg:p-16 border-2 border-dashed rounded-xl bg-muted/10">
        <div className="w-20 h-20 mb-5 rounded-full bg-muted/50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-muted-foreground/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No featured products added</h3>
        <p className="text-sm text-muted-foreground max-w-[300px] text-center mb-6">
          Search and select products above to start building your featured rail.
        </p>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={products.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {products.map((product) => (
            <SortableProductCard 
              key={product.id} 
              product={product} 
              onRemove={onRemove} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
