"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  User,
  Store,
  MapPin,
  Lock,
  Bell,
  ShieldAlert,
  Instagram,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { sellerSettingsService } from "@/services/seller-settings.service";

export default function SettingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["seller-settings"],
    queryFn: sellerSettingsService.getSettings,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground">Failed to load settings.</p>
      </div>
    );
  }

  const { brand, pickupAddress } = data!;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your ShopSure account and store preferences
          </p>
        </div>
        <Button className="h-10 px-6 font-bold shadow-lg shadow-primary/10 rounded-xl">
          <Save className="h-4 w-4 mr-2" /> Save All Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Info */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-extrabold uppercase tracking-tight">
                    Brand Information
                  </CardTitle>
                  <CardDescription className="text-[11px] font-medium">
                    This is how your store appears to buyers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Brand Name
                  </Label>
                  <Input
                    defaultValue={brand.brandName}
                    className="h-11 font-bold border-border/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Instagram Handle
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Instagram className="h-4 w-4" />
                    </span>
                    <Input
                      defaultValue={brand.instagramUrl}
                      className="pl-10 h-11 font-bold border-border/60"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Store Biography
                </Label>
                <Textarea
                  defaultValue={brand.brandDescription}
                  placeholder="Tell buyers what makes your brand unique..."
                  className="min-h-[100px] font-medium border-border/60"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Contact Email
                  </Label>
                  <Input
                    defaultValue={brand.publicEmail}
                    className="h-11 font-bold border-border/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Contact Phone
                  </Label>
                  <Input
                    defaultValue={brand.publicPhone}
                    className="h-11 font-bold border-border/60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup Address */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-extrabold uppercase tracking-tight">
                    Pickup Address
                  </CardTitle>
                  <CardDescription className="text-[11px] font-medium">
                    Address where our logistics partners collect orders
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Flat / Building / Street
                </Label>
                <Textarea
                  defaultValue={[pickupAddress.addressLine1, pickupAddress.addressLine2]
                    .filter(Boolean)
                    .join(", ")}
                  className="min-h-[80px] font-bold border-border/60"
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    City
                  </Label>
                  <Input
                    defaultValue={pickupAddress.city}
                    className="h-11 font-bold border-border/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    State
                  </Label>
                  <Input
                    defaultValue={pickupAddress.state}
                    className="h-11 font-bold border-border/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Pincode
                  </Label>
                  <Input
                    defaultValue={pickupAddress.pincode}
                    className="h-11 font-bold border-border/60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-extrabold uppercase tracking-tight">
                    Password & Security
                  </CardTitle>
                  <CardDescription className="text-[11px] font-medium">
                    Update your account credentials
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Current Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-11 font-bold border-border/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-11 font-bold border-border/60"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="font-bold border-border/60 rounded-lg"
              >
                Reset Password via Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-extrabold uppercase tracking-tight">
                    Notifications
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                {
                  label: "New order alerts",
                  desc: "Real-time alerts for sales",
                  default: true,
                },
                {
                  label: "Payout updates",
                  desc: "Settlement confirmations",
                  default: true,
                },
                {
                  label: "Support updates",
                  desc: "Ticket responses",
                  default: true,
                },
                {
                  label: "Marketing",
                  desc: "Promos & announcements",
                  default: false,
                },
              ].map((pref, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/20 border border-border/20 transition-all hover:border-primary/20"
                >
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">
                      {pref.label}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                      {pref.desc}
                    </p>
                  </div>
                  <Switch defaultChecked={pref.default} className="scale-90" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="shadow-sm border-destructive/20 bg-destructive/[0.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive shadow-inner">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <CardTitle className="text-sm font-extrabold uppercase tracking-tight text-destructive">
                  Danger Zone
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                Once you deactivate your store, all products will be unpublished
                and you will no longer receive orders.
              </p>
              <Button
                variant="destructive"
                className="w-full font-bold h-10 rounded-xl shadow-lg shadow-destructive/10 text-xs uppercase tracking-widest"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Deactivate Store
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
