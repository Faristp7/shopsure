"use client"

import { AdminSectionShell } from "@/components/admin/admin-section-shell"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminSettingsFeaturesPage() {
  return (
    <AdminSectionShell
      title="Feature toggles"
      description="Turn marketplace capabilities on or off without deploying."
    >
      <Card>
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
          <CardDescription>
            Core buyer and seller experiences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="feat-checkout" className="flex flex-col gap-1">
              <span>Checkout</span>
              <span className="font-normal text-muted-foreground text-sm">
                Allow new orders when enabled.
              </span>
            </Label>
            <Switch id="feat-checkout" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="feat-seller-apply" className="flex flex-col gap-1">
              <span>Seller applications</span>
              <span className="font-normal text-muted-foreground text-sm">
                Let new sellers request access.
              </span>
            </Label>
            <Switch id="feat-seller-apply" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="feat-reviews" className="flex flex-col gap-1">
              <span>Product reviews</span>
              <span className="font-normal text-muted-foreground text-sm">
                Show ratings and written reviews on listings.
              </span>
            </Label>
            <Switch id="feat-reviews" defaultChecked />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Discovery</CardTitle>
          <CardDescription>
            Homepage and search modules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="feat-flash" className="flex flex-col gap-1">
              <span>Flash deals module</span>
              <span className="font-normal text-muted-foreground text-sm">
                Surface time-limited offers on the storefront.
              </span>
            </Label>
            <Switch id="feat-flash" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="feat-brands" className="flex flex-col gap-1">
              <span>Brand directory</span>
              <span className="font-normal text-muted-foreground text-sm">
                Public brand pages and filters.
              </span>
            </Label>
            <Switch id="feat-brands" />
          </div>
        </CardContent>
      </Card>
    </AdminSectionShell>
  )
}
