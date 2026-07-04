#!/usr/bin/env tsx
/**
 * Montreal, Ottawa, Calgary/Edmonton Yelp 보강 (나머지 도시)
 */

import type { Place } from "../src/data/places";
import * as fs from "fs";
import * as path from "path";

const YELP_KEY = process.env.NEXT_PUBLIC_YELP_API_KEY || "";
const YELP_BASE = "https://api.yelp.com/v3/businesses/search";

interface YelpBiz {
  id: string; name: string; rating: number; review_count: number;
  price?: string; image_url?: string;
  coordinates: { latitude: number; longitude: number };
  location: { display_address: string[] }; url: string;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchYelp(location: string, term: string, limit: number): Promise<YelpBiz[]> {
  const params = new URLSearchParams({ location, term, limit: String(limit), sort_by: "best_match" });
  const res = await fetch(`${YELP_BASE}?${params}`, { headers: { Authorization: `Bearer ${YELP_KEY}` } });
  if (!res.ok) { console.error(`  Yelp error ${res.status}`); return []; }
  const data = await res.json() as { businesses: YelpBiz[] };
  return data.businesses || [];
}

function priceToLevel(p?: string): 0 | 1 | 2 | 3 {
  if (!p) return 0;
  if (p.includes("$$$")) return 3;
  if (p.includes("$$")) return 2;
  if (p.includes("$")) return 1;
  return 0;
}

async function enrichCity(osmPath: string, cityName: string, terms: string[]) {
  console.log(`\n🔍 ${cityName}`);
  const places: Place[] = JSON.parse(fs.readFileSync(osmPath, "utf-8"));
  console.log(`  OSM: ${places.length}개`);

  let apiCalls = 0;
  const enriched = new Set<string>();

  for (const term of terms) {
    const bizList = await fetchYelp(cityName, term, 50);
    apiCalls++;
    for (const biz of bizList) {
      let best: Place | null = null, bestDist = Infinity;
      for (const p of places) {
        if (enriched.has(p.id)) continue;
        const d = haversine(p.lat, p.lng, biz.coordinates.latitude, biz.coordinates.longitude);
        if (d < bestDist && d < 150) { bestDist = d; best = p; }
      }
      if (best) {
        (best as any).rating = biz.rating;
        (best as any).image = biz.image_url || "";
        (best as any).priceLevel = priceToLevel(biz.price);
        enriched.add(best.id);
      }
    }
    await new Promise(r => setTimeout(r, 300));
  }

  const withR = places.filter(p => (p as any).rating > 0).length;
  const withI = places.filter(p => (p as any).image).length;
  console.log(`  ✅ 보강: ${enriched.size}개 | rating: ${withR}개 | image: ${withI}개 | API: ${apiCalls}회`);

  const outPath = osmPath.replace(".json", "-yelp.json");
  fs.writeFileSync(outPath, JSON.stringify(places, null, 2));
}

async function main() {
  if (!YELP_KEY) { console.error("❌ API KEY 없음"); process.exit(1); }
  const rawDir = path.resolve(__dirname, "../raw");
  const terms = ["korean restaurant", "japanese restaurant", "chinese restaurant", "cafe", "bakery", "attractions", "bar"];

  await enrichCity(path.join(rawDir, "montreal-osm-full-2026-05-13.json"), "Montreal, QC", terms);
  await enrichCity(path.join(rawDir, "ottawa-osm-full-2026-05-13.json"), "Ottawa, ON", terms);
  await enrichCity(path.join(rawDir, "calgary-edmonton-osm-full-2026-05-13.json"), "Calgary, AB", terms);

  console.log("\n🎉 완료");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
