import React from 'react';
import { flashSales } from '@/data/marketplaceMockData';

export const MarketplaceFlashSale: React.FC = () => {
    return (
        <section className="bg-brand-primary/5 rounded-2xl p-4 md:p-8 font-display">
            <div className="flex items-center justify-between mb-4 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <h3 className="text-lg md:text-2xl font-bold flex items-center gap-1 md:gap-2">
                        <span className="material-symbols-outlined text-orange-500 fill-1 text-[20px] md:text-[24px]">bolt</span>
                        Flash Sale
                    </h3>
                    <div className="flex gap-2 items-center ml-1 md:ml-0">
                        <span className="hidden md:block text-sm font-semibold text-slate-500 uppercase">Ends in:</span>
                        <div className="flex gap-1.5">
                            <span className="bg-slate-900 text-white size-8 rounded flex items-center justify-center font-bold">02</span>
                            <span className="text-slate-900 font-bold">:</span>
                            <span className="bg-slate-900 text-white size-8 rounded flex items-center justify-center font-bold">45</span>
                            <span className="text-slate-900 font-bold">:</span>
                            <span className="bg-slate-900 text-white size-6 md:size-8 text-xs md:text-base rounded flex items-center justify-center font-bold">12</span>
                        </div>
                    </div>
                </div>
                <a className="text-brand-primary font-bold hover:underline text-xs md:text-base whitespace-nowrap" href="#">See More</a>
            </div>
            <div className="flex overflow-x-auto gap-4 md:gap-6 no-scrollbar pb-2 md:pb-4">
                {flashSales.map((item, i) => (
                    <div key={i} className="min-w-[140px] md:min-w-[280px] bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-slate-100 dark:border-slate-700 md:border-none">
                        <div className="h-32 md:h-60 relative p-2 md:p-0">
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded z-10">{item.discount}</div>
                            <div
                                className="w-full h-full bg-cover bg-center rounded-lg md:rounded-none"
                                style={{ backgroundImage: `url('${item.image}')` }}
                            ></div>
                            <button className="hidden md:block absolute bottom-4 left-4 right-4 bg-brand-primary text-white py-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 font-bold text-sm">Add to Cart</button>
                        </div>
                        <div className="p-3 md:p-4 space-y-1.5 md:space-y-2">
                            <p className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider hidden md:block">{item.category}</p>
                            <h4 className="font-medium md:font-bold text-xs md:text-base text-slate-800 dark:text-white truncate">{item.name}</h4>
                            <div className="flex items-center gap-1 md:gap-2">
                                <span className="text-xs md:text-lg font-bold text-brand-primary">{item.price}</span>
                                <span className="text-[10px] md:text-sm text-slate-400 line-through">{item.oldPrice}</span>
                            </div>
                            {/* Mobile only progress bar mock */}
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden md:hidden">
                                <div className="bg-red-500 h-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                            </div>
                            <p className="text-[8px] text-slate-500 mt-1 md:hidden">{Math.floor(Math.random() * 20 + 1)} units left</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
