export type BannerStatus = "draft" | "active" | "scheduled"

export type DisplayStatus = BannerStatus | "expired"

export type BannerSlotKind = "hero" | "carousel" | "category_strip"

export type Banner = {
  id: string
  headline: string
  subheadline?: string
  destinationUrl: string
  ctaText?: string
  desktopImageUrl: string
  mobileImageUrl: string
  status: BannerStatus
  priority: number
  startAt: string
  endAt: string
  impressions: number
  clicks: number
}

export type CategoryStripRow = {
  id: string
  label: string
  banners: Banner[]
}

export type BannersWorkspace = {
  hero: Banner[]
  carousel: Banner[]
  categoryStrips: CategoryStripRow[]
}
