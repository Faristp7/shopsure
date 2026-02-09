'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertCircle } from "lucide-react"

const pendingProducts = [
    {
        id: "PROD-101",
        name: "Wireless Gaming Headphones",
        seller: "TechWorld Inc.",
        price: "$129.99",
        category: "Electronics",
        image: "https://placehold.co/400x300?text=Headphones"
    },
    {
        id: "PROD-102",
        name: "Leather Crossbody Bag",
        seller: "Fashion Hub",
        price: "$89.50",
        category: "Fashion",
        image: "https://placehold.co/400x300?text=Bag"
    },
    {
        id: "PROD-103",
        name: "Smart Watch Series 5",
        seller: "TechWorld Inc.",
        price: "$299.00",
        category: "Electronics",
        image: "https://placehold.co/400x300?text=Watch"
    },
    {
        id: "PROD-104",
        name: "Organic Face Cream",
        seller: "BeautyPlus",
        price: "$24.00",
        category: "Beauty",
        image: "https://placehold.co/400x300?text=Cream"
    }
]

export default function AdminProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Product Moderation</h2>
                    <p className="text-muted-foreground">Review and approve new product listings.</p>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList>
                    <TabsTrigger value="pending">Pending Review <Badge variant="secondary" className="ml-2">4</Badge></TabsTrigger>
                    <TabsTrigger value="flagged">Flagged Items</TabsTrigger>
                    <TabsTrigger value="all">All Products</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pendingProducts.map((product) => (
                            <Card key={product.id} className="overflow-hidden">
                                <div className="aspect-video w-full bg-muted relative">
                                    {/* Placeholder for actual image component */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                                        Product Image
                                    </div>
                                </div>
                                <CardHeader className="p-4">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline">{product.category}</Badge>
                                        <span className="font-bold">{product.price}</span>
                                    </div>
                                    <CardTitle className="text-lg mt-2">{product.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">by {product.seller}</p>
                                </CardHeader>
                                <CardFooter className="p-4 pt-0 gap-2">
                                    <Button className="w-full bg-green-600 hover:bg-green-700">
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                    <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="flagged">
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-lg border-dashed">
                        <AlertCircle className="h-10 w-10 mb-4" />
                        <p>No flagged items at the moment.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
