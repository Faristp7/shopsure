import type { BannerRecord } from "@/types/banner"

export function generateId() {
  return `bn_${Math.random().toString(36).slice(2, 11)}_${Date.now().toString(36)}`
}

export function createDefaultBanner(overrides: Partial<BannerRecord> = {}): BannerRecord {
  const now = new Date()
  const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return {
    id: generateId(),
    headline: "New banner",
    subheadline: "",
    destinationUrl: "/",
    ctaText: "",
    imageDesktop: "",
    imageMobile: "",
    status: "draft",
    priority: 1,
    startsAt: now.toISOString(),
    endsAt: week.toISOString(),
    analytics: { clicks: 0, impressions: 0 },
    ...overrides,
  }
}
