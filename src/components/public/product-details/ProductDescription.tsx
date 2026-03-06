'use client';
import React, { useState } from 'react';

export const ProductDescription: React.FC<{ description: string }> = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <React.Fragment>
            <section className="mt-8 lg:mt-20">
                {/* Desktop Tabs */}
                <div className="hidden lg:flex border-b border-slate-200 dark:border-slate-800 gap-12 overflow-x-auto">
                    <button className="pb-4 border-b-2 border-primary text-primary font-bold text-lg">Detailed Description</button>
                    <button className="pb-4 text-slate-400 font-bold text-lg hover:text-slate-600 transition-colors">Technical Specifications</button>
                    <button className="pb-4 text-slate-400 font-bold text-lg hover:text-slate-600 transition-colors">What's in the Box</button>
                </div>

                {/* Desktop Content Body */}
                <div className="hidden lg:grid py-12 grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Unparalleled Sound Experience</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            With custom-designed 40mm drivers and support for Hi-Res audio, every note is delivered with breathtaking clarity and deep, punchy bass. Spatial audio technology provides a theater-like surround sound experience, making your music and movies feel more lifelike than ever before.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Up to 40 hours of playtime on a single charge</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Fast charge: 10 mins = 5 hours of listening</span>
                            </li>
                        </ul>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
                        <img className="w-full h-full object-cover" alt="Driver components" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ92knmyppZco0bqM_sEucxVTyzOLIvsPEf6Z_ZsedpdStg1kJZLuOE6QMWRMdoQpdeSlpp6TOxxq-PvTwJRE2oCRbSix6vDfdZCQdMtAphb_9zD8dcTHOP0lZaw5DWOTPATwmIWE4mWQQgbqeWKLC9gnabKQC2JuVAFng4vvx6uHKCFxmMFSfHrGDxNhW8u9rXk--PPmLUYuMMWZn2srWTO0PVg6utcT8JH7zKDYQyhg-DG361e71Gdp2Vy2n511OKBZRUmDuNA" />
                    </div>
                </div>
            </section>

            {/* Mobile Accordion */}
            <div className="lg:hidden border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mt-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 font-bold"
                >
                    Detailed Description
                    <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 p-4 pt-0 border-t border-slate-100 dark:border-slate-800' : 'max-h-0 opacity-0'}`}>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {description}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
