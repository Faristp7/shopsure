"use client"

import * as React from "react"
import Image from "next/image"
import { format, isAfter, isBefore } from "date-fns"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  GripVertical,
  MousePointerClick,
  PackageSearch,
  Save,
  Search,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { AdminSectionShell } from "@/components/admin/admin-section-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// --- Mock Data & Types ---
type ProductStatus = "active" | "disabled"
type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

interface Product {
  id: string
  name: string
  sku: string
  brand: string
  price: number
  image: string
  status: ProductStatus
  stockStatus: StockStatus
}

interface FeaturedProduct extends Product {
  startDate?: Date
  endDate?: Date
}

const MOCK_DB_PRODUCTS: Product[] = [
  { id: "p1", name: "Premium Wireless Headphones", sku: "AUD-WH-01", brand: "Sony", price: 299.99, image: "https://placehold.co/100x100/f3f4f6/a1a1aa.png?text=Audio", status: "active", stockStatus: "in_stock" },
  { id: "p2", name: "Ergonomic Office Chair", sku: "FUR-OC-02", brand: "Herman Miller", price: 999.00, image: "https://placehold.co/100x100/f3f4f6/a1a1aa.png?text=Chair", status: "active", stockStatus: "low_stock" },
  { id: "p3", name: "Mechanical Keyboard", sku: "PER-MK-03", brand: "Keychron", price: 149.50, image: "https://placehold.co/100x100/f3f4f6/a1a1aa.png?text=Keyb", status: "active", stockStatus: "out_of_stock" },
  { id: "p4", name: "Gaming Mouse", sku: "PER-GM-04", brand: "Logitech", price: 79.99, image: "https://placehold.co/100x100/f3f4f6/a1a1aa.png?text=Mouse", status: "disabled", stockStatus: "in_stock" },
  { id: "p5", name: "4K Monitor", sku: "DIS-4K-05", brand: "Dell", price: 450.00, image: "https://placehold.co/100x100/f3f4f6/a1a1aa.png?text=4K", status: "active", stockStatus: "in_stock" },
  { id: "p6", name: "Smart Watch Series 8", sku: "WEA-SW-06", brand: "Apple", price: 399.00, image: "https://placehold.co/100x100/f3f4f6/a1a1aa.png?text=Watch", status: "active", stockStatus: "in_stock" }
]

// --- Helper Functions ---
function getScheduleStatus(startDate?: Date, endDate?: Date) {
  const now = new Date()
  if (!startDate && !endDate) return "active"
  
  if (startDate && isBefore(now, startDate)) return "scheduled"
  if (endDate && isAfter(now, endDate)) return "expired"
  return "active"
}

// --- Sortable Item Component ---
function SortableProductCard({
  product,
  onRemove,
  onUpdateDates,
}: {
  product: FeaturedProduct
  onRemove: (id: string) => void
  onUpdateDates: (id: string, start?: Date, end?: Date) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.9 : 1,
  }

  const scheduleStatus = getScheduleStatus(product.startDate, product.endDate)
  const hasWarning = product.stockStatus === "out_of_stock" || product.status === "disabled"

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative group bg-white dark:bg-zinc-950 transition-all shadow-sm hover:shadow-md",
        isDragging && "shadow-lg ring-2 ring-primary/20",
        hasWarning && "border-amber-200 dark:border-amber-900"
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
        {/* Drag Handle */}
        <button
          className="text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing self-center sm:self-auto p-1 -ml-2"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Product Info */}
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
            <Image fill src={product.image} alt={product.name} className="object-cover" />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{product.name}</span>
              {scheduleStatus === "scheduled" && <Badge variant="secondary" className="text-[10px] uppercase h-5 font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Scheduled</Badge>}
              {scheduleStatus === "expired" && <Badge variant="secondary" className="text-[10px] uppercase h-5 font-semibold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">Expired</Badge>}
              {scheduleStatus === "active" && (product.startDate || product.endDate) && (
                <Badge variant="secondary" className="text-[10px] uppercase h-5 font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Live</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="truncate">{product.sku}</span>
              <span>•</span>
              <span className="font-medium text-foreground">${product.price.toFixed(2)}</span>
            </div>
            
            {/* Badges/Warnings Flow */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {product.stockStatus === "in_stock" && <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-900">In Stock</Badge>}
              {product.stockStatus === "low_stock" && <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900">Low Stock</Badge>}
              {product.stockStatus === "out_of_stock" && <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/40">Out of Stock</Badge>}
              {product.status === "disabled" && <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400">Disabled</Badge>}
            </div>
          </div>
        </div>

        {/* Scheduling & Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0 pl-7 sm:pl-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn(
                "h-8 gap-2 border-dashed",
                (product.startDate || product.endDate) && "border-solid border-primary/20 bg-primary/5 hover:bg-primary/10"
              )}>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                {product.startDate || product.endDate ? (
                  <span className="text-xs">
                    {product.startDate ? format(product.startDate, "MMM d") : "Now"} -{" "}
                    {product.endDate ? format(product.endDate, "MMM d") : "Forever"}
                  </span>
                ) : (
                  <span className="text-xs">Schedule</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Calendar
                    mode="single"
                    selected={product.startDate}
                    onSelect={(date) => onUpdateDates(product.id, date, product.endDate)}
                    initialFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Calendar
                    mode="single"
                    selected={product.endDate}
                    onSelect={(date) => onUpdateDates(product.id, product.startDate, date)}
                  />
                </div>
              </div>
              {(product.startDate || product.endDate) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 text-muted-foreground"
                  onClick={() => onUpdateDates(product.id, undefined, undefined)}
                >
                  Clear Schedule
                </Button>
              )}
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// --- Main Page Component ---
export default function AdminFeaturedProductsPage() {
  const [mode, setMode] = React.useState<"manual" | "auto">("manual")
  const [featuredItems, setFeaturedItems] = React.useState<FeaturedProduct[]>([])
  const [autoRule, setAutoRule] = React.useState("top_selling")
  const [searchOpen, setSearchOpen] = React.useState(false)

  // DND Setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setFeaturedItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Actions
  const handleAddProduct = (product: Product) => {
    if (!featuredItems.some((i) => i.id === product.id)) {
      setFeaturedItems([...featuredItems, { ...product }])
    }
    setSearchOpen(false)
  }

  const handleRemoveProduct = (id: string) => {
    setFeaturedItems(featuredItems.filter((i) => i.id !== id))
  }

  const handleUpdateDates = (id: string, startDate?: Date, endDate?: Date) => {
    setFeaturedItems(featuredItems.map(item => 
      item.id === id ? { ...item, startDate, endDate } : item
    ))
  }

  const availableProducts = MOCK_DB_PRODUCTS.filter(p => !featuredItems.some(f => f.id === p.id))
  const hasWarnings = featuredItems.some(i => i.stockStatus === "out_of_stock" || i.status === "disabled")

  return (
    <AdminSectionShell
      title="Featured products"
      description="Curate the homepage and category spotlight rails to highlight key merchandise."
    >
      <div className="grid gap-6">
        {/* Mode Selector */}
        <Tabs defaultValue="manual" value={mode} onValueChange={(v) => setMode(v as "manual" | "auto")} className="w-full">
          <TabsList className="grid w-full max-w-sm grid-cols-2">
            <TabsTrigger value="manual" className="flex gap-2">
              <MousePointerClick className="h-4 w-4" />
              Manual Selection
            </TabsTrigger>
            <TabsTrigger value="auto" className="flex gap-2">
              <Star className="h-4 w-4" />
              Auto Mode
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "manual" ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Spotlight rail</CardTitle>
                <CardDescription>
                  Search and select products to pin to your homepage rail. Drag to reorder.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Product Picker */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={searchOpen}
                          className="w-full justify-between h-12 text-muted-foreground font-normal hover:bg-background"
                        >
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Search products by name, SKU, or brand...
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Type a product name or SKU..." />
                          <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup heading="Available Products">
                              {availableProducts?.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={`${product.name} ${product.sku} ${product.brand}`}
                                  onSelect={() => handleAddProduct(product)}
                                  className="flex items-center gap-3 py-3 cursor-pointer"
                                >
                                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-muted">
                                    <Image fill src={product.image} alt={product.name} className="object-cover" />
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    <span className="font-medium text-sm">{product.name}</span>
                                    <span className="text-xs text-muted-foreground">{product.sku}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {product.stockStatus === "out_of_stock" && (
                                      <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">OOS</Badge>
                                    )}
                                    <span className="font-medium text-sm">${product.price.toFixed(2)}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Validation Warnings */}
                {hasWarnings && (
                  <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Review Needed</AlertTitle>
                    <AlertDescription>
                      Some products in your rail are out of stock or disabled. They will not be visible to customers.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Featured Rail Content */}
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border p-4">
                  {featuredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="h-20 w-20 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-4">
                        <PackageSearch className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">No featured products added</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Use the search input above to add products to your spotlight rail. You can schedule and reorder them anytime.
                      </p>
                    </div>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={featuredItems} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-3">
                          {featuredItems.map((product) => (
                            <SortableProductCard
                              key={product.id}
                              product={product}
                              onRemove={handleRemoveProduct}
                              onUpdateDates={handleUpdateDates}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Automated rules</CardTitle>
                <CardDescription>
                  Let the system dynamically select featured products based on shopper behavior.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Selection Rule</Label>
                    <Select value={autoRule} onValueChange={setAutoRule}>
                      <SelectTrigger className="h-12 bg-white dark:bg-zinc-950">
                        <SelectValue placeholder="Select a rule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top_selling">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span>Top Selling (Last 30 days)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="most_viewed">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-primary" />
                            <span>Most Viewed Products</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="highest_rated">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-primary" />
                            <span>Highest Rated (4+ Stars)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="recently_added">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>Recently Added</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/50 mt-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Auto-sync active</AlertTitle>
                    <AlertDescription>
                      The rail will automatically update daily based on {autoRule.replace('_', ' ')} metrics. Manual curation is disabled in this mode.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Global Actions Context Bar */}
        <div className="flex items-center justify-between border-t bg-white dark:bg-zinc-950 p-4 -mx-4 sm:-mx-6 sm:px-6 fixed sm:sticky bottom-0 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <Button variant="ghost" className="hidden sm:flex" disabled={mode === "manual" && featuredItems.length === 0}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview homepage
          </Button>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="outline" className="w-full sm:w-auto">Discard</Button>
            <Button className="w-full sm:w-auto gap-2">
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </AdminSectionShell>
  )
}
