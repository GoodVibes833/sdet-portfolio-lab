/**
 * 네이버 검색 API 장소 데이터 수집 스크립트 (v2)
 *
 * 사용법:
 *   export NAVER_CLIENT_ID=xxx
 *   export NAVER_CLIENT_SECRET=yyy
 *   node scripts/collect-places.js
 *
 * 결과: src/data/collected-places.ts  (TypeScript 형식)
 */

const fs = require("fs");
const path = require("path");

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

const SLEEP_MS = 300;  // API 호출 간격

// 검색어 → city / category / tags 매핑
const SEARCH_CONFIG = [
  // ===== 밴쿠버 =====
  { query: "밴쿠버 카페",      city: "vancouver", category: "카페",    tags: ["커피", "카페", "디저트"] },
  { query: "밴쿠버 맛집",      city: "vancouver", category: "맛집",    tags: ["맛집", "음식", "추천"] },
  { query: "밴쿠버 식당",      city: "vancouver", category: "맛집",    tags: ["식당", "저녁", "코스"] },
  { query: "밴쿠버 관광지",    city: "vancouver", category: "관광",    tags: ["관광", "명소", "사진"] },
  { query: "밴쿠버 액티비티",  city: "vancouver", category: "액티비티", tags: ["액티비티", "체험", "즐기기"] },
  { query: "밴쿠버 한인맛집",  city: "vancouver", category: "맛집",    tags: ["한식", "한인", "맛집"] },
  { query: "밴쿠버 디저트",    city: "vancouver", category: "카페",    tags: ["디저트", "카페", "달달"] },
  { query: "밴쿠버 해변",      city: "vancouver", category: "자연",    tags: ["해변", "바다", "휴양"] },
  { query: "밴쿠버 공원",      city: "vancouver", category: "자연",    tags: ["공원", "산책", "피크닉"], isFree: true },
  { query: "밴쿠버 쇼핑",      city: "vancouver", category: "쇼핑",    tags: ["쇼핑", "아울렛", "브랜드"] },
  // ===== 토론토 =====
  { query: "토론토 카페",      city: "toronto",   category: "카페",    tags: ["커피", "카페", "디저트"] },
  { query: "토론토 맛집",      city: "toronto",   category: "맛집",    tags: ["맛집", "음식", "추천"] },
  { query: "토론토 식당",      city: "toronto",   category: "맛집",    tags: ["식당", "저녁", "코스"] },
  { query: "토론토 관광지",    city: "toronto",   category: "관광",    tags: ["관광", "명소", "사진"] },
  { query: "토론토 액티비티",  city: "toronto",   category: "액티비티", tags: ["액티비티", "체험", "즐기기"] },
  { query: "토론토 한인맛집",  city: "toronto",   category: "맛집",    tags: ["한식", "한인", "맛집"] },
  { query: "토론토 디저트",    city: "toronto",   category: "카페",    tags: ["디저트", "카페", "달달"] },
  { query: "토론토 해변",      city: "toronto",   category: "자연",    tags: ["해변", "호수", "휴양"], isFree: true },
  { query: "토론토 공원",      city: "toronto",   category: "자연",    tags: ["공원", "산책", "피크닉"], isFree: true },
  { query: "토론토 쇼핑",      city: "toronto",   category: "쇼핑",    tags: ["쇼핑", "몰", "브랜드"] },
];

// 기본 좌표 (시티 중심)
const CITY_COORDS = {
  vancouver: { lat: 49.2827, lng: -123.1207 },
  toronto:   { lat: 43.6510, lng: -79.3470 },
};

// 제목에서 실제 장소명 추출
function extractName(title) {
  // HTML 태그 제거
  let t = title.replace(/<[^>]*>/g, " ").trim();

  // 불용어 제거 (반복)
  const noise = [
    /밴쿠버/g, /토론토/g, /캐나다/g, /여행/g, /워홀/g, /유학/g, /일상/g,
    /카페/g, /맛집/g, /식당/g, /관광지/g, /액티비티/g, /한인맛집/g,
    /디저트/g, /해변/g, /공원/g, /쇼핑/g, /추천/g, /후기/g, /방문/g,
    /블로그/g, /일기/g, /기록/g, /D\+\d+/g, /\d+월/g, /\d+일/g,
    /\[.*?\]/g, /\(.*?\)/g, /【.*?】/g, /「.*?」/g,
    /[:,·|\\/]/g, /\s{2,}/g,
  ];
  noise.forEach((r) => { t = t.replace(r, " "); });

  t = t.trim();

  // 너무 짧거나 길면 제외
  if (t.length < 2 || t.length > 30) return null;

  // 한글이나 영문이 포함되어야 함
  if (!/[\uac00-\ud7afa-zA-Z]/.test(t)) return null;

  // 중복/노이즈 필터
  const skipPatterns = [
    /^\d+$/, /^\d+월/, /\.\.\./, /\d+일차/, /D\+/, /day/i,
    /ep\./i, /회$/,
  ];
  if (skipPatterns.some((p) => p.test(t))) return null;

  return t;
}

// slug 만들기
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\uac00-\ud7af]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 한글 초성 추출 (빠른 해싱용)
function getInitials(str) {
  return str
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0) - 0xac00;
      if (code < 0 || code > 11171) return c;
      return String.fromCharCode(0x1100 + Math.floor(code / 588));
    })
    .join("");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 네이버 블로그 검색
async function searchNaverBlog(query, display = 100) {
  const url =
    "https://openapi.naver.com/v1/search/blog.json?" +
    new URLSearchParams({ query, display: String(display), sort: "sim" });

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Naver API ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.items || [];
}

// 메인 수집
async function main() {
  // 환경변수 체크
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error("\n❌ 환경변수를 설정하세요:");
    console.error("   export NAVER_CLIENT_ID=발급받은ID");
    console.error("   export NAVER_CLIENT_SECRET=발급받은SECRET");
    console.error("   https://developers.naver.com/apps\n");
    process.exit(1);
  }

  const allResults = [];
  const seenKeys = new Set(); // 중복 방지용

  for (const cfg of SEARCH_CONFIG) {
    console.log(`\n🔍 ${cfg.query}`);
    let items;
    try {
      items = await searchNaverBlog(cfg.query, 100);
    } catch (e) {
      console.error(`   ❌ API 실패: ${e.message}`);
      continue;
    }
    await sleep(SLEEP_MS);

    let added = 0;
    for (const item of items) {
      const name = extractName(item.title);
      if (!name) continue;

      // 중복 체크 (초성 기반 + slug 기반)
      const key1 = slugify(name);
      const key2 = getInitials(name).slice(0, 8);
      const dupKey = `${cfg.city}-${key1}-${key2}`;
      if (seenKeys.has(dupKey)) continue;
      seenKeys.add(dupKey);

      // 좌표: 기본 시티 중심 + 소량 랜덤 오프셋
      const base = CITY_COORDS[cfg.city];
      const lat = base.lat + (Math.random() - 0.5) * 0.06;
      const lng = base.lng + (Math.random() - 0.5) * 0.06;

      const place = {
        id: `${cfg.city}-${slugify(name)}-${allResults.length + 1}`,
        city: cfg.city,
        name,
        nameEn: name,
        category: cfg.category,
        neighborhood: "다운타운",
        description: `${name} - ${cfg.query}에서 추천된 장소입니다.`,
        shortDesc: `${cfg.query} 추천 장소`,
        address: cfg.city === "vancouver"
          ? `${name}, Vancouver, BC`
          : `${name}, Toronto, ON`,
        lat: Math.round(lat * 10000) / 10000,
        lng: Math.round(lng * 10000) / 10000,
        rating: 4.0 + Math.random() * 0.9,
        priceLevel: [0, 1, 2, 2, 3][Math.floor(Math.random() * 5)],
        isFree: cfg.isFree || false,
        recommendScore: Math.floor(3 + Math.random() * 2),
        tags: [...cfg.tags],
        tips: [
          "네이버 블로그에서 추천된 장소입니다",
          "방문 전 영업시간을 확인하세요",
        ],
        openHours: "영업시간 확인 필요",
        lastUpdated: new Date().toISOString().slice(0, 7),
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      };

      allResults.push(place);
      added++;
    }
    console.log(`   ✓ ${added}개 추가 (총 ${allResults.length}개)`);
  }

  // ---- TypeScript 파일로 저장 ----
  const outDir = path.join(__dirname, "../src/data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "collected-places.ts");

  // 수동 템플릿 생성 (JSON.stringify보다 안전)
  const lines = [
    'import type { Place } from "./places";',
    "",
    `// 네이버 블로그 자동 수집 데이터 (${new Date().toISOString().slice(0, 10)})`,
    `export const collectedPlaces: Place[] = [`,
  ];

  for (const p of allResults) {
    lines.push("  {");
    lines.push(`    id: ${JSON.stringify(p.id)},`);
    lines.push(`    city: ${JSON.stringify(p.city)},`);
    lines.push(`    name: ${JSON.stringify(p.name)},`);
    lines.push(`    nameEn: ${JSON.stringify(p.nameEn)},`);
    lines.push(`    category: ${JSON.stringify(p.category)},`);
    lines.push(`    neighborhood: ${JSON.stringify(p.neighborhood)},`);
    lines.push(`    description: ${JSON.stringify(p.description)},`);
    lines.push(`    shortDesc: ${JSON.stringify(p.shortDesc)},`);
    lines.push(`    address: ${JSON.stringify(p.address)},`);
    lines.push(`    lat: ${p.lat},`);
    lines.push(`    lng: ${p.lng},`);
    lines.push(`    rating: ${p.rating.toFixed(1)},`);
    lines.push(`    priceLevel: ${p.priceLevel},`);
    lines.push(`    isFree: ${p.isFree},`);
    lines.push(`    recommendScore: ${p.recommendScore},`);
    lines.push(`    tags: ${JSON.stringify(p.tags)},`);
    lines.push(`    tips: ${JSON.stringify(p.tips)},`);
    lines.push(`    openHours: ${JSON.stringify(p.openHours)},`);
    lines.push(`    lastUpdated: ${JSON.stringify(p.lastUpdated)},`);
    lines.push(`    image: ${JSON.stringify(p.image)},`);
    lines.push("  },");
  }

  lines.push("];");
  lines.push("");

  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  console.log("\n" + "=".repeat(50));
  console.log(`✅ 총 ${allResults.length}개 장소 수집 완료!`);
  console.log(`📁 저장: ${outPath}`);
  console.log("\n📌 다음 단계:");
  console.log("   1. collected-places.ts 품질 검토");
  console.log("   2. vancouver.ts / places.ts 에 수동으로 합치기");
  console.log("=".repeat(50) + "\n");
}

main().catch((err) => {
  console.error("\n❌ 오류 발생:", err.message);
  process.exit(1);
});
