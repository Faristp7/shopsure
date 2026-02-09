'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, MoreVertical, Plus } from "lucide-react"

const categories = [
    { id: "CAT-1", name: "Electronics", items: 1240 },
    { id: "CAT-2", name: "Fashion", items: 850 },
    { id: "CAT-3", name: "Home & Garden", items: 620 },
    { id: "CAT-4", name: "Beauty & Health", items: 430 },
    { id: "CAT-5", name: "Toys & Hobbies", items: 210 },
    { id: "CAT-6", name: "Books", items: 150 },
]

export default function AdminCategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories & Content</h2>
                    <p className="text-muted-foreground">Manage product categories and site content.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Card key={category.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {category.name}
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Folder className="h-10 w-10 p-2 bg-muted rounded-md" />
                                <div>
                                    <div className="text-2xl font-bold">{category.items}</div>
                                    <p className="text-xs">Products</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Content Management</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Homepage Banner</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-32 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                Current Banner Preview
                            </div>
                            <Button variant="outline" className="w-full">Upload New Banner</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Announcement Bar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Enter announcement text..." defaultValue="Big Sale! Up to 50% off." />
                            <Button className="w-full">Update Text</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
