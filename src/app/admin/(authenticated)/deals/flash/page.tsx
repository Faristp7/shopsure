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

export default function AdminFlashDealsPage() {
  return (
    <AdminSectionShell
      title="Flash deals"
      description="Short windows with high urgency — countdowns and stock caps."
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Live flash events</CardTitle>
            <CardDescription>
              Products in an active flash slot and remaining inventory.
            </CardDescription>
          </div>
          <Button type="button" size="sm">
            Schedule flash
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-12 text-center text-sm text-muted-foreground">
            Connect catalog SKUs to flash slots to preview the grid here.
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick slot</CardTitle>
          <CardDescription>
            Minimal form — full editor will support media and tiers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="ends">Ends at</Label>
            <Input id="ends" type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cap">Stock cap</Label>
            <Input id="cap" type="number" min={1} placeholder="100" />
          </div>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Performance"
        cardDescription="CTR, conversion, and sell-through for each flash window."
      />
    </AdminSectionShell>
  )
}
