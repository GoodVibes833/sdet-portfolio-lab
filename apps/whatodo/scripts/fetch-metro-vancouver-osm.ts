#!/usr/bin/env tsx
/**
 * Metro Vancouver 전체 OSM 수집
 * 밴쿠버 + 리치몬드 + 버나비 + 서리 + 코퀴틀람 + 노스밴 + 웨스트밴 + 뉴웨스트민스터 + 랭리
 * npm run fetch:osm-vancouver
 */

import { fetchOsmPlaces } from "../src/lib/osmFetcher";
import type { Place } from "../src/data/places";
import * as fs from "fs";
import * as path from "path";

const METRO_VAN_ZONES = [
  {
    name: "밴쿠버 다운타운/웨스트엔드",
    cityName: "vancouver",
    bbox: [49.2700, -123.1600, 49.3050, -123.0800] as [number, number, number, number],
  },
  {
    name: "이스트밴쿠버/키칠라노",
    cityName: "vancouver",
    bbox: [49.2200, -123.1600, 49.2800, -123.0100] as [number, number, number, number],
  },
  {
    name: "노스밴쿠버/웨스트밴쿠버",
    cityName: "vancouver",
    bbox: [49.2900, -123.2800, 49.3700, -122.9400] as [number, number, number, number],
  },
  {
    name: "버나비",
    cityName: "vancouver",
    bbox: [49.2100, -123.0400, 49.2800, -122.9300] as [number, number, number, number],
  },
  {
    name: "리치몬드 (한인 많음)",
    cityName: "vancouver",
    bbox: [49.1300, -123.2200, 49.2000, -123.0500] as [number, number, number, number],
  },
  {
    name: "코퀴틀람/포트무디",
    cityName: "vancouver",
    bbox: [49.2400, -122.9500, 49.3400, -122.7000] as [number, number, number, number],
  },
  {
    name: "뉴웨스트민스터/서리 북",
    cityName: "vancouver",
    bbox: [49.1700, -122.9600, 49.2400, -122.7800] as [number, number, number, number],
  },
  {
    name: "서리/랭리",
    cityName: "vancouver",
    bbox: [49.0500, -122.8500, 49.1800, -122.5500] as [number, number, number, number],
  },
];

const AMENITY = [
  "restaurant", "cafe", "fast_food", "bakery", "bar", "pub", "ice_cream",
  "food_court", "bubble_tea", "cinema", "theatre", "nightclub",
  "pharmacy", "bank", "atm", "library", "community_centre",
];
const TOURISM = ["attraction", "museum", "gallery", "viewpoint", "hotel", "theme_park", "zoo", "aquarium", "spa"];
const SHOP = [
  "convenience", "supermarket", "mall", "clothes", "electronics",
  "beauty", "hairdresser", "asian", "korean", "japanese", "grocery", "seafood",
];
const LEISURE = ["park", "sports_centre", "fitness_centre", "swimming_pool", "bowling_alley"];
const NATURAL = ["beach", "wood", "water", "peak"];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🗺️  Metro Vancouver OSM 수집 시작\n");
  console.time("총 소요 시간");

  const outDir = path.resolve(__dirname, "../raw");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const allPlaces: Place[] = [];
  const globalSeen = new Set<string>();

  for (const zone of METRO_VAN_ZONES) {
    try {
      console.log(`\n📍 ${zone.name} 수집 중...`);
      console.time(`  ${zone.name}`);

      const places = await fetchOsmPlaces({
        cityName: zone.cityName,
        bbox: zone.bbox,
        amenityFilters: AMENITY,
        tourismFilters: TOURISM,
        shopFilters: SHOP,
        leisureFilters: LEISURE,
        naturalFilters: NATURAL,
      });

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
      await sleep(1500);

    } catch (err) {
      console.error(`  ❌ ${zone.name} 실패:`, (err as Error).message);
      await sleep(3000);
    }
  }

  const stats: Record<string, number> = {};
  allPlaces.forEach((p) => { stats[p.category] = (stats[p.category] || 0) + 1; });

  console.log("\n" + "=".repeat(50));
  console.log("📊 Metro Vancouver 수집 결과");
  console.log("=".repeat(50));
  console.log(`총 ${allPlaces.length}개 장소\n카테고리별:`);
  Object.entries(stats).sort((a, b) => b[1] - a[1]).forEach(([cat, n]) => console.log(`   ${cat}: ${n}개`));

  const kr = allPlaces.filter((p) =>
    p.tags.some((t) => ["한식", "일식", "중식", "쌀국수", "카페", "디저트"].includes(t))
  );
  console.log(`\n🇰🇷 한국인 관련 장소: ${kr.length}개`);

  const dateStr = new Date().toISOString().slice(0, 10);
  const outPath = path.join(outDir, `vancouver-osm-full-${dateStr}.json`);
  fs.writeFileSync(outPath, JSON.stringify(allPlaces, null, 2), "utf-8");
  console.log(`\n💾 저장 완료: ${outPath}`);
  console.timeEnd("총 소요 시간");
}

main().catch((err) => { console.error("❌ 오류:", err); process.exit(1); });
