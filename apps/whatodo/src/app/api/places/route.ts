import { NextRequest, NextResponse } from "next/server";

const YELP_API_KEY = process.env.NEXT_PUBLIC_YELP_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const term = searchParams.get("term") || "";
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

  if (!city) {
    return NextResponse.json({ error: "Missing city" }, { status: 400 });
  }
  if (!YELP_API_KEY || YELP_API_KEY === "your_yelp_api_key") {
    return NextResponse.json({ error: "Yelp API key not configured" }, { status: 500 });
  }

  try {
    const url = new URL("https://api.yelp.com/v3/businesses/search");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "5000";
    if (lat && lng) {
      url.searchParams.set("latitude", lat);
      url.searchParams.set("longitude", lng);
      url.searchParams.set("radius", radius);
    } else {
      url.searchParams.set("location", city);
    }
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("sort_by", "best_match");
    if (term) url.searchParams.set("term", term);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // 1 hour cache
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Yelp API error", detail: text }, { status: res.status });
    }

    const data = await res.json();
    const places = (data.businesses || [])
      .filter((b: any) => {
        const lat = b.coordinates?.latitude;
        const lng = b.coordinates?.longitude;
        return typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng);
      })
      .map((b: any) => ({
        id: b.id,
        name: b.name,
        lat: b.coordinates.latitude,
        lng: b.coordinates.longitude,
        address: b.location?.display_address?.join(", ") || "",
        phone: b.display_phone || "",
        rating: b.rating || 0,
        reviewCount: b.review_count || 0,
        price: b.price?.length || null,
        categories: (b.categories || []).map((c: any) => c.title),
        imageUrl: b.image_url || "",
        url: b.url || "",
        yelpId: b.id,
      }));

    return NextResponse.json({ places, total: data.total || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
