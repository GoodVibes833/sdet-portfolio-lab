#!/usr/bin/env tsx
/**
 * src/data/*.ts → public/data/*.json 변환
 * 번들 사이즈 절감 + 동적 로딩
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "../src/data");
const PUBLIC_DATA = path.resolve(__dirname, "../public/data");

if (!fs.existsSync(PUBLIC_DATA)) fs.mkdirSync(PUBLIC_DATA, { recursive: true });

const cities = [
  { file: "toronto-collected.ts", out: "toronto.json" },
  { file: "vancouver.ts", out: "vancouver.json" },
  { file: "montreal.ts", out: "montreal.json" },
  { file: "ottawa.ts", out: "ottawa.json" },
  { file: "calgary.ts", out: "calgary.json" },
  { file: "edmonton.ts", out: "edmonton.json" },
  { file: "victoria.ts", out: "victoria.json" },
  { file: "winnipeg.ts", out: "winnipeg.json" },
];

for (const c of cities) {
  const fp = path.join(DATA_DIR, c.file);
  if (!fs.existsSync(fp)) { console.log(`⏭️ skip ${c.file}`); continue; }

  const content = fs.readFileSync(fp, "utf-8");
  const match = content.match(/export\s+const\s+\w+\s*:\s*Place\[\]\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) { console.log(`⚠️ parse fail ${c.file}`); continue; }

  try {
    const data = eval(match[1]);
    const outPath = path.join(PUBLIC_DATA, c.out);
    fs.writeFileSync(outPath, JSON.stringify(data), "utf-8");
    console.log(`✅ ${c.out} — ${data.length}개 (${Math.round(fs.statSync(outPath).size / 1024)}KB)`);
  } catch (e) {
    console.log(`❌ ${c.file}: ${(e as Error).message}`);
  }
}

console.log("\n🎉 public/data/보내기 완료");
