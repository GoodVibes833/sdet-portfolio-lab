#!/usr/bin/env tsx
/**
 * Yelp Fusion API 키 테스트 + 토론토 한식집 수집
 */

import { fetchYelpTorontoKorean, fetchYelpTorontoCafes, fetchYelpTorontoAttractions } from "../src/lib/yelpFetcher";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔍 Yelp API 키 테스트 중...\n");

  try {
    // 1. 한식집
    console.log("🍜 Toronto Korean restaurants...");
    const korean = await fetchYelpTorontoKorean();
    console.log(`   ✅ ${korean.length}개 수집`);
    korean.slice(0, 5).forEach((p) => {
      console.log(`      · ${p.name} — ⭐${p.rating} (${p.rating > 0 ? p.rating + '점' : 'rating 없음'}) — ${p.address.slice(0, 40)}`);
    });

    // 2. 카페
    console.log("\n☕ Toronto Cafes...");
    const cafes = await fetchYelpTorontoCafes();
    console.log(`   ✅ ${cafes.length}개 수집`);
    cafes.slice(0, 5).forEach((p) => {
      console.log(`      · ${p.name} — ⭐${p.rating} — ${p.address.slice(0, 40)}`);
    });

    // 3. 관광지
    console.log("\n🏛️  Toronto Attractions...");
    const attractions = await fetchYelpTorontoAttractions();
    console.log(`   ✅ ${attractions.length}개 수집`);
    attractions.slice(0, 5).forEach((p) => {
      console.log(`      · ${p.name} — ⭐${p.rating} — ${p.address.slice(0, 40)}`);
    });

    // 4. 저장
    const outDir = path.resolve(__dirname, "../raw");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, `toronto-yelp-${new Date().toISOString().slice(0, 10)}.json`);
    fs.writeFileSync(outPath, JSON.stringify({ korean, cafes, attractions }, null, 2), "utf-8");
    console.log(`\n💾 저장 완료: ${outPath}`);
    console.log(`\n📊 총 ${korean.length + cafes.length + attractions.length}개 수집 (한도: 5000회/월)`);

  } catch (err) {
    console.error("❌ 오류:", (err as Error).message);
    process.exit(1);
  }
}

main();
