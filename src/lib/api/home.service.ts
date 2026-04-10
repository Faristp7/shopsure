import api from "@/lib/axios";

export type HomeBanner = {
  id: string;
  title: string;
  subtitle: string;
  imageDesktop: string;
  imageMobile: string;
  link: string;
  ctaText: string;
  priority: number;
  experimentKey: string | null;
  variantKey: string | null;
};

export type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
  productCount: number;
};

export type HomeProduct = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  imageUrl: string;
  price: number;
  originalPrice: number | null;
  discountPercentage: number;
  rating: number | null;
  ratingCount: number;
  badges: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export type HomeBrand = {
  name: string;
  productCount: number;
};

export type HomeResponse = {
  meta: any;
  banners: HomeBanner[];
  categories: HomeCategory[];
  featuredProducts: HomeProduct[];
  deals: HomeProduct[];
  trending: HomeProduct[];
  featuredRails: any[];
  brands: HomeBrand[];
  reviews: any[];
};

export const homeService = {
  async getHome(): Promise<HomeResponse> {
    try {
      const res = await api.get<HomeResponse>("/v1/home");
      return res.data;
    } catch (error: any) {
      console.error("Failed to fetch home data:", error.message || error);
      
      // Return safe empty payload if backend API is not running/unreachable
      return {
        meta: {},
        banners: [],
        categories: [],
        featuredProducts: [],
        deals: [],
        trending: [],
        featuredRails: [],
        brands: [],
        reviews: [],
      };
    }
  },
};
