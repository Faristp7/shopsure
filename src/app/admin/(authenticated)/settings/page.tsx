"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ModeToggle } from "@/components/mode-toggle"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>
            <Tabs defaultValue="appearance" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Details</CardTitle>
                            <CardDescription>
                                Manage your store name and contact details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="store-name">Store Name</Label>
                                <Input id="store-name" defaultValue="ShopSure" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store-email">Contact Email</Label>
                                <Input id="store-email" defaultValue="admin@shopsure.com" />
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme & Appearance</CardTitle>
                            <CardDescription>
                                Customize the look and feel of the admin dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base">Dark Mode</Label>
                                    <ModeToggle />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Switch between light and dark themes.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>
                                Configure what emails you receive.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="new-orders" className="flex flex-col space-y-1">
                                    <span>New Orders</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Receive emails when a new order is placed.
                                    </span>
                                </Label>
                                <Switch id="new-orders" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="low-stock" className="flex flex-col space-y-1">
                                    <span>Low Stock Alerts</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Get notified when products are running low.
                                    </span>
                                </Label>
                                <Switch id="low-stock" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
