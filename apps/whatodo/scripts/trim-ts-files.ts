#!/usr/bin/env tsx
/**
 * src/data/*.ts 파일을 핵심 N개만 남기고 slim-down
 * 전체 데이터는 public/data/*.json 에 있음
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "../src/data");

interface Place {
  id: string; city: string; name: string; category: string;
  rating: number; tags: string[]; lat: number; lng: number;
  image: string; featured?: boolean; recommendScore?: number;
  [key: string]: any;
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

function toTs(p: Place): string {
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

function trimPlaces(places: Place[], max: number): Place[] {
  const koreanTags = new Set(["한식", "일식", "중식", "쌀국수", "베트남", "태국", "카페", "디저트", "베이커리"]);

  // 1. featured 무조건
  const featured = places.filter(p => p.featured);

  // 2. 수동 큐레이션 (tips 2개 이상)
  const curated = places.filter(p => (p.tips || []).length >= 2 && !p.featured);

  // 3. 한국인 관련
  const korean = places.filter(p =>
    !p.featured && !curated.includes(p) &&
    p.tags.some(t => koreanTags.has(t))
  );

  // 4. rating 4.2+
  const highRated = places.filter(p =>
    !p.featured && !curated.includes(p) && !korean.includes(p) && p.rating >= 4.2
  );

  // 5. 카테고리 대표
  const rest = places.filter(p =>
    !p.featured && !curated.includes(p) && !korean.includes(p) && !highRated.includes(p)
  );
  const byCat: Record<string, Place[]> = {};
  rest.forEach(p => { byCat[p.category] = byCat[p.category] || []; byCat[p.category].push(p); });

  const catReps: Place[] = [];
  for (const cat of ["관광", "자연", "야경", "스포츠", "맛집", "카페", "쇼핑"]) {
    catReps.push(...(byCat[cat] || []).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10));
  }

  const combined = [...featured, ...curated, ...korean, ...highRated, ...catReps];
  const seen = new Set<string>();
  const result: Place[] = [];
  for (const p of combined) {
    if (!seen.has(p.id)) { seen.add(p.id); result.push(p); }
  }

  return result.slice(0, max);
}

async function main() {
  const configs = [
    { file: "toronto-collected.ts", max: 200 },
    { file: "vancouver.ts", max: 200 },
    { file: "montreal.ts", max: 100 },
    { file: "ottawa.ts", max: 100 },
    { file: "calgary.ts", max: 100 },
  ];

  for (const c of configs) {
    const fp = path.join(DATA_DIR, c.file);
    if (!fs.existsSync(fp)) continue;

    const places = readTsArray(fp);
    console.log(`${c.file}: ${places.length}개 → `, { end: "" });

    const trimmed = trimPlaces(places, c.max);

    const content = fs.readFileSync(fp, "utf-8");
    const vm = content.match(/export\s+const\s+(\w+)/);
    const varName = vm ? vm[1] : "places";

    const ts = `import type { Place } from "./places";\n\nexport const ${varName}: Place[] = [\n${trimmed.map(toTs).join(",\n")}\n];\n`;
    fs.writeFileSync(fp, ts, "utf-8");
    console.log(`${trimmed.length}개 (${Math.round(ts.length / 1024)}KB)`);
  }

  console.log("\n✅ Slim-down 완료");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
