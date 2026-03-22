export type BannerStoredStatus = "draft" | "active" | "scheduled"

export type BannerDisplayStatus = "draft" | "active" | "scheduled" | "expired"

export type BannerSlotKind = "hero" | "carousel" | "category_strip"

export type BannerRecord = {
  id: string
  headline: string
  subheadline: string
  destinationUrl: string
  ctaText: string
  imageDesktop: string
  imageMobile: string
  status: BannerStoredStatus
  priority: number
  startsAt: string
  endsAt: string
  analytics: {
    clicks: number
    impressions: number
  }
}

export type CategoryStripRow = {
  id: string
  label: string
  bannerIds: string[]
}
