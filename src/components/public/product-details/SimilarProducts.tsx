import React from 'react';

export interface SimilarProduct {
    id: string;
    category: string;
    name: string;
    price: string;
    rating: number;
    image: string;
}

export const SimilarProducts: React.FC<{ products: SimilarProduct[] }> = ({ products }) => {
    return (
        <section className="mt-16 lg:mt-24 mb-12">
            <div className="flex justify-between items-end mb-6 lg:mb-8 px-4 lg:px-0">
                <div>
                    <h3 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-slate-900 dark:text-white">Similar Products</h3>
                    <p className="text-slate-500 hidden lg:block">You might also be interested in these</p>
                </div>
                <div className="hidden lg:flex gap-2">
                    <button className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Container for products (Scrollable on mobile, Grid on desktop) */}
            <div className="flex lg:grid gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0 px-4 lg:px-0 grid-cols-2 lg:grid-cols-4 snap-x snap-mandatory">
                {products.map((product) => (
                    <div key={product.id} className="min-w-[160px] sm:min-w-[200px] lg:min-w-0 bg-white dark:bg-slate-800 lg:dark:bg-slate-800 lg:border border-slate-100 lg:border-slate-200 dark:border-slate-800 p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-sm lg:shadow-none group cursor-pointer snap-start shrink-0">
                        <div className="aspect-square rounded-lg lg:rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden mb-3 lg:mb-4 relative">
                            <img
                                className="w-full h-full object-cover lg:group-hover:scale-105 transition-transform duration-500"
                                alt={product.name}
                                src={product.image}
                            />
                        </div>
                        <p className="hidden lg:block text-[10px] font-bold text-primary uppercase mb-1">{product.category}</p>
                        <h4 className="font-bold text-sm mb-1 lg:mb-2 lg:group-hover:text-primary transition-colors text-slate-900 dark:text-white line-clamp-1 lg:line-clamp-none">{product.name}</h4>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1 lg:gap-0">
                            <p className="font-black text-primary lg:text-slate-900 lg:dark:text-white text-sm lg:text-lg">{product.price}</p>
                            <div className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-xs text-yellow-400 fill-current">star</span>
                                <span>{product.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </section>
    );
};
