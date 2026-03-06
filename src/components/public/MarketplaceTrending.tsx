import React from 'react';
import { categories } from '@/data/marketplaceMockData';

export const MarketplaceTrending: React.FC = () => {
    return (
        <section className="font-display">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-8 uppercase tracking-wider flex items-center justify-between md:justify-start gap-2">
                <div className="flex items-center gap-2">
                    <span className="w-4 md:w-8 h-[2px] bg-brand-primary"></span>
                    Trending Categories
                </div>
                <a className="md:hidden text-brand-primary text-xs font-semibold capitalize tracking-normal" href="#">View All</a>
            </h3>
            <div className="flex md:grid md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {categories.map((cat, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 md:gap-3 group cursor-pointer min-w-[70px] md:min-w-0">
                        <div className="size-16 md:size-24 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-1 group-hover:border-brand-primary transition-colors overflow-hidden">
                            <div
                                className="w-full h-full rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${cat.icon}')` }}
                            ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-primary">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};
