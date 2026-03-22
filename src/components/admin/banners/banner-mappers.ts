import type { BannerRecord } from "@/types/banner"
import type { Banner } from "./types"

export function recordToBanner(r: BannerRecord): Banner {
  return {
    id: r.id,
    headline: r.headline,
    subheadline: r.subheadline || undefined,
    destinationUrl: r.destinationUrl,
    ctaText: r.ctaText || undefined,
    desktopImageUrl: r.imageDesktop,
    mobileImageUrl: r.imageMobile,
    status: r.status,
    priority: r.priority,
    startAt: r.startsAt,
    endAt: r.endsAt,
    impressions: r.analytics.impressions,
    clicks: r.analytics.clicks,
  }
}

export function bannerToRecord(b: Banner): BannerRecord {
  return {
    id: b.id,
    headline: b.headline,
    subheadline: b.subheadline ?? "",
    destinationUrl: b.destinationUrl,
    ctaText: b.ctaText ?? "",
    imageDesktop: b.desktopImageUrl,
    imageMobile: b.mobileImageUrl,
    status: b.status,
    priority: b.priority,
    startsAt: b.startAt,
    endsAt: b.endAt,
    analytics: { clicks: b.clicks, impressions: b.impressions },
  }
}
