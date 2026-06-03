import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_HEADERS = {
  "User-Agent": "ShopSure/1.0 (location reverse lookup)",
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
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ message: "lat and lon are required." }, { status: 400 });
  }

  const target = new URL("https://nominatim.openstreetmap.org/reverse");
  target.searchParams.set("format", "jsonv2");
  target.searchParams.set("lat", lat);
  target.searchParams.set("lon", lon);
  target.searchParams.set("zoom", "18");
  target.searchParams.set("addressdetails", "1");

  try {
    const response = await fetch(target.toString(), {
      headers: NOMINATIM_HEADERS,
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to resolve current location." }, { status: 502 });
    }

    const data = (await response.json()) as {
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
    };

    if (data.address?.country_code?.toLowerCase() !== "in") {
      return NextResponse.json(
        { message: "We currently support locations in India only. Please select an Indian city manually." },
        { status: 422 },
      );
    }

    const city = getBestLocality(data.address);
    const state = data.address?.state ?? "";
    const country = data.address?.country ?? "";
    const label = [city, state].filter(Boolean).join(", ") || country || "Current location";

    return NextResponse.json({
      city,
      state,
      country,
      label,
    });
  } catch {
    return NextResponse.json({ message: "Unable to resolve current location." }, { status: 500 });
  }
}
