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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminCouponsPage() {
  return (
    <AdminSectionShell
      title="Coupons"
      description="Percentage or fixed discounts, usage limits, and eligibility rules."
    >
      <Card>
        <CardHeader>
          <CardTitle>Create coupon</CardTitle>
          <CardDescription>
            Codes apply at checkout when rules match the cart.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" placeholder="SPRING20" className="font-mono uppercase" />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select defaultValue="percent">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percentage off</SelectItem>
                <SelectItem value="fixed">Fixed amount</SelectItem>
                <SelectItem value="shipping">Free shipping</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input id="value" type="number" min={0} placeholder="20" />
          </div>
          <Button type="button">Create coupon</Button>
        </CardContent>
      </Card>
      <AdminPlaceholderCard
        cardTitle="Existing coupons"
        cardDescription="Search, edit, and retire codes — table will list live data from the API."
      />
    </AdminSectionShell>
  )
}
