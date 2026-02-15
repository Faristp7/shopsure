"use client";

import ProductForm from "@/components/products/ProductForm";

export default function AddProductPage() {
    const handleSubmit = async () => {
        // In a real app, this would be an API call
        console.log("Submitting new product:");
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    return (
       <ProductForm />
    );
}
