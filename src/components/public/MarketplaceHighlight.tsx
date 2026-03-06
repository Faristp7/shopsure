import React from 'react';
import { highlightData } from '@/data/marketplaceMockData';
import Image from 'next/image';

export const MarketplaceHighlight: React.FC = () => {
    return (
        <section className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm font-display">
            <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-12 relative w-full h-full">
                <Image
                    className="object-contain mix-blend-multiply transition-transform hover:scale-105 duration-500 max-h-full"
                    alt={highlightData.title}
                    src={highlightData.image}
                    fill
                />
            </div>
            <div className="p-12 space-y-8">
                <div className="space-y-4">
                    <span className="text-brand-primary font-bold tracking-widest text-xs uppercase">{highlightData.badge}</span>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">{highlightData.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{highlightData.description}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase">Special Price</p>
                        <p className="text-3xl font-extrabold text-brand-primary">{highlightData.price}</p>
                    </div>
                    <div className="h-10 w-px bg-slate-200"></div>
                    <div>
                        <div className="flex text-orange-400">
                            <span className="material-symbols-outlined size-5 fill-1">star</span>
                            <span className="material-symbols-outlined size-5 fill-1">star</span>
                            <span className="material-symbols-outlined size-5 fill-1">star</span>
                            <span className="material-symbols-outlined size-5 fill-1">star</span>
                            <span className="material-symbols-outlined size-5">star</span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium">{highlightData.reviewsCount} Reviews</p>
                    </div>
                </div>
                <button className="w-full bg-slate-900 dark:bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:translate-y-[-2px]">
                    Buy Now
                </button>
            </div>
        </section>
    );
};
