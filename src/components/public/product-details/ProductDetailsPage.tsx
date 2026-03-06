import React from 'react';
import { MarketplaceHeader } from '../MarketplaceHeader';
import { MarketplaceFooter } from '../MarketplaceFooter';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductDescription } from './ProductDescription';
import { ProductReviews } from './ProductReviews';
import { SimilarProducts } from './SimilarProducts';
import { productDetails } from '@/data/productDetailsMockData';

export const ProductDetailsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 pb-20 lg:pb-0">
            {/* Main Desktop Header, hidden somewhat natively or replaced with simpler mobile header here */}
            <div className="hidden lg:block">
                <MarketplaceHeader />
            </div>

            {/* Mobile simplified header */}
            <header className="lg:hidden sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <span className="material-symbols-outlined block text-slate-700 dark:text-slate-300">arrow_back</span>
                    </button>
                    <h2 className="text-lg font-bold truncate px-4">{productDetails.name}</h2>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined block text-slate-700 dark:text-slate-300">share</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined block text-slate-700 dark:text-slate-300">favorite</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-0 lg:px-8 py-0 lg:py-6">

                {/* Desktop Breadcrumbs */}
                <nav className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 px-4 lg:px-0">
                    <a className="hover:text-primary transition-colors" href="/">Home</a>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <a className="hover:text-primary transition-colors" href="/products">Electronics</a>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <a className="hover:text-primary transition-colors" href="/products">Headphones</a>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-100">{productDetails.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">

                    {/* Left Column (Gallery) */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <ProductGallery images={productDetails.images} productName={productDetails.name} />
                    </div>

                    {/* Right Column (Info) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 px-4 lg:px-0 mt-6 lg:mt-0">
                        <ProductInfo product={productDetails} />
                    </div>
                </div>

                <div className="px-4 lg:px-0">
                    {/* Product Description */}
                    <ProductDescription description={productDetails.detailedDescription} />

                    {/* Reviews */}
                    <ProductReviews summary={productDetails.reviewsSummary} reviews={productDetails.reviewsList} />

                    {/* Similar Products */}
                    <SimilarProducts products={productDetails.similarProducts} />
                </div>

            </main>

            {/* Desktop Footer */}
            <div className="hidden lg:block mt-20">
                <MarketplaceFooter />
            </div>

            {/* Mobile Fixed Bottom Action Bar */}
            <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 z-50 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <div className="max-w-screen-xl mx-auto flex gap-4">
                    <button className="flex-1 h-14 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        Add to Cart
                    </button>
                    <button className="flex-1 h-14 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">bolt</span>
                        Buy Now
                    </button>
                </div>
            </footer>
        </div>
    );
};
