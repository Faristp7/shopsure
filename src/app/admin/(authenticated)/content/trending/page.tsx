"use client"

import { AdminPlaceholderCard, AdminSectionShell } from "@/components/admin/admin-section-shell"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminTrendingProductsPage() {
  return (
    <AdminSectionShell
      title="Trending products"
      description="Control how “trending” is computed and what appears in the module."
    >
      <Card>
        <CardHeader>
          <CardTitle>Signals</CardTitle>
          <CardDescription>
            Blend sales velocity, views, and manual boosts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="sig-sales" className="flex flex-col gap-1">
              <span>Sales velocity</span>
              <span className="font-normal text-muted-foreground text-sm">
                Weight recent purchase volume.
              </span>
            </Label>
            <Switch id="sig-sales" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="sig-views" className="flex flex-col gap-1">
              <span>Page views</span>
              <span className="font-normal text-muted-foreground text-sm">
                Surface products gaining attention.
              </span>
            </Label>
            <Switch id="sig-views" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="sig-boost" className="flex flex-col gap-1">
              <span>Manual boost</span>
              <span className="font-normal text-muted-foreground text-sm">
                Allow merchandising to pin candidates.
              </span>
            </Label>
            <Switch id="sig-boost" />
          </div>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Preview"
        cardDescription="Live preview of the trending rail with current ranking logic."
      />
    </AdminSectionShell>
  )
}
