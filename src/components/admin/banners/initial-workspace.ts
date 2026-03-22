import type { Banner, BannersWorkspace, CategoryStripRow } from "./types"
import { createBannerId } from "./banner-helpers"

function mkBanner(p: Partial<Banner> & Pick<Banner, "headline">): Banner {
  const now = new Date()
  const end = new Date(now.getTime() + 10 * 86400000)
  return {
    id: p.id ?? createBannerId(),
    headline: p.headline,
    subheadline: p.subheadline,
    destinationUrl: p.destinationUrl ?? "https://shopsure.example.com/sale",
    ctaText: p.ctaText ?? "Shop now",
    desktopImageUrl:
      p.desktopImageUrl ??
      "https://placehold.co/1920x600/e8eef4/475569?text=Desktop+hero",
    mobileImageUrl:
      p.mobileImageUrl ??
      "https://placehold.co/750x1000/e8eef4/475569?text=Mobile",
    status: p.status ?? "active",
    priority: p.priority ?? 1,
    startAt: p.startAt ?? now.toISOString(),
    endAt: p.endAt ?? end.toISOString(),
    impressions: p.impressions ?? 18240,
    clicks: p.clicks ?? 412,
  }
}

export function createInitialWorkspace(): BannersWorkspace {
  const hero: Banner = mkBanner({
    id: "seed-hero-1",
    headline: "Spring refresh — curated picks from top sellers",
    subheadline: "Limited-time offers across home, tech, and style.",
    priority: 1,
    impressions: 48200,
    clicks: 960,
  })

  const carousel: Banner[] = [
    mkBanner({
      id: "seed-car-1",
      headline: "Free shipping weekend",
      subheadline: "Orders over $50 ship free.",
      priority: 2,
      desktopImageUrl: "https://placehold.co/1200x675/f1f5f9/64748b?text=Carousel+A",
      mobileImageUrl: "https://placehold.co/800x450/f1f5f9/64748b?text=Carousel+A",
      impressions: 22100,
      clicks: 305,
    }),
    mkBanner({
      id: "seed-car-2",
      headline: "Member rewards double points",
      priority: 1,
      status: "scheduled",
      desktopImageUrl: "https://placehold.co/1200x675/eff6ff/1d4ed8?text=Carousel+B",
      mobileImageUrl: "https://placehold.co/800x450/eff6ff/1d4ed8?text=Carousel+B",
      impressions: 0,
      clicks: 0,
    }),
  ]

  const categoryStrips: CategoryStripRow[] = [
    {
      id: "seed-strip-1",
      label: "Electronics",
      banners: [
        mkBanner({
          id: "seed-strip-1-a",
          headline: "Laptops & tablets",
          priority: 1,
          desktopImageUrl: "https://placehold.co/640x480/f8fafc/334155?text=Category",
          mobileImageUrl: "https://placehold.co/400x300/f8fafc/334155?text=Category",
          impressions: 9021,
          clicks: 144,
        }),
      ],
    },
    {
      id: "seed-strip-2",
      label: "Home & living",
      banners: [
        mkBanner({
          id: "seed-strip-2-a",
          headline: "Kitchen upgrades",
          status: "draft",
          priority: 1,
          desktopImageUrl: "https://placehold.co/640x480/fdf8f6/9a3412?text=Draft",
          mobileImageUrl: "https://placehold.co/400x300/fdf8f6/9a3412?text=Draft",
          impressions: 0,
          clicks: 0,
        }),
      ],
    },
  ]

  return {
    hero: [hero],
    carousel,
    categoryStrips,
  }
}
