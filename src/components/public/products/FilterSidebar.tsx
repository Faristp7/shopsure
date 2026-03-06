import React from 'react';
import { productCategories, productBrands, productColors, productFeatures } from '@/data/productListingMockData';

export const FilterSidebar: React.FC = () => {
    return (
        <aside className="w-full lg:w-64 shrink-0 space-y-8 font-display hidden lg:block">
            {/* Categories */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-primary text-xl">category</span>
                    Categories
                </h3>
                <div className="space-y-2">
                    {productCategories.map((category, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input defaultChecked={category.checked} className="h-5 w-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" type="checkbox" />
                            <span className="text-sm font-medium group-hover:text-brand-primary">{category.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-primary text-xl">brand_family</span>
                    Brand
                </h3>
                <div className="space-y-2">
                    {productBrands.map((brand, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input defaultChecked={brand.checked} className="h-5 w-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" type="checkbox" />
                            <span className="text-sm font-medium group-hover:text-brand-primary">{brand.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-primary text-xl">payments</span>
                    Price Range
                </h3>
                <div className="px-2">
                    <input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary" max="1000" min="0" step="50" type="range" />
                    <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
                        <span>$0</span>
                        <span>$1000+</span>
                    </div>
                </div>
            </div>

            {/* Ratings */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-primary text-xl">star</span>
                    Ratings
                </h3>
                <div className="space-y-2">
                    <button className="flex items-center gap-2 text-sm hover:text-brand-primary transition-colors">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4].map((star) => (
                                <span key={star} className="material-symbols-outlined fill-1 text-sm">star</span>
                            ))}
                            <span className="material-symbols-outlined text-sm">star</span>
                        </div>
                        <span className="font-medium">&amp; Up</span>
                    </button>
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-primary text-xl">palette</span>
                    Color
                </h3>
                <div className="flex flex-wrap gap-3">
                    {productColors.map((color, idx) => (
                        <button key={idx} className={`w-6 h-6 rounded-full ${color.class} ring-2 ring-offset-2 ring-transparent hover:ring-brand-primary`} aria-label={color.name}></button>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-primary text-xl">settings</span>
                    Features
                </h3>
                <div className="space-y-2">
                    {productFeatures.map((feature, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input defaultChecked={feature.checked} className="h-5 w-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" type="checkbox" />
                            <span className="text-sm font-medium group-hover:text-brand-primary">{feature.label}</span>
                        </label>
                    ))}
                </div>
            </div>

        </aside>
    );
};
