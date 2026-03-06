import React from 'react';

interface FeatureHighlight {
    icon: string;
    title: string;
    desc: string;
}

interface ProductColor {
    name: string;
    class: string;
}

export interface ProductInfoProps {
    brand: string;
    name: string;
    description: string;
    price: string;
    originalPrice: string;
    discount: string;
    rating: number;
    reviews: number;
    isBestseller: boolean;
    features: FeatureHighlight[];
    colors: ProductColor[];
}

export const ProductInfo: React.FC<{ product: ProductInfoProps }> = ({ product }) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Header / Title */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2 lg:mb-0">
                    {product.isBestseller && (
                        <span className="bg-primary/10 text-primary text-[10px] lg:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                            Bestseller
                        </span>
                    )}
                    <div className="flex items-center gap-1 text-amber-500">
                        <span className="material-symbols-outlined text-sm fill-current">star</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{product.rating}</span>
                        <span className="text-xs lg:text-sm text-slate-500 font-medium hidden lg:inline-block">({(product.reviews / 1000).toFixed(1)}k reviews)</span>
                        <span className="text-xs lg:text-sm text-slate-500 font-medium lg:hidden">({(product.reviews / 1000).toFixed(1)}k reviews)</span>
                    </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{product.name}</h1>
                <p className="text-slate-500 text-sm lg:text-lg leading-relaxed mt-1 lg:mt-0">{product.description}</p>
            </div>

            {/* Pricing block */}
            <div className="p-4 lg:p-0 bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 lg:shadow-none lg:border-none">
                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{product.price}</span>
                        <span className="text-slate-400 line-through text-lg">{product.originalPrice}</span>
                        <span className="text-green-600 font-bold text-sm lg:text-lg">{product.discount}</span>
                    </div>
                    <p className="text-xs text-slate-400 lg:mt-1">Inclusive of all taxes. EMI starts at ₹895/mo (approx).</p>
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-3 lg:space-y-4">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Select Color: <span className="text-slate-900 dark:text-slate-100 ml-1 hidden lg:inline-block">{product.colors[0].name}</span>
                </p>
                <div className="flex gap-4">
                    {product.colors.map((color, idx) => (
                        <button
                            key={idx}
                            className={`group flex flex-col items-center gap-2 ${idx !== 0 ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-full ${color.class} ${idx === 0 ? 'ring-2 ring-offset-2 ring-primary ring-offset-white dark:ring-offset-background-dark' : 'border-2 border-transparent hover:border-slate-400'}`}></div>
                            <span className="text-xs font-medium lg:hidden">{color.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 lg:grid-cols-2 lg:flex lg:flex-row gap-2 lg:gap-4 py-4 lg:py-0 border-y lg:border-none border-slate-200 dark:border-slate-800">
                <div className="flex lg:flex-row flex-col items-center justify-center lg:justify-start gap-1 lg:gap-3 lg:p-3 lg:bg-white lg:dark:bg-slate-800 lg:rounded-xl lg:border border-slate-200 dark:border-slate-800 text-center">
                    <span className="material-symbols-outlined text-primary text-xl lg:text-base">local_shipping</span>
                    <span className="text-[10px] lg:text-xs font-bold uppercase lg:capitalize tracking-wider lg:tracking-normal">Free Delivery</span>
                </div>
                <div className="flex lg:flex-row flex-col items-center justify-center lg:justify-start gap-1 lg:gap-3 lg:p-3 lg:bg-white lg:dark:bg-slate-800 lg:rounded-xl lg:border border-slate-200 dark:border-slate-800 text-center border-x lg:border-x-0 border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined text-primary text-xl lg:text-base">assignment_return</span>
                    <span className="text-[10px] lg:text-xs font-bold uppercase lg:capitalize tracking-wider lg:tracking-normal">7-Day Return</span>
                </div>
                <div className="flex lg:flex-row flex-col items-center justify-center lg:justify-start gap-1 lg:gap-3 lg:p-3 lg:bg-white lg:dark:bg-slate-800 lg:rounded-xl lg:border border-slate-200 dark:border-slate-800 text-center">
                    <span className="material-symbols-outlined text-primary text-xl lg:text-base">verified_user</span>
                    <span className="text-[10px] lg:text-xs font-bold uppercase lg:capitalize tracking-wider lg:tracking-normal">1-Year Warranty</span>
                </div>
                <div className="hidden lg:flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="material-symbols-outlined text-primary">shield_moon</span>
                    <span className="text-xs font-bold">Secure Payment</span>
                </div>
            </div>

            {/* Highlights Grid (Mobile: list style, Desktop: 4-col box style) */}
            <div className="space-y-4 lg:space-y-0">
                <h3 className="font-bold text-lg lg:hidden">Product Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:bg-primary/5 lg:p-6 lg:rounded-2xl">
                    {product.features.map((feature, index) => (
                        <div key={index} className="flex lg:flex-col items-center gap-3 lg:gap-2 p-3 lg:p-0 bg-slate-50 dark:bg-slate-800/50 lg:bg-transparent lg:dark:bg-transparent rounded-lg lg:text-center">
                            <span className="material-symbols-outlined text-primary text-2xl lg:text-base">{feature.icon}</span>
                            <div>
                                <p className="text-sm lg:text-[10px] font-bold lg:text-slate-600 lg:uppercase leading-none lg:leading-normal">{feature.title}</p>
                                <p className="text-xs text-slate-500 lg:hidden">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Add to Cart / Buy Now */}
            <div className="hidden lg:flex gap-4 pt-4">
                <button className="flex-1 py-4 border-2 border-primary text-primary font-extrabold rounded-xl hover:bg-primary/5 transition-colors uppercase tracking-widest text-sm">Add to Cart</button>
                <button className="flex-1 py-4 bg-primary text-white font-extrabold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all uppercase tracking-widest text-sm">Buy Now</button>
            </div>

            {/* Mobile Fixed Bottom Actions (Included in ProductDetailsPage layout instead) */}

        </div>
    );
};
