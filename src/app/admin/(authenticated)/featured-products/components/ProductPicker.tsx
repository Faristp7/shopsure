'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FeaturedProductData } from './SortableProductCard';
import { Badge } from '@/components/ui/badge';

// Dummy data for demo
const MOCK_PRODUCTS: FeaturedProductData[] = [
  { id: '1', name: 'Premium Wireless Headphones', price: 299.99, stock: 45, image: '', sku: 'AUD-WH-001', status: 'ACTIVE' },
  { id: '2', name: 'Mechanical Keyboard RGB', price: 149.50, stock: 12, image: '', sku: 'PER-MK-002', status: 'ACTIVE' },
  { id: '3', name: 'Ultra-wide Monitor 34"', price: 799.00, stock: 3, image: '', sku: 'DIS-UW-003', status: 'ACTIVE' },
  { id: '4', name: 'Ergonomic Office Chair', price: 349.99, stock: 0, image: '', sku: 'FUR-EC-004', status: 'ACTIVE' },
  { id: '5', name: 'USB-C Docking Station', price: 89.99, stock: 120, image: '', sku: 'ACC-DS-005', status: 'DISABLED' },
  { id: '6', name: 'Smartphone Pro Max', price: 1199.00, stock: 4, image: '', sku: 'MOB-PM-006', status: 'ACTIVE' },
  { id: '7', name: 'Bluetooth Noise Cancelling Earbuds', price: 199.99, stock: 85, image: '', sku: 'AUD-EB-007', status: 'ACTIVE' },
];

interface ProductPickerProps {
  onSelectProduct: (product: FeaturedProductData) => void;
  selectedIds: string[];
}

export function ProductPicker({ onSelectProduct, selectedIds }: ProductPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filtered = MOCK_PRODUCTS.filter(p => !selectedIds.includes(p.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full xl:w-[450px] justify-between h-12 text-base px-4 bg-background shadow-sm hover:bg-muted/50"
        >
          <span className="flex items-center text-muted-foreground w-full">
            <Search className="mr-3 h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">Search products to feature...</span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border-muted" align="start">
        <Command>
          <CommandInput placeholder="Search by name, SKU, or brand..." value={search} onValueChange={setSearch} className="h-11" />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm">No products found.</CommandEmpty>
            <CommandGroup heading="Available Products">
              {filtered.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name + ' ' + product.sku}
                  onSelect={(currentValue) => {
                    onSelectProduct(product);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="flex items-center py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="h-12 w-12 rounded-md border bg-muted mr-4 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <span className="font-medium text-sm truncate">{product.name}</span>
                    <div className="flex items-center mt-1 gap-2 text-xs text-muted-foreground truncate">
                      <span>{product.sku}</span>
                      <span>•</span>
                      <span className="font-medium text-foreground">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {product.stock <= 0 ? (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Out of stock</Badge>
                    ) : product.status !== 'ACTIVE' ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">Disabled</Badge>
                    ) : product.stock <= 5 ? (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0 hover:bg-yellow-200">Low Stock</Badge>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
