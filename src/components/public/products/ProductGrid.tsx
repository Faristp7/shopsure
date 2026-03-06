import React from 'react';
import { ProductCard } from './ProductCard';
import { productListings } from '@/data/productListingMockData';

export const ProductGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productListings.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
