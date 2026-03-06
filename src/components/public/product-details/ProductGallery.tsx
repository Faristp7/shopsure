import React from 'react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Main Image (Desktop & Mobile) */}
            <div className="relative aspect-square w-full bg-white dark:bg-slate-800 lg:rounded-2xl overflow-hidden shadow-sm lg:border border-slate-200 dark:border-slate-800 group">
                <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={productName}
                    src={images[0]}
                />
                {/* Desktop Favorite Button */}
                <div className="hidden lg:block absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg z-10">
                    <span className="material-symbols-outlined text-slate-400 hover:text-red-500 cursor-pointer transition-colors">favorite</span>
                </div>

                {/* Mobile Pagination Dots */}
                <div className="lg:hidden flex justify-center gap-2 p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent z-10">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                </div>
            </div>

            {/* Thumbnails (Desktop Only) */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((img, index) => (
                    <div
                        key={index}
                        className={`aspect-square bg-white dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer ${index === 0
                            ? 'border-2 border-primary ring-2 ring-primary/10'
                            : 'border border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 transition-opacity'
                            }`}
                    >
                        <img className="w-full h-full object-cover" alt={`${productName} view ${index + 1}`} src={img} />
                    </div>
                ))}
            </div>
        </div>
    );
};
