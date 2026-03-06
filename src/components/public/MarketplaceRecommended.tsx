import React from 'react';
import { recommended } from '@/data/marketplaceMockData';

export const MarketplaceRecommended: React.FC = () => {
    return (
        <section className="font-display px-4 md:px-0">
            <div className="flex items-center justify-between mb-4 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold md:uppercase tracking-widest md:tracking-wider flex items-center gap-2">
                    <span className="hidden md:block w-8 h-[2px] bg-brand-primary"></span>
                    Recommended for You
                </h3>
                <span className="md:hidden material-symbols-outlined text-slate-400">tune</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {recommended.map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
                        <div className="aspect-4/5 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <button className="absolute top-4 right-4 z-10 size-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">favorite</span>
                            </button>
                            <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={item.name}
                                src={item.image}
                            />
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.brand}</p>
                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                    <span>{item.rating}</span>
                                    <span className="material-symbols-outlined text-[12px] text-orange-400 fill-1">star</span>
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-brand-primary transition-colors">{item.name}</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{item.price}</span>
                                {item.oldPrice && <span className="text-xs text-slate-400 line-through">{item.oldPrice}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-8 md:mt-12">
                <button className="w-full md:w-auto border-2 border-slate-900 dark:border-brand-primary text-slate-900 dark:text-brand-primary px-10 py-3 rounded-lg font-bold hover:bg-slate-900 dark:hover:bg-brand-primary hover:text-white transition-all text-sm md:text-base">
                    Load More Products
                </button>
            </div>
        </section>
    );
};
