'use strict';

import React, { useState } from 'react';
import { Star, ThumbsUp, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { RatingStars } from './RatingStars';

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  images?: string[];
}

interface ReviewSummaryProps {
  productId: string;
  averageRating: number;
  totalCount: number;
  distribution: Record<number, number>;
  reviews: ReviewItem[];
  aiSummaryText?: string;
  onMarkHelpful?: (reviewId: string) => Promise<void>;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  productId,
  averageRating,
  totalCount,
  distribution,
  reviews,
  aiSummaryText = 'Based on buyer feedback, customers highly appreciate the overall quality, premium materials, and comfortable fit of this product. Some users note that delivery is exceptionally fast, though a few suggest ordering one size larger.',
  onMarkHelpful,
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  const handleHelpfulClick = async (reviewId: string) => {
    if (votedReviews[reviewId]) return;
    try {
      if (onMarkHelpful) {
        await onMarkHelpful(reviewId);
      }
      setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredReviews = selectedRating
    ? reviews.filter((r) => r.rating === selectedRating)
    : reviews;

  return (
    <div className="space-y-8">
      {/* Overview & Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {/* Left Column: Big Average Rating */}
        <div className="text-center md:border-r md:border-gray-100 md:pr-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Buyer Rating</h3>
          <div className="text-5xl font-black text-gray-950 tracking-tight">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center my-3">
            <RatingStars rating={averageRating} size="md" />
          </div>
          <p className="text-xs font-medium text-gray-400">Based on {totalCount} verified reviews</p>
        </div>

        {/* Middle Column: Star Breakdown */}
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <button
                key={stars}
                onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                className={`w-full flex items-center gap-3 text-left p-1 rounded-lg hover:bg-gray-50 transition ${
                  selectedRating === stars ? 'bg-blue-50/50 ring-1 ring-blue-100' : ''
                }`}
              >
                <span className="text-xs font-bold text-gray-600 w-3">{stars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-500 w-8 text-right">
                  {Math.round(percentage)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Column: AI-Generated Review Summary Card */}
        <div className="bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-purple-50/40 p-5 rounded-xl border border-blue-100/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600/10" />
            <h4 className="font-bold text-sm text-gray-950">AI Review Assistant</h4>
          </div>
          <p className="text-xs leading-relaxed text-gray-700 font-medium">
            {aiSummaryText}
          </p>
          <div className="mt-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Generated from verified buyers
          </div>
        </div>
      </div>

      {/* Filter Options Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="font-bold text-base text-gray-950 flex items-center gap-2">
          Customer Reviews ({filteredReviews.length})
        </h3>
        {selectedRating && (
          <button
            onClick={() => setSelectedRating(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
          >
            <Filter className="w-3.5 h-3.5" /> Clear Star Filter
          </button>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-semibold text-gray-500">No reviews found matching filters.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 transition hover:shadow-md duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{review.userName}</span>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <RatingStars rating={review.rating} size="sm" />
                    <span className="text-xs font-extrabold text-gray-950">{review.title}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed font-normal">{review.body}</p>

              {/* Optional Images Array */}
              {review.images && review.images.length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  {review.images.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 cursor-zoom-in"
                    >
                      <img src={imgUrl} alt={`Review ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Helpfulness Action Block */}
              <div className="flex items-center gap-4 pt-2 border-t border-gray-50 text-xs">
                <span className="text-gray-400 font-medium">Was this review helpful?</span>
                <button
                  onClick={() => handleHelpfulClick(review.id)}
                  disabled={votedReviews[review.id]}
                  className={`flex items-center gap-1.5 font-bold transition px-2.5 py-1 rounded-full ${
                    votedReviews[review.id]
                      ? 'text-blue-600 bg-blue-50 cursor-default'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>
                    {review.helpfulCount + (votedReviews[review.id] ? 1 : 0)}
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ReviewSummary;
