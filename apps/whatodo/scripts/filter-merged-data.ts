#!/usr/bin/env tsx
/**
 * 병합된 데이터를 필터링해서 핵심 장소만 유지
 * 토론토/밴쿠버: 한국인 관련 + rating 4.0+ + 카테고리별 대표
 * 기타 도시: 한국인 관련 + 전체의 30%
 * npm run filter:merged
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "../src/data");

interface Place {
  id: string; city: string; name: string; category: string;
  rating: number; tags: string[]; lat: number; lng: number;
  [key: string]: any;
}

function readTsArray(filePath: string): Place[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/export\s+const\s+\w+\s*:\s*Place\[\]\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return [];
  try {
    return eval(match[1]);
  } catch {
    return [];
  }
}

function placeToTs(place: Place): string {
  const fields: string[] = [];
  const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

  fields.push(`    id: "${escape(place.id)}"`);
  fields.push(`    city: "${place.city}"`);
  fields.push(`    name: "${escape(place.name)}"`);
  fields.push(`    nameEn: "${escape(place.nameEn || place.name)}"`);
  fields.push(`    category: "${place.category}"`);
  fields.push(`    neighborhood: "${place.neighborhood}"`);
  fields.push(`    description: "${escape(place.description)}"`);
  fields.push(`    shortDesc: "${escape(place.shortDesc)}"`);
  fields.push(`    address: "${escape(place.address || "")}"`);
  fields.push(`    lat: ${place.lat}`);
  fields.push(`    lng: ${place.lng}`);
  fields.push(`    rating: ${place.rating || 0}`);
  fields.push(`    priceLevel: ${place.priceLevel || 0}`);
  fields.push(`    isFree: ${place.isFree ?? false}`);
  if (place.recommendScore) fields.push(`    recommendScore: ${place.recommendScore}`);
  fields.push(`    tags: [${(place.tags || []).map((t: string) => `"${escape(t)}"`).join(", ")}]`);
  fields.push(`    tips: [${(place.tips || []).map((t: string) => `"${escape(t)}"`).join(", ")}]`);
  if (place.openHours) fields.push(`    openHours: "${escape(place.openHours)}"`);
  if (place.website) fields.push(`    website: "${escape(place.website)}"`);
  if (place.lastUpdated) fields.push(`    lastUpdated: "${place.lastUpdated}"`);
  fields.push(`    image: "${escape(place.image || "")}"`);
  if (place.featured) fields.push(`    featured: true`);

  return `  {\n${fields.map(f => `    ${f},`).join("\n")}\n  }`;
}

function filterCity(places: Place[], city: string, isPriority: boolean): Place[] {
  const koreanTags = new Set(["한식", "일식", "중식", "쌀국수", "베트남", "태국", "카페", "디저트", "베이커리"]);

  // 1. 한국인 관련 무조건 포함
  const koreanRelated = places.filter(p =>
    p.tags.some(t => koreanTags.has(t)) ||
    /korean|japanese|chinese|vietnamese|thai|bbq|ramen|sushi|bubble|boba/i.test(p.name)
  );

  // 2. rating 4.0+ 포함
  const highRated = places.filter(p => p.rating >= 4.0 && !koreanRelated.includes(p));

  // 3. 이미지 있는 것 우선
  const withImage = places.filter(p => p.image && p.image.length > 10 && !koreanRelated.includes(p) && !highRated.includes(p));

  // 4. 카테고리별 대표 (중요 도시만)
  const byCategory: Record<string, Place[]> = {};
  places.forEach(p => {
    if (koreanRelated.includes(p) || highRated.includes(p)) return;
    byCategory[p.category] = byCategory[p.category] || [];
    byCategory[p.category].push(p);
  });

  const categoryReps: Place[] = [];
  if (isPriority) {
    for (const cat of ["관광", "자연", "야경", "스포츠"]) {
      const sorted = (byCategory[cat] || []).sort((a, b) => (b.rating || 0) - (a.rating || 0));
      categoryReps.push(...sorted.slice(0, 30));
    }
    for (const cat of ["맛집", "카페", "쇼핑"]) {
      const sorted = (byCategory[cat] || []).sort((a, b) => (b.rating || 0) - (a.rating || 0));
      categoryReps.push(...sorted.slice(0, 50));
    }
  } else {
    // 비중요 도시: 전체의 30%만
    const rest = places.filter(p =>
      !koreanRelated.includes(p) && !highRated.includes(p) && !withImage.includes(p)
    );
    categoryReps.push(...rest.slice(0, Math.floor(rest.length * 0.3)));
  }

  // 중복 제거 후 합치기
  const seen = new Set<string>();
  const result: Place[] = [];
  for (const p of [...koreanRelated, ...highRated, ...withImage, ...categoryReps]) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      result.push(p);
    }
  }

  console.log(`  🇰🇷 한국인: ${koreanRelated.length}개 | ⭐4.0+: ${highRated.length}개 | 🖼️ 이미지: ${withImage.length}개 | 📂 카테고리: ${categoryReps.length}개`);
  console.log(`  ✅ 최종: ${result.length}개`);
  return result;
}

async function main() {
  console.log("✂️  데이터 필터링 시작\n");

  const cities = [
    { name: "toronto", file: "toronto-collected.ts", priority: true },
    { name: "vancouver", file: "vancouver.ts", priority: true },
    { name: "montreal", file: "montreal.ts", priority: false },
    { name: "ottawa", file: "ottawa.ts", priority: false },
    { name: "calgary", file: "calgary.ts", priority: false },
  ];

  for (const c of cities) {
    console.log(`\n📍 ${c.name}`);
    const filePath = path.join(DATA_DIR, c.file);
    const places = readTsArray(filePath);
    console.log(`  원본: ${places.length}개`);

    const filtered = filterCity(places, c.name, c.priority);

    // varName 추출
    const content = fs.readFileSync(filePath, "utf-8");
    const varMatch = content.match(/export\s+const\s+(\w+)/);
    const varName = varMatch ? varMatch[1] : `${c.name}Places`;

    const ts = `import type { Place } from "./places";\n\nexport const ${varName}: Place[] = [\n${filtered.map(placeToTs).join(",\n")}\n];\n`;
    fs.writeFileSync(filePath, ts, "utf-8");
    console.log(`  💾 저장: ${c.file} (${Math.round(ts.length / 1024)}KB)`);
  }

  console.log("\n🎉 필터링 완료");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
