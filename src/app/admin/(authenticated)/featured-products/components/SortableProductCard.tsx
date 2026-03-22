'use client';

import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface FeaturedProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  sku: string;
  status: 'ACTIVE' | 'DISABLED';
}

interface SortableProductCardProps {
  product: FeaturedProductData;
  onRemove: (id: string) => void;
}

export function SortableProductCard({ product, onRemove }: SortableProductCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isDisabled = product.status !== 'ACTIVE';
  
  const hasWarning = isOutOfStock || isDisabled;

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center p-3 sm:p-4 mb-3 bg-card border ${isDragging ? 'shadow-lg border-primary/50' : 'hover:border-primary/20'} transition-colors relative group`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1 -ml-1 mr-2 text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-muted overflow-hidden flex-shrink-0 border relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image || 'https://via.placeholder.com/150'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="ml-4 flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium truncate">{product.name}</h4>
          {hasWarning && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDisabled ? 'Product disabled' : 'Out of stock'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1 truncate flex items-center gap-2">
          <span>SKU: {product.sku}</span>
          <span>•</span>
          <span className="font-medium text-foreground">${product.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4 max-w-[150px] flex-shrink-0">
        <div className="hidden sm:flex flex-col items-end gap-1">
          {isOutOfStock ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : isLowStock ? (
            <Badge variant="warning" className="bg-yellow-500 text-white hover:bg-yellow-600">Low Stock ({product.stock})</Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">In Stock</Badge>
          )}
          
          {isDisabled && (
            <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
