"use client";

import { useState, useEffect } from "react";
import ProductForm from "@/components/products/ProductForm";
import { use } from "react";

// Mock data (same as in product list page)
// In a real app, this would be fetched from an API
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: string;
    image: string;
    category: string;
    description: string;
}

const mockProducts: Product[] = [
    {
        id: "1",
        name: "Handwoven Silk Saree",
        price: 4500,
        stock: 12,
        status: "Active",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Ethnic Wear",
        description: "A beautiful handwoven silk saree with intricate designs."
    },
    {
        id: "2",
        name: "Vintage Silver Earrings",
        price: 899,
        stock: 0,
        status: "Out of Stock",
        image: "https://images.unsplash.com/photo-1535633302703-d02a41cebb41?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Jewellery",
        description: "Classic vintage silver earrings perfect for any occasion."
    },
    {
        id: "3",
        name: "Minimalist Ceramic Vase",
        price: 1250,
        stock: 5,
        status: "Draft",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Home Decor",
        description: "Elegant minimalist ceramic vase for modern homes."
    }
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const fetchProduct = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
            const foundProduct = mockProducts.find(p => p.id === id);
            setProduct(foundProduct || null);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async () => {
        // In a real app, this would be an API call
        // console.log("Updating product:", { id, ...data });
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8 flex items-center justify-center">
                <p className="text-slate-500">Loading product details...</p>
            </div>
        );
    }

    return (
       <ProductForm />
    );
}
