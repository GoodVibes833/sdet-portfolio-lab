#!/usr/bin/env tsx
/**
 * OSM 데이터를 Yelp API로 보강 (rating, image, price, review_count)
 * 토론토/밴쿠버 한식/일식/중식/카페/관광 top 500씩
 * npm run enrich:yelp
 */

import type { Place } from "../src/data/places";
import * as fs from "fs";
import * as path from "path";

const YELP_KEY = process.env.NEXT_PUBLIC_YELP_API_KEY || "";
const YELP_BASE = "https://api.yelp.com/v3/businesses/search";

interface YelpBiz {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  price?: string;
  image_url?: string;
  coordinates: { latitude: number; longitude: number };
  location: { display_address: string[] };
  url: string;
}

// 거리 계산 (m)
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchYelp(location: string, term: string, limit: number): Promise<YelpBiz[]> {
  const params = new URLSearchParams({ location, term, limit: String(limit), sort_by: "best_match" });
  const res = await fetch(`${YELP_BASE}?${params}`, {
    headers: { Authorization: `Bearer ${YELP_KEY}` },
  });
  if (!res.ok) {
    console.error(`  Yelp error ${res.status}: ${await res.text()}`);
    return [];
  }
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
  console.log(`\n🔍 ${cityName} Yelp 보강 시작`);
  const places: Place[] = JSON.parse(fs.readFileSync(osmPath, "utf-8"));
  console.log(`  OSM 원본: ${places.length}개`);

  let apiCalls = 0;
  const enriched = new Set<string>(); // 이미 보강한 place id

  for (const term of terms) {
    console.log(`\n  📡 "${term}" 검색 중...`);
    const bizList = await fetchYelp(cityName, term, 50);
    apiCalls++;
    console.log(`     Yelp 반환: ${bizList.length}개`);

    for (const biz of bizList) {
      // 가장 가까운 OSM 장소 찾기 (100m 이내)
      let best: Place | null = null;
      let bestDist = Infinity;
      for (const p of places) {
        if (enriched.has(p.id)) continue;
        const d = haversine(p.lat, p.lng, biz.coordinates.latitude, biz.coordinates.longitude);
        if (d < bestDist && d < 150) { // 150m 이내
          bestDist = d;
          best = p;
        }
      }

      if (best) {
        (best as any).rating = biz.rating;
        (best as any).image = biz.image_url || "";
        (best as any).priceLevel = priceToLevel(biz.price);
        (best as any).yelpReviewCount = biz.review_count;
        (best as any).yelpUrl = biz.url;
        enriched.add(best.id);
      }
    }
    await new Promise(r => setTimeout(r, 300)); // API 예의
  }

  const enrichedCount = enriched.size;
  const withImage = places.filter(p => (p as any).image).length;
  const withRating = places.filter(p => (p as any).rating > 0).length;

  console.log(`\n  ✅ ${cityName} 보강 완료`);
  console.log(`     Yelp API 호출: ${apiCalls}회`);
  console.log(`     보강된 장소: ${enrichedCount}개`);
  console.log(`     이미지 추가: ${withImage}개`);
  console.log(`     rating 추가: ${withRating}개`);

  const outPath = osmPath.replace(".json", "-yelp.json");
  fs.writeFileSync(outPath, JSON.stringify(places, null, 2));
  console.log(`     💾 저장: ${outPath}`);
}

async function main() {
  if (!YELP_KEY) {
    console.error("❌ NEXT_PUBLIC_YELP_API_KEY 없음");
    process.exit(1);
  }

  const rawDir = path.resolve(__dirname, "../raw");

  const cities = [
    { file: "toronto-osm-full-2026-05-13.json", location: "Toronto, ON" },
    { file: "vancouver-osm-full-2026-05-13.json", location: "Vancouver, BC" },
    { file: "montreal-osm-full-2026-05-13.json", location: "Montreal, QC" },
    { file: "ottawa-osm-full-2026-05-13.json", location: "Ottawa, ON" },
    { file: "calgary-edmonton-osm-full-2026-05-13.json", location: "Calgary, AB" },
  ];

  const terms = ["korean restaurant", "japanese restaurant", "chinese restaurant", "cafe", "bakery", "attractions", "bar"];

  for (const city of cities) {
    await enrichCity(path.join(rawDir, city.file), city.location, terms);
  }

  console.log("\n🎉 전체 보강 완료");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
