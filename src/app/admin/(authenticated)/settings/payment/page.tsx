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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPaymentPage() {
  return (
    <AdminSectionShell
      title="Payment config"
      description="Configure gateways, settlement preferences, and payout rules."
    >
      <Card>
        <CardHeader>
          <CardTitle>Gateways</CardTitle>
          <CardDescription>
            Enable payment methods available to buyers at checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="card-payments" className="flex flex-col gap-1">
              <span>Cards (Stripe / Razorpay)</span>
              <span className="font-normal text-muted-foreground text-sm">
                Credit and debit card processing.
              </span>
            </Label>
            <Switch id="card-payments" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="upi" className="flex flex-col gap-1">
              <span>UPI</span>
              <span className="font-normal text-muted-foreground text-sm">
                Instant bank transfers via UPI apps.
              </span>
            </Label>
            <Switch id="upi" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="cod" className="flex flex-col gap-1">
              <span>Cash on delivery</span>
              <span className="font-normal text-muted-foreground text-sm">
                Allow COD where logistics supports it.
              </span>
            </Label>
            <Switch id="cod" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Provider credentials</CardTitle>
          <CardDescription>
            Placeholder fields — wire to your secrets store in production.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="pub-key">Publishable key</Label>
            <Input id="pub-key" placeholder="pk_live_…" autoComplete="off" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-secret">Webhook secret</Label>
            <Input id="webhook-secret" type="password" placeholder="whsec_…" />
          </div>
          <Button variant="secondary" type="button">
            Save payment settings
          </Button>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Settlement & payouts"
        cardDescription="Automated seller payouts and hold periods will appear here."
      />
    </AdminSectionShell>
  )
}
