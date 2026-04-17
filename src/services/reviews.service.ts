import { apiService } from './api';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalCount: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  items: Review[];
}

export interface CreateReviewInput {
  productId: string;
  orderId: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
}

const BUYER_BASE = 'v1/buyer/reviews';
const ADMIN_BASE = 'v1/admin/reviews';

export const reviewsService = {
  getProductReviews(productId: string, page = 1, limit = 10): Promise<ReviewSummary> {
    return apiService.get<ReviewSummary>(`v1/products/${productId}/reviews?page=${page}&limit=${limit}`);
  },

  createReview(input: CreateReviewInput): Promise<Review> {
    return apiService.post<Review>(BUYER_BASE, input);
  },

  markHelpful(reviewId: string): Promise<void> {
    return apiService.post<void>(`${BUYER_BASE}/${reviewId}/helpful`);
  },

  getAdminReviews(page = 1, limit = 20, status?: string): Promise<{ data: Review[]; total: number }> {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) q.set('status', status);
    return apiService.get<{ data: Review[]; total: number }>(`${ADMIN_BASE}?${q}`);
  },

  deleteReview(reviewId: string): Promise<void> {
    return apiService.delete<void>(`${ADMIN_BASE}/${reviewId}`);
  },
};
