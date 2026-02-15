"use client";

import { useState } from "react";
import {
    Package,
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Filter,
    ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: "Active" | "Out of Stock" | "Draft";
    image: string;
    category: string;
}

const mockProducts: Product[] = [
    {
        id: "1",
        name: "Handwoven Silk Saree",
        price: 4500,
        stock: 12,
        status: "Active",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Ethnic Wear"
    },
    {
        id: "2",
        name: "Vintage Silver Earrings",
        price: 899,
        stock: 0,
        status: "Out of Stock",
        image: "https://images.unsplash.com/photo-1535633302703-d02a41cebb41?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Jewellery"
    },
    {
        id: "3",
        name: "Minimalist Ceramic Vase",
        price: 1250,
        stock: 5,
        status: "Draft",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Home Decor"
    }
];

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
        // toast({
        //   title: "Product deleted",
        //   description: "The product has been removed from your catalog.",
        // });
    };

    const toggleStatus = (id: string) => {
        setProducts(products.map(p => {
            if (p.id === id) {
                return { ...p, status: p.status === "Active" ? "Draft" : "Active" };
            }
            return p;
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
                        <p className="text-slate-500">Manage your items, stock, and visibility.</p>
                    </div>
                    <Link href="/seller/products/add">
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-5 w-5" /> Add New Product
                        </Button>
                    </Link>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-slate-900">{products.length}</div>
                            <div className="text-sm text-slate-500 font-medium">Total Products</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">
                                {products.filter(p => p.status === "Active").length}
                            </div>
                            <div className="text-sm text-slate-500 font-medium">Active</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-red-600">
                                {products.filter(p => p.stock === 0).length}
                            </div>
                            <div className="text-sm text-slate-500 font-medium">Out of Stock</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-orange-500">
                                {products.filter(p => p.status === "Draft").length}
                            </div>
                            <div className="text-sm text-slate-500 font-medium">Drafts</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="bg-white border-0 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9 h-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-10">
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                            <Button variant="outline" size="sm" className="h-10">
                                <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
                            </Button>
                        </div>
                    </div>

                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="w-[100px]">Product</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50 border-slate-100">
                                    <TableCell>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-12 w-12 rounded-lg object-cover border border-slate-100 shadow-sm"
                                        />
                                    </TableCell>
                                    <TableCell className="font-semibold text-slate-900">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{product.category}</TableCell>
                                    <TableCell className="font-medium">₹{product.price}</TableCell>
                                    <TableCell>
                                        <span className={product.stock === 0 ? "text-red-600 font-bold" : "text-slate-600"}>
                                            {product.stock} units
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                product.status === "Active" ? "default" :
                                                    product.status === "Draft" ? "secondary" : "destructive"
                                            }
                                            className="rounded-full px-3 py-0.5 font-semibold"
                                        >
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <Link href={`/seller/products/edit/${product.id}`} className="w-full">
                                                    <DropdownMenuItem>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem onClick={() => toggleStatus(product.id)}>
                                                    {product.status === "Active" ? (
                                                        <><EyeOff className="mr-2 h-4 w-4" /> Deactivate</>
                                                    ) : (
                                                        <><Eye className="mr-2 h-4 w-4" /> Activate</>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    onClick={() => deleteProduct(product.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                        No products found. Start by adding one!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
