import React from 'react';

interface Review {
    id: number;
    userInitials: string;
    userName: string;
    isVerified: boolean;
    date: string;
    rating: number;
    comment: string;
    helpfulCount: number;
}

export interface ProductReviewsProps {
    summary: {
        total: number;
        rating: number;
        insights: string[];
        distribution: Record<string, number>;
    };
    reviews: Review[];
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ summary, reviews }) => {
    return (
        <section className="mt-12 lg:mt-20">
            {/* Header / Title */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 lg:mb-12">
                <div>
                    <h3 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2">Customer Reviews</h3>
                    <p className="text-slate-500 text-sm lg:text-base">Real feedback from verified owners</p>
                </div>

                {/* AI Insights block */}
                <div className="bg-primary/5 rounded-2xl p-4 lg:w-auto w-full">
                    <p className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        AI Insight: What customers love
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {summary.insights.map((insight, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
                                "{insight}"
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Rating Distribution (Sidebar on Desktop, Top on Mobile) */}
                <div className="lg:w-1/3 p-6 lg:p-8 bg-white dark:bg-slate-800 lg:rounded-3xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center lg:items-stretch lg:text-center">
                    <div className="flex items-center lg:flex-col lg:text-center gap-4 lg:gap-0 mb-6 lg:mb-0">
                        <p className="text-5xl lg:text-6xl font-black text-primary lg:text-slate-900 lg:dark:text-white lg:mb-2">{summary.rating}</p>
                        <div>
                            <div className="flex gap-1 text-amber-500 lg:text-yellow-400 lg:justify-center lg:mb-2 text-sm lg:text-base">
                                <span className="material-symbols-outlined fill-current">star</span>
                                <span className="material-symbols-outlined fill-current">star</span>
                                <span className="material-symbols-outlined fill-current">star</span>
                                <span className="material-symbols-outlined fill-current">star</span>
                                <span className="material-symbols-outlined fill-current">star_half</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium lg:mb-8">Based on {summary.total.toLocaleString()} reviews</p>
                        </div>
                    </div>

                    <div className="w-full space-y-3 lg:space-y-4">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const percentage = summary.distribution[stars] || 0;
                            return (
                                <div key={stars} className="flex items-center gap-3 lg:gap-4 text-sm lg:text-base">
                                    <span className="text-xs font-bold w-4">{stars}</span>
                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 lg:dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary lg:bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="text-xs text-slate-400 w-10 text-right lg:text-left">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>

                    <button className="hidden lg:block mt-8 w-full py-3 border-2 border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:border-primary hover:text-primary transition-all">Write a Review</button>
                </div>

                {/* Individual Reviews */}
                <div className="lg:w-2/3 space-y-6 lg:space-y-6 pt-4 lg:pt-0">
                    {reviews.map((review) => (
                        <div key={review.id} className="lg:p-6 lg:bg-white lg:dark:bg-slate-800 lg:rounded-2xl lg:border border-slate-200 dark:border-slate-800 border-b border-b-slate-200 dark:border-b-slate-800 lg:border-b pb-6 lg:pb-6">
                            <div className="flex items-center justify-between mb-4 lg:mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-200 dark:bg-slate-700 lg:bg-primary/10 flex items-center justify-center font-bold text-xs lg:text-sm lg:text-primary text-slate-600 dark:text-slate-300">
                                        {review.userInitials}
                                    </div>
                                    <div className="flex flex-col lg:gap-1">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-sm">{review.userName}</span>
                                            {review.isVerified && <span className="text-green-600 material-symbols-outlined text-[16px]">verified</span>}
                                        </div>
                                        <div className="flex gap-0.5 text-amber-500 lg:text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`material-symbols-outlined text-xs ${i < review.rating ? 'fill-current' : ''}`}>star</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 lg:font-medium">{review.date}</span>
                            </div>
                            <p className="text-sm lg:text-base text-slate-600 lg:text-slate-700 dark:text-slate-400 lg:dark:text-slate-300 leading-relaxed lg:mb-4 font-normal lg:font-medium">
                                "{review.comment}"
                            </p>

                            <div className="hidden lg:flex items-center gap-4 mt-4">
                                <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                                    <span className="text-xs font-bold">{review.helpfulCount} Helpful</span>
                                </button>
                                <button className="text-slate-400 hover:text-primary transition-colors text-xs font-bold">Reply</button>
                            </div>
                        </div>
                    ))}

                    <button className="lg:hidden mt-8 w-full py-3 border border-primary text-primary font-bold rounded-xl transition-all">Write a Review</button>

                </div>
            </div>
        </section>
    );
};
