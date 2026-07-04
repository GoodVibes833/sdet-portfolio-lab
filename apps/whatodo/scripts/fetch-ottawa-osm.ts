#!/usr/bin/env tsx
/**
 * Ottawa + Gatineau 수집
 * npm run fetch:osm-ottawa
 */

import { fetchOsmPlaces } from "../src/lib/osmFetcher";
import type { Place } from "../src/data/places";
import * as fs from "fs";
import * as path from "path";

const ZONES = [
  { name: "오타와 다운타운/바이워드", cityName: "ottawa", bbox: [45.4100, -75.7200, 45.4350, -75.6800] as [number, number, number, number] },
  { name: "오타와 웨스트/칸타타", cityName: "ottawa", bbox: [45.3500, -75.8000, 45.4500, -75.7000] as [number, number, number, number] },
  { name: "오타와 이스트/글루스터", cityName: "ottawa", bbox: [45.4000, -75.6800, 45.4800, -75.6000] as [number, number, number, number] },
  { name: "가티노", cityName: "ottawa", bbox: [45.4500, -75.7800, 45.5000, -75.6800] as [number, number, number, number] },
];

const AMENITY = ["restaurant", "cafe", "fast_food", "bakery", "bar", "pub", "ice_cream", "food_court", "bubble_tea", "cinema", "theatre", "nightclub", "pharmacy", "bank", "atm", "library", "community_centre"];
const TOURISM = ["attraction", "museum", "gallery", "viewpoint", "hotel", "theme_park", "zoo", "aquarium", "spa"];
const SHOP = ["convenience", "supermarket", "mall", "clothes", "electronics", "beauty", "asian", "korean", "japanese", "grocery"];
const LEISURE = ["park", "sports_centre", "fitness_centre", "swimming_pool"];
const NATURAL = ["beach", "wood", "water", "peak"];

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log("🗺️  Ottawa OSM 수집 시작\n");
  console.time("총 소요");
  const outDir = path.resolve(__dirname, "../raw");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const all: Place[] = [];
  const seen = new Set<string>();

  for (const z of ZONES) {
    try {
      console.log(`📍 ${z.name}...`);
      const places = await fetchOsmPlaces({ cityName: z.cityName, bbox: z.bbox, amenityFilters: AMENITY, tourismFilters: TOURISM, shopFilters: SHOP, leisureFilters: LEISURE, naturalFilters: NATURAL });
      let added = 0;
      for (const p of places) {
        const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
        if (!seen.has(key)) { seen.add(key); all.push(p); added++; }
      }
      console.log(`  ✅ ${added}개 추가`);
      await sleep(1500);
    } catch (e) { console.error(`  ❌ ${(e as Error).message}`); await sleep(3000); }
  }

  const stats: Record<string, number> = {};
  all.forEach(p => stats[p.category] = (stats[p.category] || 0) + 1);
  console.log("\n📊 결과");
  console.log(`총 ${all.length}개`);
  Object.entries(stats).sort((a,b) => b[1]-a[1]).forEach(([c,n]) => console.log(`  ${c}: ${n}개`));

  const kr = all.filter(p => p.tags.some(t => ["한식","일식","중식","쌀국수","카페","디저트"].includes(t)));
  console.log(`\n🇰🇷 한국인 관련: ${kr.length}개`);

  const date = new Date().toISOString().slice(0, 10);
  const out = path.join(outDir, `ottawa-osm-full-${date}.json`);
  fs.writeFileSync(out, JSON.stringify(all, null, 2));
  console.log(`\n💾 ${out}`);
  console.timeEnd("총 소요");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
