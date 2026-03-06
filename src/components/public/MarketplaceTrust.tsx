import React from 'react';

export const MarketplaceTrust: React.FC = () => {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 md:gap-y-8 gap-x-4 md:gap-x-8 py-8 md:py-12 border-y border-slate-200 dark:border-slate-800 font-display">
            <div className="flex flex-row md:flex-col items-center md:text-center text-left gap-3 md:gap-0 md:space-y-3">
                <div className="size-10 md:size-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                    <span className="material-symbols-outlined text-xl md:text-3xl">verified_user</span>
                </div>
                <div>
                    <h5 className="font-bold text-[11px] md:text-base text-slate-900 dark:text-white">Secure Payments</h5>
                    <p className="text-[9px] md:text-sm text-slate-500">100% Protection</p>
                </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:text-center text-left gap-3 md:gap-0 md:space-y-3">
                <div className="size-10 md:size-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                    <span className="material-symbols-outlined text-xl md:text-3xl">local_shipping</span>
                </div>
                <div>
                    <h5 className="font-bold text-[11px] md:text-base text-slate-900 dark:text-white">Fast Delivery</h5>
                    <p className="text-[9px] md:text-sm text-slate-500">Free over ₹499</p>
                </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:text-center text-left gap-3 md:gap-0 md:space-y-3">
                <div className="size-10 md:size-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                    <span className="material-symbols-outlined text-xl md:text-3xl">assignment_return</span>
                </div>
                <div>
                    <h5 className="font-bold text-[11px] md:text-base text-slate-900 dark:text-white">7 Day Return</h5>
                    <p className="text-[9px] md:text-sm text-slate-500">Hassle free policy</p>
                </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:text-center text-left gap-3 md:gap-0 md:space-y-3">
                <div className="size-10 md:size-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                    <span className="material-symbols-outlined text-xl md:text-3xl">support_agent</span>
                </div>
                <div>
                    <h5 className="font-bold text-[11px] md:text-base text-slate-900 dark:text-white">24/7 Support</h5>
                    <p className="text-[9px] md:text-sm text-slate-500">Dedicated help center</p>
                </div>
            </div>
        </section>
    );
};
