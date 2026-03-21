"use client"

import { AdminPlaceholderCard, AdminSectionShell } from "@/components/admin/admin-section-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminFeaturedProductsPage() {
  return (
    <AdminSectionShell
      title="Featured products"
      description="Curate the homepage and category spotlight rails by SKU or collection."
    >
      <Card>
        <CardHeader>
          <CardTitle>Spotlight rail</CardTitle>
          <CardDescription>
            Ordered list — drag-and-drop ordering will use this sequence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="sku">Product ID or SKU</Label>
              <Input id="sku" placeholder="SKU-10042" />
            </div>
            <Button type="button" className="shrink-0">
              Add to rail
            </Button>
          </div>
          <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
            No products pinned yet.
          </div>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Category spotlights"
        cardDescription="Per-category featured sets for landing pages and SEO modules."
      />
    </AdminSectionShell>
  )
}
