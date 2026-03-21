"use client"

import { AdminPlaceholderCard, AdminSectionShell } from "@/components/admin/admin-section-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminCampaignsPage() {
  return (
    <AdminSectionShell
      title="Campaigns"
      description="Named marketing campaigns with date ranges and linked creatives."
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Active & upcoming</CardTitle>
            <CardDescription>
              Overview of campaigns driving banners, coupons, and deals.
            </CardDescription>
          </div>
          <Button type="button" size="sm">
            New campaign
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
            No campaigns yet — create one to tie promotions together.
          </div>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Campaign analytics"
        cardDescription="Impressions, clicks, and attributed revenue will appear here."
      />
    </AdminSectionShell>
  )
}
