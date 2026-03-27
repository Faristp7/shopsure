import api from "@/lib/axios";
import type { BannerRecord, BannerStoredStatus } from "@/types/banner";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type BannerSlot = "HERO" | "CAROUSEL" | "CATEGORY";

export type BannerStatus =
  | "DRAFT"
  | "ACTIVE"
  | "SCHEDULED"
  | "EXPIRED";

export type CreateBannerDto = {
  title: string;
  subtitle?: string;
  imageDesktop: string;
  imageMobile: string;
  link: string;
  ctaText?: string;
  status: BannerStatus;
  priority: number;
  slot: BannerSlot;
  startAt: string;
  endAt: string;
};

export type UpdateBannerStatusDto = {
  status: BannerStatus;
  startAt: string;
  endAt: string;
};

export type ReorderBannersDto = {
  items: Array<{
    bannerId: string;
    priority: number;
  }>;
};

type BannerApiResponse = {
  id: string;
  title: string;
  subtitle?: string;
  imageDesktop: string;
  imageMobile: string;
  link: string;
  ctaText?: string;
  status: BannerStatus;
  priority: number;
  slot: BannerSlot;
  startAt: string;
  endAt: string;
};

type BannerListResponse =
  | BannerApiResponse[]
  | {
      items?: BannerApiResponse[];
      data?: BannerApiResponse[];
    };

/* -------------------------------------------------------------------------- */
/*                               DATA MAPPERS                                 */
/* -------------------------------------------------------------------------- */

function mapApiToRecord(apiBanner: BannerApiResponse): BannerRecord {
  return {
    id: apiBanner.id,

    headline: apiBanner.title,
    subheadline: apiBanner.subtitle ?? "",

    destinationUrl: apiBanner.link,
    ctaText: apiBanner.ctaText ?? "",

    imageDesktop: apiBanner.imageDesktop,
    imageMobile: apiBanner.imageMobile,

    status: (apiBanner.status ?? "DRAFT").toLowerCase() as BannerStoredStatus,

    priority: apiBanner.priority,

    startsAt: apiBanner.startAt,
    endsAt: apiBanner.endAt,

    analytics: {
      clicks: 0,
      impressions: 0,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                                SERVICE API                                 */
/* -------------------------------------------------------------------------- */

export const bannerService = {
  /* ------------------------------ GET BANNERS ------------------------------ */

  async getBanners(slot: BannerSlot): Promise<BannerRecord[]> {
    const res = await api.get<BannerListResponse>("/v1/banners", {
      params: { slot },
    });

    const data = res.data;

    const items = Array.isArray(data)
      ? data
      : data.items ?? data.data ?? [];

    return items.map(mapApiToRecord);
  },

  /* ----------------------------- CREATE BANNER ----------------------------- */

  async createBanner(data: CreateBannerDto): Promise<BannerRecord> {
    const res = await api.post<BannerApiResponse>("/v1/banners", data);
    return mapApiToRecord(res.data);
  },

  /* ------------------------------ UPDATE BANNER ---------------------------- */

  async updateBanner(
    id: string,
    data: CreateBannerDto
  ): Promise<BannerRecord> {
    const res = await api.put<BannerApiResponse>(
      `/v1/banners/${id}`,
      data
    );

    return mapApiToRecord(res.data);
  },

  /* ------------------------------ DELETE BANNER ---------------------------- */

  async deleteBanner(id: string): Promise<void> {
    await api.delete(`/v1/banners/${id}`);
  },

  /* --------------------------- UPDATE BANNER STATUS ------------------------ */

  async updateBannerStatus(
    id: string,
    data: UpdateBannerStatusDto
  ): Promise<BannerRecord> {
    const res = await api.patch<BannerApiResponse>(
      `/v1/banners/${id}/status`,
      data
    );

    return mapApiToRecord(res.data);
  },

  /* ------------------------------ REORDER BANNERS -------------------------- */

  async reorderBanners(data: ReorderBannersDto): Promise<void> {
    await api.post(`/v1/banners/reorder`, data);
  },

  /* ------------------------------- UPLOAD IMAGE ----------------------------- */

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<{ url: string }>(
      "/v1/admin/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.url;
  },
};