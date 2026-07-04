#!/usr/bin/env tsx
/**
 * public/data/*.json Yelp 보강 (rating 없는 장소 우선)
 * npm run enrich:public-yelp
 */

import type { Place } from "../src/data/places";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8").split("\n").forEach(line => {
    const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  });
}

const YELP_KEY = process.env.NEXT_PUBLIC_YELP_API_KEY || "";
const YELP_BASE = "https://api.yelp.com/v3/businesses/search";

interface YelpBiz {
  id: string; name: string; rating: number;
  review_count: number; price?: string; image_url?: string;
  coordinates: { latitude: number; longitude: number };
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchYelp(lat: number, lng: number, term: string, radius: number): Promise<YelpBiz[]> {
  const params = new URLSearchParams({
    latitude: String(lat), longitude: String(lng),
    term, radius: String(radius), limit: "5", sort_by: "best_match"
  });
  const res = await fetch(`${YELP_BASE}?${params}`, {
    headers: { Authorization: `Bearer ${YELP_KEY}` },
  });
  if (!res.ok) { console.error(`  Yelp ${res.status}: ${await res.text()}`); return []; }
  const data = await res.json() as { businesses: YelpBiz[] };
  return data.businesses || [];
}

function priceToLevel(p?: string): 0 | 1 | 2 | 3 {
  if (!p) return 0;
  if (p.includes("$$$$")) return 3;
  if (p.includes("$$$")) return 3;
  if (p.includes("$$")) return 2;
  if (p.includes("$")) return 1;
  return 0;
}

function nameSimilar(a: string, b: string): boolean {
  const na = a.toLowerCase().replace(/[^a-z0-9]/g, "");
  const nb = b.toLowerCase().replace(/[^a-z0-9]/g, "");
  return na.includes(nb) || nb.includes(na) || na.slice(0, 6) === nb.slice(0, 6);
}

async function enrichFile(jsonPath: string, locationName: string, maxCalls: number) {
  console.log(`\n🔍 ${locationName} — ${jsonPath}`);
  const places: Place[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // 평점 없는 장소 우선, 한/일/중/카페 태그 우선
  const priorityTags = new Set(["한식", "일식", "중식", "카페", "디저트", "베이커리"]);
  const targets = places
    .filter(p => p.rating === 0 || !p.image || p.image.length < 10)
    .sort((a, b) => {
      const aKr = a.tags.some(t => priorityTags.has(t)) ? 1 : 0;
      const bKr = b.tags.some(t => priorityTags.has(t)) ? 1 : 0;
      return bKr - aKr || b.rating - a.rating;
    })
    .slice(0, maxCalls * 3); // API call보다 3배 후보

  console.log(`  대상: ${targets.length}개 (rating=${places.filter(p=>p.rating===0).length}개)`);

  let calls = 0;
  let enriched = 0;
  const enrichedIds = new Set<string>();

  for (const place of targets) {
    if (calls >= maxCalls) break;
    const term = place.nameEn || place.name;
    const bizList = await fetchYelp(place.lat, place.lng, term, 200);
    calls++;

    let best: YelpBiz | null = null;
    let bestScore = 0;
    for (const biz of bizList) {
      const d = haversine(place.lat, place.lng, biz.coordinates.latitude, biz.coordinates.longitude);
      const sim = nameSimilar(place.name, biz.name) || nameSimilar(place.nameEn || "", biz.name) ? 2 : 0;
      const score = sim + (d < 100 ? 2 : d < 200 ? 1 : 0) + (biz.review_count > 50 ? 1 : 0);
      if (score > bestScore && d < 300) { bestScore = score; best = biz; }
    }

    if (best && bestScore >= 2) {
      (place as any).rating = best.rating;
      if (!place.image || place.image.length < 10) (place as any).image = best.image_url || place.image;
      if (place.priceLevel === 0) (place as any).priceLevel = priceToLevel(best.price);
      enriched++;
      enrichedIds.add(place.id);
    }

    if (calls % 10 === 0) console.log(`  ... ${calls}/${maxCalls} calls, ${enriched} enriched`);
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync(jsonPath, JSON.stringify(places));
  console.log(`  ✅ 완료: ${calls} API calls, ${enriched}개 보강`);
  console.log(`  💾 저장: ${jsonPath}`);
}

async function main() {
  if (!YELP_KEY) { console.error("❌ NEXT_PUBLIC_YELP_API_KEY 없음"); process.exit(1); }

  await enrichFile("public/data/ottawa.json", "Ottawa", 100);

  console.log("\n🎉 Montreal + Calgary 보강 완료");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
