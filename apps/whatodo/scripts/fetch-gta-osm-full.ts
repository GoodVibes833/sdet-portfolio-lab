#!/usr/bin/env tsx
/**
 * GTA (Greater Toronto Area) 전체 OSM 장소 수집 스크립트
 * 토론토 + 미시사가 + 마컴 + 리치몬드힐 + 본 + 스카버러 + 노스욕
 * npm run fetch:osm-gta
 */

import { fetchOsmPlaces, ALL_AMENITY_FILTERS, ALL_TOURISM_FILTERS, ALL_SHOP_FILTERS, ALL_LEISURE_FILTERS, ALL_NATURAL_FILTERS } from "../src/lib/osmFetcher";
import type { Place } from "../src/data/places";
import * as fs from "fs";
import * as path from "path";

// GTA 구역 정의 (bbox: [south, west, north, east])
// 구역을 나눠서 Overpass 타임아웃 방지
const GTA_ZONES = [
  {
    name: "토론토 다운타운/이스트",
    cityName: "toronto",
    bbox: [43.6300, -79.4200, 43.7000, -79.3100] as [number, number, number, number],
  },
  {
    name: "노스욕/요크",
    cityName: "toronto",
    bbox: [43.7000, -79.5000, 43.7800, -79.3500] as [number, number, number, number],
  },
  {
    name: "스카버러",
    cityName: "toronto",
    bbox: [43.7000, -79.3100, 43.8200, -79.1500] as [number, number, number, number],
  },
  {
    name: "에토비코크/미시사가 동",
    cityName: "toronto",
    bbox: [43.5800, -79.6500, 43.7000, -79.4200] as [number, number, number, number],
  },
  {
    name: "미시사가 중심",
    cityName: "mississauga",
    bbox: [43.5200, -79.7500, 43.6400, -79.5500] as [number, number, number, number],
  },
  {
    name: "마컴/유니언빌",
    cityName: "markham",
    bbox: [43.8300, -79.3900, 43.9200, -79.2300] as [number, number, number, number],
  },
  {
    name: "리치몬드힐/손힐",
    cityName: "toronto",
    bbox: [43.8300, -79.5000, 43.9200, -79.3500] as [number, number, number, number],
  },
  {
    name: "본/우드브리지",
    cityName: "toronto",
    bbox: [43.7800, -79.6000, 43.8800, -79.4500] as [number, number, number, number],
  },
];

// 실용적인 필터셋 (너무 광범위한 것 제외)
const PRACTICAL_AMENITY = [
  "restaurant", "cafe", "fast_food", "bakery", "bar", "pub", "ice_cream",
  "food_court", "bubble_tea",
  "cinema", "theatre", "nightclub",
  "pharmacy", "dentist",
  "bank", "atm",
  "library", "community_centre",
];

const PRACTICAL_SHOP = [
  "convenience", "supermarket", "mall",
  "clothes", "electronics", "books", "sports",
  "beauty", "hairdresser",
  "asian", "korean", "japanese", "grocery",
  "seafood", "deli",
];

const PRACTICAL_LEISURE = ["park", "sports_centre", "fitness_centre", "swimming_pool", "bowling_alley"];
const PRACTICAL_TOURISM = ["attraction", "museum", "gallery", "viewpoint", "hotel", "theme_park", "zoo", "aquarium", "spa"];
const PRACTICAL_NATURAL = ["beach", "wood", "water", "peak"];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🗺️  GTA 전체 OSM 수집 시작 (토론토+미시사가+마컴+리치몬드힐+본)\n");
  console.time("총 소요 시간");

  const outDir = path.resolve(__dirname, "../raw");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const allPlaces: Place[] = [];
  const globalSeen = new Set<string>(); // 전체 중복 제거

  for (const zone of GTA_ZONES) {
    try {
      console.log(`\n📍 ${zone.name} 수집 중...`);
      console.time(`  ${zone.name}`);

      const places = await fetchOsmPlaces({
        cityName: zone.cityName,
        bbox: zone.bbox,
        amenityFilters: PRACTICAL_AMENITY,
        tourismFilters: PRACTICAL_TOURISM,
        shopFilters: PRACTICAL_SHOP,
        leisureFilters: PRACTICAL_LEISURE,
        naturalFilters: PRACTICAL_NATURAL,
      });

      // 전체 중복 제거
      let added = 0;
      for (const p of places) {
        const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
        if (!globalSeen.has(key)) {
          globalSeen.add(key);
          allPlaces.push(p);
          added++;
        }
      }

      console.timeEnd(`  ${zone.name}`);
      console.log(`  ✅ ${added}개 추가 (중복 ${places.length - added}개 제거)`);

      // Overpass API 예의상 1초 대기
      await sleep(1500);

    } catch (err) {
      console.error(`  ❌ ${zone.name} 실패:`, (err as Error).message);
      await sleep(3000); // 실패 시 더 오래 대기
    }
  }

  // 카테고리별 통계
  const stats: Record<string, number> = {};
  allPlaces.forEach((p) => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });

  console.log("\n" + "=".repeat(50));
  console.log("📊 GTA 전체 수집 결과");
  console.log("=".repeat(50));
  console.log(`총 ${allPlaces.length}개 장소`);
  console.log("\n카테고리별:");
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`   ${cat}: ${count}개`));

  const koreanRelated = allPlaces.filter(
    (p) => p.tags.some((t) => ["한식", "일식", "중식", "쌀국수", "카페", "디저트", "베이커리"].includes(t))
  );
  console.log(`\n🇰🇷 한국인 관련 장소: ${koreanRelated.length}개`);

  // 저장
  const dateStr = new Date().toISOString().slice(0, 10);
  const outPath = path.join(outDir, `gta-osm-full-${dateStr}.json`);
  fs.writeFileSync(outPath, JSON.stringify(allPlaces, null, 2), "utf-8");
  console.log(`\n💾 전체 저장: ${outPath}`);

  // 구역별 저장도
  const byCity: Record<string, Place[]> = {};
  allPlaces.forEach((p) => {
    byCity[p.city] = byCity[p.city] || [];
    byCity[p.city].push(p);
  });
  for (const [city, places] of Object.entries(byCity)) {
    const cityPath = path.join(outDir, `${city}-osm-full-${dateStr}.json`);
    fs.writeFileSync(cityPath, JSON.stringify(places, null, 2), "utf-8");
    console.log(`   · ${city}: ${places.length}개 → ${cityPath}`);
  }

  console.timeEnd("총 소요 시간");
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
