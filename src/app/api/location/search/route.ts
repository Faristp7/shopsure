import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_HEADERS = {
  "User-Agent": "ShopSure/1.0 (location search)",
  "Accept-Language": "en-IN",
};

function getBestLocality(address?: {
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  city_district?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
}) {
  return (
    address?.suburb ??
    address?.neighbourhood ??
    address?.quarter ??
    address?.hamlet ??
    address?.village ??
    address?.town ??
    address?.city ??
    address?.municipality ??
    address?.city_district ??
    address?.county ??
    address?.state_district ??
    ""
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const queryVariants = Array.from(
    new Set([
      query,
      `${query}, India`,
      `${query}, Kerala, India`,
      `${query}, Kozhikode, Kerala, India`,
    ]),
  );

  try {
    const collectedResults = [];

    for (const variant of queryVariants) {
      const target = new URL("https://nominatim.openstreetmap.org/search");
      target.searchParams.set("format", "jsonv2");
      target.searchParams.set("q", variant);
      target.searchParams.set("limit", "12");
      target.searchParams.set("addressdetails", "1");
      target.searchParams.set("countrycodes", "in");
      target.searchParams.set("dedupe", "0");

      const response = await fetch(target.toString(), {
        headers: NOMINATIM_HEADERS,
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json({ message: "Failed to search locations." }, { status: 502 });
      }

      const data = (await response.json()) as Array<{
        lat: string;
        lon: string;
        address?: {
          city?: string;
          town?: string;
          village?: string;
          hamlet?: string;
          suburb?: string;
          neighbourhood?: string;
          quarter?: string;
          city_district?: string;
          municipality?: string;
          county?: string;
          state_district?: string;
          state?: string;
          country?: string;
          country_code?: string;
        };
      }>;

      collectedResults.push(
        ...data
          .filter((entry) => entry.address?.country_code?.toLowerCase() === "in")
          .map((entry, index) => {
            const city = getBestLocality(entry.address);
            const state = entry.address?.state ?? "";
            const country = entry.address?.country ?? "";
            const label = [city, state].filter(Boolean).join(", ") || country || query;

            return {
              id: `${label}-${entry.lat}-${entry.lon}-${variant}-${index}`,
              city,
              state,
              country,
              label,
              latitude: Number(entry.lat),
              longitude: Number(entry.lon),
            };
          })
          .filter((entry) => Boolean(entry.city || entry.label)),
      );
    }

    const dedupedResults = Array.from(
      new Map(collectedResults.map((entry) => [`${entry.label}-${entry.latitude}-${entry.longitude}`, entry])).values(),
    ).slice(0, 12);

    return NextResponse.json(dedupedResults);
  } catch {
    return NextResponse.json({ message: "Unable to search locations." }, { status: 500 });
  }
}
