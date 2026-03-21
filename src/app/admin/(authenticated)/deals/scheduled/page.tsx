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

export default function AdminScheduledDealsPage() {
  return (
    <AdminSectionShell
      title="Scheduled deals"
      description="Plan price drops and visibility ahead of time — no midnight deploys."
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Upcoming deal windows across categories and brands.
            </CardDescription>
          </div>
          <Button type="button" size="sm" variant="secondary">
            Plan deal
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 px-4 py-12 text-center text-sm text-muted-foreground">
            Calendar view will show overlapping schedules and conflicts.
          </div>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Approval workflow"
        cardDescription="Optional review steps before deals go live — configure roles here."
      />
    </AdminSectionShell>
  )
}
