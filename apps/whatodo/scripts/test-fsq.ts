#!/usr/bin/env tsx
/**
 * Foursquare API 키 테스트 + 토론토 한식집 수집
 */

import { fetchFsqTorontoKorean, fetchFsqTorontoCafes } from "../src/lib/foursquareFetcher";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔍 Foursquare API 키 테스트 중...\n");

  try {
    // 1. 한식집 수집
    console.log("🏙️  Toronto Korean restaurants...");
    const korean = await fetchFsqTorontoKorean();
    console.log(`   ✅ ${korean.length}개 수집`);
    korean.slice(0, 5).forEach((p) => {
      console.log(`      · ${p.name} — ${p.neighborhood} — ${p.rating > 0 ? p.rating + '점' : 'rating 없음'}`);
    });

    // 2. 카페 수집
    console.log("\n☕ Toronto Cafes...");
    const cafes = await fetchFsqTorontoCafes();
    console.log(`   ✅ ${cafes.length}개 수집`);
    cafes.slice(0, 5).forEach((p) => {
      console.log(`      · ${p.name} — ${p.neighborhood} — ${p.rating > 0 ? p.rating + '점' : 'rating 없음'}`);
    });

    // 3. 저장
    const outDir = path.resolve(__dirname, "../raw");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, `toronto-fsq-${new Date().toISOString().slice(0, 10)}.json`);
    fs.writeFileSync(outPath, JSON.stringify({ korean, cafes }, null, 2), "utf-8");
    console.log(`\n💾 저장 완료: ${outPath}`);

  } catch (err) {
    console.error("❌ 오류:", (err as Error).message);
    process.exit(1);
  }
}

main();
