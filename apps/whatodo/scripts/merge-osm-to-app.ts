#!/usr/bin/env tsx
/**
 * OSM + 기존 수동 데이터 → 앱 TypeScript 파일 merge
 * 토론토/밴쿠버 중심
 * npm run merge:osm
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "../src/data");
const RAW_DIR = path.resolve(__dirname, "../raw");

// 기존 수동 데이터 파일 매핑
const CITY_FILES: Record<string, string> = {
  toronto: "toronto-collected.ts",
  vancouver: "vancouver.ts",
  montreal: "montreal.ts",
  ottawa: "ottawa.ts",
  calgary: "calgary.ts",
  edmonton: "edmonton.ts",
};

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function escapeString(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "");
}

function placeToTs(place: any): string {
  const fields: string[] = [];
  fields.push(`    id: "${escapeString(place.id)}"`);
  fields.push(`    city: "${place.city}"`);
  fields.push(`    name: "${escapeString(place.name)}"`);
  fields.push(`    nameEn: "${escapeString(place.nameEn || place.name)}"`);
  fields.push(`    category: "${place.category}"`);
  fields.push(`    neighborhood: "${place.neighborhood}"`);
  fields.push(`    description: "${escapeString(place.description || `${place.name}은(는) ${place.city}의 인기 ${place.category}입니다.`)}"`);
  fields.push(`    shortDesc: "${escapeString(place.shortDesc || `${place.category} · ${place.neighborhood}`)}"`);
  fields.push(`    address: "${escapeString(place.address || "")}"`);
  fields.push(`    lat: ${place.lat}`);
  fields.push(`    lng: ${place.lng}`);
  fields.push(`    rating: ${place.rating || 0}`);
  fields.push(`    priceLevel: ${place.priceLevel || 0}`);
  fields.push(`    isFree: ${place.isFree ?? (place.priceLevel === 0)}`);
  if (place.recommendScore) fields.push(`    recommendScore: ${place.recommendScore}`);

  const tags = place.tags || [];
  if (tags.length > 0) fields.push(`    tags: [${tags.map((t: string) => `"${escapeString(t)}"`).join(", ")}]`);
  else fields.push(`    tags: []`);

  fields.push(`    tips: [${(place.tips || []).map((t: string) => `"${escapeString(t)}"`).join(", ")}]`);

  if (place.openHours) fields.push(`    openHours: "${escapeString(place.openHours)}"`);
  if (place.website) fields.push(`    website: "${escapeString(place.website)}"`);
  if (place.officialWebsite) fields.push(`    officialWebsite: "${escapeString(place.officialWebsite)}"`);
  if (place.bestSeason) fields.push(`    bestSeason: "${escapeString(place.bestSeason)}"`);
  if (place.lastUpdated) fields.push(`    lastUpdated: "${place.lastUpdated}"`);

  const img = place.image || "";
  fields.push(`    image: "${escapeString(img)}"`);

  if (place.featured) fields.push(`    featured: true`);
  if (place.indoorOutdoor) fields.push(`    indoorOutdoor: "${place.indoorOutdoor}"`);

  return `  {\n${fields.map(f => `    ${f},`).join("\n")}\n  }`;
}

async function mergeCity(city: string, rawFile: string) {
  console.log(`\n🔀 ${city} merge 시작`);

  // 1. 기존 수동 데이터 읽기
  const manualFile = path.join(DATA_DIR, CITY_FILES[city] || `${city}.ts`);
  let manualPlaces: any[] = [];
  if (fs.existsSync(manualFile)) {
    const content = fs.readFileSync(manualFile, "utf-8");
    // 간단한 파싱: 수동으로 정규식으로 추출
    const match = content.match(/export\s+const\s+\w+\s*:\s*Place\[\]\s*=\s*(\[[\s\S]*?\]);/);
    if (match) {
      try {
        manualPlaces = eval(match[1]); // 주의: 간단한 케이스만
      } catch {
        console.log(`  ⚠️ 기존 ${city} 데이터 파싱 실패 — 수동 데이터 skip`);
      }
    }
  }
  console.log(`  기존 수동: ${manualPlaces.length}개`);

  // 2. OSM + Yelp 데이터 읽기
  const osmPath = path.join(RAW_DIR, rawFile);
  if (!fs.existsSync(osmPath)) {
    console.log(`  ⚠️ ${rawFile} 없음`);
    return;
  }
  const osmData: any[] = JSON.parse(fs.readFileSync(osmPath, "utf-8"));
  console.log(`  OSM 원본: ${osmData.length}개`);

  // 3. 병합: 수동 데이터를 기준으로, OSM은 보강용
  const merged: any[] = [];
  const seenCoords = new Set<string>();
  const seenIds = new Set<string>();

  // 먼저 수동 데이터 (고품질)
  for (const p of manualPlaces) {
    if (seenIds.has(p.id)) continue;
    seenIds.add(p.id);
    const key = `${p.lat.toFixed(3)},${p.lng.toFixed(3)}`;
    seenCoords.add(key);
    merged.push(p);
  }

  // OSM 데이터 추가 (50m 이내 중복 제거)
  let added = 0, skipped = 0;
  for (const p of osmData) {
    const key = `${p.lat.toFixed(3)},${p.lng.toFixed(3)}`;
    if (seenCoords.has(key)) { skipped++; continue; }

    // 가장 가까운 수동 데이터와 거리 확인
    let tooClose = false;
    for (const mp of manualPlaces) {
      if (haversine(p.lat, p.lng, mp.lat, mp.lng) < 80) { tooClose = true; break; }
    }
    if (tooClose) { skipped++; continue; }

    seenCoords.add(key);
    if (seenIds.has(p.id)) { skipped++; continue; }
    seenIds.add(p.id);

    // 이미지가 없으면 기본 Unsplash
    if (!p.image) {
      const catImg: Record<string, string> = {
        "맛집": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        "카페": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        "쇼핑": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        "관광": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        "자연": "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
        "야경": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
        "스포츠": "https://images.unsplash.com/photo-1461896836934- voices?w=800&q=80",
      };
      p.image = catImg[p.category] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
    }

    merged.push(p);
    added++;
  }

  console.log(`  ✅ 추가: ${added}개 | 중복 skip: ${skipped}개 | 총: ${merged.length}개`);

  // 4. 저장
  const varName = city === "toronto" ? "torontoCollected" : `${city}Places`;
  const tsContent = `import type { Place } from "./places";\n\nexport const ${varName}: Place[] = [\n${merged.map(placeToTs).join(",\n")}\n];\n`;

  fs.writeFileSync(manualFile, tsContent, "utf-8");
  console.log(`  💾 저장: ${manualFile}`);
}

async function main() {
  console.log("🔄 OSM 데이터 → 앱 통합 시작\n");

  await mergeCity("toronto", "toronto-osm-full-2026-05-13-yelp.json");
  await mergeCity("vancouver", "vancouver-osm-full-2026-05-13-yelp.json");
  await mergeCity("montreal", "montreal-osm-full-2026-05-13-yelp.json");
  await mergeCity("ottawa", "ottawa-osm-full-2026-05-13-yelp.json");
  await mergeCity("calgary", "calgary-edmonton-osm-full-2026-05-13-yelp.json");

  console.log("\n🎉 전체 통합 완료");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
