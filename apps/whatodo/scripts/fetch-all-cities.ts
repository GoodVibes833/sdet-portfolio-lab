#!/usr/bin/env tsx
/**
 * 전체 도시 OSM 장소 수집 스크립트
 * npm run fetch:osm-all
 */

import { fetchOsmPlaces, buildTorontoRestaurantQuery, buildVancouverRestaurantQuery } from "../src/lib/osmFetcher";
import * as fs from "fs";
import * as path from "path";

const CITIES = [
  { name: "Toronto", queryBuilder: buildTorontoRestaurantQuery, file: "toronto" },
  { name: "Vancouver", queryBuilder: buildVancouverRestaurantQuery, file: "vancouver" },
  // TODO: Montreal, Calgary, Edmonton, Ottawa, Victoria, Winnipeg
];

async function main() {
  console.log("🗺️  전체 도시 OSM 수집 시작\n");
  console.time("총 소요 시간");

  const outDir = path.resolve(__dirname, "../raw");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const summary: { city: string; count: number; path: string }[] = [];

  for (const city of CITIES) {
    try {
      console.log(`\n🏙️  ${city.name} 수집 중...`);
      console.time(`  ${city.name}`);

      const query = city.queryBuilder();
      const places = await fetchOsmPlaces(query);

      const outPath = path.join(outDir, `${city.file}-osm-${new Date().toISOString().slice(0, 10)}.json`);
      fs.writeFileSync(outPath, JSON.stringify(places, null, 2), "utf-8");

      console.timeEnd(`  ${city.name}`);
      console.log(`  ✅ ${places.length}개 저장`);
      summary.push({ city: city.name, count: places.length, path: outPath });
    } catch (err) {
      console.error(`  ❌ ${city.name} 실패:`, (err as Error).message);
    }
  }

  console.log("\n" + "=".repeat(40));
  console.log("📊 최종 요약");
  console.log("=".repeat(40));
  summary.forEach((s) => console.log(`${s.city}: ${s.count}개`));
  console.log(`\n💾 저장 위치: ${outDir}`);
  console.timeEnd("총 소요 시간");
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
