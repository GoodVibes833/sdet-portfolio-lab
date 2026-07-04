#!/usr/bin/env tsx
/**
 * 병합 데이터 필터링 v2 — 실제로 데이터 축소
 * 토론토/밴쿠버: ~1500개, 기타: ~500개
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "../src/data");

interface Place {
  id: string; city: string; name: string; category: string;
  rating: number; tags: string[]; lat: number; lng: number;
  image: string; [key: string]: any;
}

function readTsArray(filePath: string): Place[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/export\s+const\s+\w+\s*:\s*Place\[\]\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return [];
  try { return eval(match[1]); } catch { return []; }
}

function escape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function placeToTs(p: Place): string {
  const f: string[] = [];
  f.push(`    id: "${escape(p.id)}"`);
  f.push(`    city: "${p.city}"`);
  f.push(`    name: "${escape(p.name)}"`);
  f.push(`    nameEn: "${escape(p.nameEn || p.name)}"`);
  f.push(`    category: "${p.category}"`);
  f.push(`    neighborhood: "${escape(p.neighborhood)}"`);
  f.push(`    description: "${escape(p.description)}"`);
  f.push(`    shortDesc: "${escape(p.shortDesc)}"`);
  f.push(`    address: "${escape(p.address || "")}"`);
  f.push(`    lat: ${p.lat}`);
  f.push(`    lng: ${p.lng}`);
  f.push(`    rating: ${p.rating || 0}`);
  f.push(`    priceLevel: ${p.priceLevel || 0}`);
  f.push(`    isFree: ${!!p.isFree}`);
  if (p.recommendScore) f.push(`    recommendScore: ${p.recommendScore}`);
  f.push(`    tags: [${(p.tags || []).map((t: string) => `"${escape(t)}"`).join(", ")}]`);
  f.push(`    tips: [${(p.tips || []).map((t: string) => `"${escape(t)}"`).join(", ")}]`);
  if (p.openHours) f.push(`    openHours: "${escape(p.openHours)}"`);
  if (p.website) f.push(`    website: "${escape(p.website)}"`);
  if (p.lastUpdated) f.push(`    lastUpdated: "${p.lastUpdated}"`);
  f.push(`    image: "${escape(p.image || "")}"`);
  if (p.featured) f.push(`    featured: true`);
  return `  {\n${f.map(x => `    ${x},`).join("\n")}\n  }`;
}

function hasRealImage(p: Place): boolean {
  return !!p.image &&
    p.image.length > 0 &&
    !p.image.includes("unsplash.com/photo-1506905925346") && // 기본 관광
    !p.image.includes("unsplash.com/photo-1555396273") && // 기본 맛집
    !p.image.includes("unsplash.com/photo-1495474472287") && // 기본 카페
    !p.image.includes("unsplash.com/photo-1441986300917") && // 기본 쇼핑
    !p.image.includes("unsplash.com/photo-1501854140801") && // 기본 자연
    !p.image.includes("unsplash.com/photo-1519501025264") && // 기본 야경
    !p.image.includes("unsplash.com/photo-1461896836934"); // 기본 스포츠
}

function filterCity(places: Place[], isPriority: boolean, maxTotal: number): Place[] {
  const koreanTags = new Set(["한식", "일식", "중식", "쌀국수", "베트남", "태국", "카페", "디저트", "베이커리"]);

  // 1. 한국인 관련 (무조건 포함)
  const korean = places.filter(p =>
    p.tags.some(t => koreanTags.has(t)) ||
    /korean|japanese|chinese|vietnamese|thai|bbq|ramen|sushi|bubble|boba|pho|mandu|kimchi|bibimbap|bulgogi|galbi|takoyaki/i.test(p.name)
  );

  // 2. 수동 큐레이션 (tips 2개 이상 = 수동 데이터)
  const curated = places.filter(p => (p.tips || []).length >= 2 && !korean.includes(p));

  // 3. Yelp 실제 이미지/rating 보유
  const yelpEnriched = places.filter(p =>
    hasRealImage(p) && p.rating > 0 && !korean.includes(p) && !curated.includes(p)
  );

  // 4. rating 4.0+
  const highRated = places.filter(p =>
    p.rating >= 4.0 && !korean.includes(p) && !curated.includes(p) && !yelpEnriched.includes(p)
  );

  // 5. 카테고리별 대표
  const rest = places.filter(p =>
    !korean.includes(p) && !curated.includes(p) && !yelpEnriched.includes(p) && !highRated.includes(p)
  );

  const byCat: Record<string, Place[]> = {};
  rest.forEach(p => { byCat[p.category] = byCat[p.category] || []; byCat[p.category].push(p); });

  let catReps: Place[] = [];
  if (isPriority) {
    for (const cat of ["관광", "자연", "야경", "스포츠"]) {
      catReps.push(...(byCat[cat] || []).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 15));
    }
    for (const cat of ["맛집", "카페", "쇼핑"]) {
      catReps.push(...(byCat[cat] || []).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 30));
    }
  } else {
    // 비중요: 전체 rest 중 랜덤 샘플링
    catReps = rest.sort(() => Math.random() - 0.5).slice(0, Math.min(rest.length, 200));
  }

  // 합치기 & 중복 제거
  const seen = new Set<string>();
  const result: Place[] = [];
  for (const p of [...korean, ...curated, ...yelpEnriched, ...highRated, ...catReps]) {
    if (!seen.has(p.id)) { seen.add(p.id); result.push(p); }
  }

  // maxTotal 초과 시 잘라내기
  if (result.length > maxTotal) {
    return result.slice(0, maxTotal);
  }

  console.log(`  🇰🇷${korean.length} 큐${curated.length} ⭐${yelpEnriched.length} 4+${highRated.length} 📂${catReps.length} → 총${result.length}개`);
  return result;
}

async function main() {
  console.log("✂️  필터링 v2\n");

  const cities = [
    { name: "toronto", file: "toronto-collected.ts", priority: true, max: 1500 },
    { name: "vancouver", file: "vancouver.ts", priority: true, max: 1200 },
    { name: "montreal", file: "montreal.ts", priority: false, max: 500 },
    { name: "ottawa", file: "ottawa.ts", priority: false, max: 400 },
    { name: "calgary", file: "calgary.ts", priority: false, max: 400 },
  ];

  for (const c of cities) {
    console.log(`\n📍 ${c.name}`);
    const fp = path.join(DATA_DIR, c.file);
    const places = readTsArray(fp);
    console.log(`  원본: ${places.length}개`);

    const filtered = filterCity(places, c.priority, c.max);

    const content = fs.readFileSync(fp, "utf-8");
    const vm = content.match(/export\s+const\s+(\w+)/);
    const varName = vm ? vm[1] : `${c.name}Places`;

    const ts = `import type { Place } from "./places";\n\nexport const ${varName}: Place[] = [\n${filtered.map(placeToTs).join(",\n")}\n];\n`;
    fs.writeFileSync(fp, ts, "utf-8");
    console.log(`  💾 ${c.file} (${Math.round(ts.length / 1024)}KB)`);
  }

  console.log("\n🎉 완료");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
