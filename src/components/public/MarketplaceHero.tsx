import React from 'react';
import { heroData } from '@/data/marketplaceMockData';

export const MarketplaceHero: React.FC = () => {
    return (
        <section className="relative rounded-xl overflow-hidden bg-slate-900 group font-display">
            <div
                className="aspect-square md:aspect-21/9 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${heroData.image}')` }}
            >
                <div className="absolute inset-0 bg-black/40 md:bg-linear-to-r md:from-slate-900 md:via-slate-900/40 md:to-transparent flex items-end md:items-center pb-12 md:pb-0">
                    <div className="px-6 md:px-12 max-w-xl space-y-4 md:space-y-6">
                        <span className="inline-block bg-brand-primary text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-widest">
                            {heroData.badge}
                        </span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                            {heroData.title}
                        </h2>
                        <p className="hidden md:block text-slate-200 text-lg leading-relaxed">
                            {heroData.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                            <button className="bg-brand-primary hover:bg-brand-primary/90 text-white w-full sm:w-auto px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all transform hover:translate-y-[-2px]">
                                Explore Now
                            </button>
                            <button className="hidden md:block bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-3 rounded-lg font-bold transition-all">
                                Watch Promo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 md:left-12 md:right-auto flex justify-center md:justify-start gap-1.5 md:gap-2">
                <div className="w-6 md:w-8 h-1 bg-brand-primary rounded-full"></div>
                <div className="w-1.5 md:w-8 h-1 bg-white/30 rounded-full"></div>
                <div className="w-1.5 md:w-8 h-1 bg-white/30 rounded-full"></div>
            </div>
        </section>
    );
};
