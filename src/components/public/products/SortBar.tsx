import React from 'react';

export const SortBar: React.FC = () => {
    return (
        <div className="sticky top-16 z-40 bg-slate-50 dark:bg-slate-950 py-3 md:py-0 md:bg-transparent md:static border-b border-slate-200 dark:border-slate-800 md:border-none flex flex-col md:flex-row md:items-baseline justify-between mb-6 md:mb-8 gap-4 font-display transition-colors duration-300">
            <div className="hidden md:block">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Premium Headphones</h1>
                <p className="text-slate-500">Experience crystal clear audio with our top-rated selection.</p>
            </div>

            {/* Mobile Title block */}
            <div className="flex items-baseline gap-3 md:hidden">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Headphones</h1>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">(128 items)</span>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                {/* Mobile Filter Button */}
                <button className="md:hidden flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-sm shadow-sm transition-colors hover:border-brand-primary">
                    <span className="material-symbols-outlined text-lg">tune</span>
                    Filter
                </button>

                <div className="flex items-center gap-2 md:gap-4">
                    <span className="hidden sm:inline text-sm font-medium text-slate-500">Sort by:</span>
                    <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-4 pr-10 text-sm font-semibold focus:border-brand-primary focus:ring-0 outline-none cursor-pointer">
                        <option>Newest Arrivals</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Most Popular</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
