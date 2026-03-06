import React from 'react';
import { MarketplaceHeader } from '../MarketplaceHeader';
import { MarketplaceFooter } from '../MarketplaceFooter';
import { FilterSidebar } from './FilterSidebar';
import { SortBar } from './SortBar';
import { ProductGrid } from './ProductGrid';
import { Pagination } from './Pagination';

export const ProductListingPage: React.FC = () => {
    return (
        <div className="relative flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <MarketplaceHeader />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-500">
                    <a className="hover:text-brand-primary" href="#">Home</a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <a className="hover:text-brand-primary" href="#">Audio</a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-200">Headphones</span>
                </nav>

                <SortBar />

                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterSidebar />

                    <div className="flex-1">
                        <ProductGrid />
                        <Pagination />
                    </div>
                </div>
            </main>

            <MarketplaceFooter />
        </div>
    );
};
