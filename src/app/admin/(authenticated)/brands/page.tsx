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

export default function AdminBrandsPage() {
  return (
    <AdminSectionShell
      title="Brands"
      description="Official brand pages, logos, and which sellers may list under each brand."
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Directory</CardTitle>
            <CardDescription>
              Search and edit brand records synced from sellers and admins.
            </CardDescription>
          </div>
          <Button type="button" size="sm">
            Add brand
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input placeholder="Search brands…" className="max-w-sm" />
            <Button type="button" variant="secondary" size="sm" className="shrink-0">
              Filter
            </Button>
          </div>
          <div className="mt-6 rounded-lg border bg-muted/30 px-4 py-12 text-center text-sm text-muted-foreground">
            Brand table will load from the API — logos, slugs, and verification status.
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick create</CardTitle>
          <CardDescription>
            Minimal fields for prototyping — expand with legal name and assets later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Display name</Label>
            <Input id="brand-name" placeholder="Acme Co." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-slug">URL slug</Label>
            <Input id="brand-slug" placeholder="acme-co" className="font-mono" />
          </div>
          <Button type="button" variant="secondary">
            Save draft
          </Button>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Brand ↔ seller mapping"
        cardDescription="Approve which seller accounts may attach products to each brand."
      />
    </AdminSectionShell>
  )
}
