import React from 'react';
import { lifestyles } from '@/data/marketplaceMockData';

export const MarketplaceLifestyle: React.FC = () => {
    return (
        <section className="font-display">
            <h3 className="text-xl font-bold mb-8 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-[2px] bg-brand-primary"></span>
                Shop by Lifestyle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lifestyles.map((item, i) => (
                    <div key={i} className="relative group h-96 rounded-2xl overflow-hidden cursor-pointer">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url('${item.image}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
                            <h4 className="text-white text-2xl font-bold mb-2">{item.name}</h4>
                            <p className="text-white/80 mb-4">{item.description}</p>
                            <button className="text-white font-bold flex items-center gap-2 group/btn">
                                Explore Collection <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_right_alt</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
