#!/usr/bin/env tsx
/**
 * 토론토 OSM 장소 수집 스크립트
 * npm run fetch:osm-toronto
 */

import { fetchOsmPlaces, buildTorontoRestaurantQuery } from "../src/lib/osmFetcher";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🗺️  토론토 OSM 장소 수집 시작...");
  console.time("소요 시간");

  const query = buildTorontoRestaurantQuery();
  const places = await fetchOsmPlaces(query);

  console.log(`✅ 총 ${places.length}개 장소 수집 완료`);

  // 카테고리별 통계
  const stats: Record<string, number> = {};
  places.forEach((p) => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  console.log("\n📊 카테고리별 분포:");
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`   ${cat}: ${count}개`));

  // 태그별 통계 (한국인 관련)
  const koreanRelated = places.filter(
    (p) => p.tags.some((t) => ["한식", "일식", "중식", "쌀국수", "카페", "디저트", "베이커리"].includes(t))
  );
  console.log(`\n🇰🇷 한국인 관련 장소: ${koreanRelated.length}개`);

  // 결과 저장
  const outDir = path.resolve(__dirname, "../raw");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, `toronto-osm-${new Date().toISOString().slice(0, 10)}.json`);
  fs.writeFileSync(outPath, JSON.stringify(places, null, 2), "utf-8");
  console.log(`\n💾 저장 완료: ${outPath}`);

  // 기존 데이터와 diff 생성 (간단한 비교)
  const existingPath = path.resolve(__dirname, "../src/data/toronto.ts");
  if (fs.existsSync(existingPath)) {
    console.log(`\n📍 기존 데이터 파일: ${existingPath}`);
    console.log("   → 수동으로 diff 비교 후 merge 권장");
  }

  // 자동 merge용 snippet 출력
  const snippetPath = path.join(outDir, `toronto-osm-merge-${new Date().toISOString().slice(0, 10)}.ts`);
  const snippet = generateMergeSnippet(places);
  fs.writeFileSync(snippetPath, snippet, "utf-8");
  console.log(`\n📝 merge snippet: ${snippetPath}`);

  console.timeEnd("소요 시간");
}

function generateMergeSnippet(places: any[]): string {
  const placeStrings = places.map((p) => {
    return `  {
    id: "${p.id}",
    name: "${p.name}",
    nameEn: "${p.nameEn}",
    city: "${p.city}",
    category: "${p.category}",
    neighborhood: "${p.neighborhood}",
    description: "${p.description}",
    shortDesc: "${p.shortDesc}",
    address: "${p.address}",
    lat: ${p.lat},
    lng: ${p.lng},
    rating: ${p.rating},
    priceLevel: ${p.priceLevel},
    tags: [${p.tags.map((t: string) => `"${t}"`).join(", ")}],
    tips: [],
    ${p.openHours ? `openHours: "${p.openHours}",\n    ` : ""}${p.website ? `website: "${p.website}",\n    ` : ""}${p.officialWebsite ? `officialWebsite: "${p.officialWebsite}",\n    ` : ""}lastUpdated: "${p.lastUpdated}",
    image: "${p.image}",
    isFree: ${p.isFree},
    indoorOutdoor: "${p.indoorOutdoor}",
  }`;
  });

  return `// OSM으로 수집한 토론토 장소 (${new Date().toISOString().slice(0, 10)})
// 기존 src/data/toronto.ts에 수동으로 merge하거나,
// 아래 배열을 places 배열에 concat하여 사용

export const osmTorontoPlaces = [
${placeStrings.join(",\n")}
];
`;
}

main().catch((err) => {
  console.error("❌ 오류 발생:", err);
  process.exit(1);
});
