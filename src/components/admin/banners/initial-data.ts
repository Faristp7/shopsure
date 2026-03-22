import type { BannerRecord, CategoryStripRow } from "@/types/banner"

const pic = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const MOCK_BANNERS: Record<string, BannerRecord> = {
  hero1: {
    id: "hero1",
    headline: "Spring collection is live",
    subheadline: "Up to 40% off selected styles",
    destinationUrl: "/collections/spring",
    ctaText: "Shop now",
    imageDesktop: pic("shopsure-hero-d", 1920, 600),
    imageMobile: pic("shopsure-hero-m", 750, 1000),
    status: "active",
    priority: 1,
    startsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: { clicks: 12840, impressions: 420000 },
  },
  car1: {
    id: "car1",
    headline: "Free shipping this weekend",
    subheadline: "",
    destinationUrl: "/promo/shipping",
    ctaText: "Learn more",
    imageDesktop: pic("car-a", 1200, 400),
    imageMobile: pic("car-am", 750, 480),
    status: "active",
    priority: 1,
    startsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: { clicks: 3201, impressions: 198000 },
  },
  car2: {
    id: "car2",
    headline: "Member rewards",
    subheadline: "Double points on tech",
    destinationUrl: "/rewards",
    ctaText: "View perks",
    imageDesktop: pic("car-b", 1200, 400),
    imageMobile: pic("car-bm", 750, 480),
    status: "scheduled",
    priority: 2,
    startsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: { clicks: 0, impressions: 1200 },
  },
  cat1: {
    id: "cat1",
    headline: "Electronics deals",
    subheadline: "",
    destinationUrl: "/category/electronics",
    ctaText: "Browse",
    imageDesktop: pic("cat-el", 800, 400),
    imageMobile: pic("cat-elm", 600, 400),
    status: "active",
    priority: 1,
    startsAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: { clicks: 892, impressions: 56000 },
  },
}

export const INITIAL_HERO_IDS: string[] = ["hero1"]
export const INITIAL_CAROUSEL_IDS: string[] = ["car1", "car2"]

export const INITIAL_STRIP_ROWS: CategoryStripRow[] = [
  { id: "strip_row_1", label: "Electronics", bannerIds: ["cat1"] },
]
