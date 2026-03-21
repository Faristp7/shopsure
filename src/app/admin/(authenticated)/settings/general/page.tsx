"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"

export default function AdminSettingsGeneralPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Site settings</h3>
        <p className="text-sm text-muted-foreground">
          General platform identity, contact details, and admin appearance.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Store details</CardTitle>
          <CardDescription>
            Manage your store name and contact details shown across the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store name</Label>
            <Input id="store-name" defaultValue="ShopSure" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-email">Contact email</Label>
            <Input id="store-email" defaultValue="admin@shopsure.com" />
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Admin appearance</CardTitle>
          <CardDescription>
            Customize the look of this dashboard for your team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Dark mode</Label>
            <ModeToggle />
          </div>
          <p className="text-sm text-muted-foreground">
            Switch between light and dark themes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
