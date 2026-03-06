import React from 'react';

export interface ProductCardProps {
    id: string;
    brand: string;
    name: string;
    price: string;
    rating: number;
    reviews: number;
    image: string;
}

export const ProductCard: React.FC<{ product: ProductCardProps }> = ({ product }) => {
    // Helper to render stars based on rating
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        return (
            <div className="flex text-yellow-400">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="material-symbols-outlined fill-1 text-sm">star</span>
                ))}
                {hasHalfStar && <span className="material-symbols-outlined text-sm">star_half</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="material-symbols-outlined text-sm">star</span>
                ))}
            </div>
        );
    };

    return (
        <div className="group relative flex flex-col rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 font-display">
            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-slate-100">
                <img alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" src={product.image} />
                <button className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white text-slate-900 shadow-sm transition-colors">
                    <span className="material-symbols-outlined text-lg">favorite</span>
                </button>
            </div>
            <div className="flex flex-col flex-1">
                <span className="text-[10px] md:text-xs font-bold text-brand-primary uppercase mb-1">{product.brand}</span>
                <h3 className="text-sm md:text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 md:mb-2 line-clamp-1 md:line-clamp-none">{product.name}</h3>

                <div className="flex items-center gap-1 mb-2 md:mb-4">
                    {renderStars(product.rating)}
                    <span className="text-[10px] md:text-xs font-bold text-slate-400">({product.reviews})</span>
                </div>

                <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
                    <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white">{product.price}</span>
                    <button className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg bg-brand-primary/10 md:bg-brand-primary px-3 md:px-4 py-2 text-xs md:text-sm font-bold text-brand-primary hover:text-white md:text-white hover:bg-brand-primary md:hover:bg-brand-primary/90 transition-colors shadow-sm md:shadow-lg md:shadow-brand-primary/20">
                        <span className="material-symbols-outlined text-sm md:text-base">add_shopping_cart</span>
                        <span className="hidden md:inline">Add</span>
                        <span className="md:hidden inline">ADD</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
