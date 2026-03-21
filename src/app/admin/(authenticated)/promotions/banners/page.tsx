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

export default function AdminBannersPage() {
  return (
    <AdminSectionShell
      title="Banners"
      description="Hero and carousel placements for campaigns across the storefront."
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Homepage hero</CardTitle>
            <CardDescription>
              Primary slot above the fold — image, link, and schedule.
            </CardDescription>
          </div>
          <Button type="button" size="sm" variant="secondary">
            Add slot
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Headline</Label>
            <Input id="hero-title" placeholder="Spring sale" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-url">Destination URL</Label>
            <Input id="hero-url" placeholder="/deals/spring" />
          </div>
          <Button type="button">Save draft</Button>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Carousel & secondary strips"
        cardDescription="Additional banner rows and category strips will be managed here."
      />
    </AdminSectionShell>
  )
}
