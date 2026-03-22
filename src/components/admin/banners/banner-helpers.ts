import type { Banner, DisplayStatus } from "./types"

export const DESKTOP_RECOMMENDED = { w: 1920, h: 600 }
export const MOBILE_RECOMMENDED = { w: 750, h: 1000 }

export function getDisplayStatus(banner: Banner, now = new Date()): DisplayStatus {
  if (banner.status === "draft") return "draft"
  const end = new Date(banner.endAt).getTime()
  const start = new Date(banner.startAt).getTime()
  const t = now.getTime()
  if (t > end) return "expired"
  if (t < start) return "scheduled"
  return "active"
}

export function ctrPercent(clicks: number, impressions: number): string {
  if (impressions <= 0) return "0.00%"
  return `${((clicks / impressions) * 100).toFixed(2)}%`
}

export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function isoToDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function datetimeLocalToIso(value: string): string {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

export function createBannerId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `bnr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
