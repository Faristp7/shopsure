"use client"

import { AdminSectionShell } from "@/components/admin/admin-section-shell"
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

export default function AdminSettingsCommissionPage() {
  return (
    <AdminSectionShell
      title="Commission %"
      description="Set platform take rates by category or default for all sellers."
    >
      <Card>
        <CardHeader>
          <CardTitle>Default commission</CardTitle>
          <CardDescription>
            Applied when no category-specific rule matches.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="default-rate">Platform fee (%)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="default-rate"
                type="number"
                min={0}
                max={100}
                step={0.1}
                defaultValue={10}
                className="tabular-nums"
              />
              <span className="text-sm text-muted-foreground shrink-0">%</span>
            </div>
          </div>
          <Button type="button">Update default</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Category overrides</CardTitle>
          <CardDescription>
            Optional per-category commission — table wiring comes next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add category-specific rates once categories are linked to commission rules in the API.
          </p>
        </CardContent>
      </Card>
    </AdminSectionShell>
  )
}
