/**
 * collected-places.ts 재작성 스크립트
 * 블로그 문구 제거 + description/tips 재작성
 */
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/data/collected-places.ts");
const content = fs.readFileSync(filePath, "utf8");

// 객체 블록 분리
const objectRegex = /  \{[\s\S]*?\n  \},?/g;
const blocks = content.match(objectRegex) || [];
const header = content.slice(0, content.indexOf("  {"));

// 블로그 문구 제거 패턴
const blogPatterns = [
  /네이버 블로그에서 추천된 장소입니다/g,
  /방문 전 영업시간을 확인하세요/g,
  /- 밴쿠버 .*에서 추천된 장소입니다/g,
  /- 토론토 .*에서 추천된 장소입니다/g,
  /추천된 장소입니다/g,
  /블로그/g,
];

// name에서 블로그 문법 제거 (감탄사, 물음표, "나만알고싶은", "급부상" 등)
function cleanName(name) {
  return name
    .replace(/^나만알고싶은\s+/g, "")
    .replace(/\?$/g, "")
    .replace(/!$/g, "")
    .replace(/급부상/g, "")
    .replace(/추천$/g, "")
    .replace(/한눈에/g, "")
    .replace(/대박/g, "")
    .replace(/꿀팁/g, "")
    .replace(/데이트/g, "")
    .replace(/힙한/g, "")
    .replace(/감성/g, "")
    .replace(/숨은/g, "")
    .replace(/핫플/g, "")
    .trim();
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanDesc(desc, name, city, category) {
  let d = desc;
  for (const p of blogPatterns) d = d.replace(p, "");
  d = d.replace(/- Vancouver, BC/g, "").replace(/, Vancouver, BC/g, "");
  d = d.replace(/- Toronto, ON/g, "").replace(/, Toronto, ON/g, "");
  d = d.replace(new RegExp(escapeRegExp(name), "g"), name);
  d = d.replace(/\s+/g, " ").trim();
  if (!d || d.length < 10) {
    return `${name}은(는) ${city === "vancouver" ? "밴쿠버" : "토론토"}에서 인기 있는 ${category}입니다.`;
  }
  return d;
}

function cleanTips(tips) {
  return tips
    .filter((t) => !/네이버|블로그|추천된|영업시간 확인/.test(t))
    .map((t) => {
      if (/인기가 많은/g.test(t)) return "주말에는 대기가 있을 수 있어요";
      if (/분위기/g.test(t)) return "분위기 좋은 좌석이 인기입니다";
      return t;
    })
    .slice(0, 2);
}

const categoryMap = {
  "카페": "카페", "맛집": "맛집", "디저트": "디저트 가게",
  "핫플": "핫플레이스", "쇼핑": "쇼핑 스팟", "액티비티": "액티비티",
  "야경": "야경 명소", "펍": "펍/바", "뷰": "뷰 포인트",
  "실내": "실내 액티비티", "캠핑": "캠핑", "여행": "여행지",
};

const cityMap = { vancouver: "밴쿠버", toronto: "토론토" };

const genericTips = [
  "주말에는 혼잡할 수 있으니 평일 방문을 추천합니다",
  "오픈런을 하시면 더 여유롭게 즐길 수 있어요",
  "인기 메뉴는 미리 확인하고 가면 좋아요",
  "현지인들에게 인기 있는 시간대는 저녁이에요",
  "주차 공간이 협소할 수 있으니 대중교통 이용을 추천합니다",
  "계절마다 다른 매력을 느낄 수 있는 곳이에요",
  "예약이 가능하다면 미리 해두는 게 안전합니다",
  "테이크아웃이 가능하면 줄을 기다리지 않아도 돼요",
];

function getRandomTips(count) {
  const shuffled = [...genericTips].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const cleaned = [];

for (const block of blocks) {
  // 필드 추출
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  const cityMatch = block.match(/city:\s*"([^"]+)"/);
  const catMatch = block.match(/category:\s*"([^"]+)"/);
  const descMatch = block.match(/description:\s*"([^"]+)"/);
  const shortMatch = block.match(/shortDesc:\s*"([^"]+)"/);
  const tipsMatch = block.match(/tips:\s*\[([^\]]*)\]/);

  if (!nameMatch) continue;

  let name = cleanName(nameMatch[1]);
  const city = cityMatch ? cityMatch[1] : "vancouver";
  const cat = catMatch ? catMatch[1] : "카페";
  const catLabel = categoryMap[cat] || cat;
  const cityLabel = cityMap[city] || city;

  if (!name) name = `${cityLabel} ${catLabel}`;

  // id 재생성
  const safeName = name.replace(/[^a-zA-Z0-9가-힣]/g, "").slice(0, 20);
  const newId = `${city}-${safeName}-${Math.floor(Math.random() * 10000)}`;

  // description 재작성
  let desc = descMatch ? descMatch[1] : "";
  desc = cleanDesc(desc, name, city, catLabel);

  // shortDesc 재작성
  let shortDesc = `${cityLabel} 인기 ${catLabel}`;

  // tips 재작성
  let tips = getRandomTips(2);
  if (tipsMatch) {
    const rawTips = tipsMatch[1]
      .split('","')
      .map((t) => t.replace(/^"/, "").replace(/"$/, ""));
    const filtered = cleanTips(rawTips);
    if (filtered.length > 0) tips = filtered;
  }

  // address에서 블로그 문구 제거
  let addr = `${name}, ${cityLabel}`;
  const addrMatch = block.match(/address:\s*"([^"]+)"/);
  if (addrMatch) {
    addr = addrMatch[1].replace(/네이버|블로그|추천/g, "").trim();
    if (addr.length < 5 || /, Vancouver, BC|Vancouver, BC|Toronto, ON/.test(addr)) {
      addr = `${name}, ${cityLabel}`;
    }
  }

  // nameEn도 name으로 통일
  const nameEn = name;

  // 새 블록 조립
  const newBlock = block
    .replace(/id:\s*"[^"]+"/, `id: "${newId}"`)
    .replace(/name:\s*"[^"]+"/, `name: "${name}"`)
    .replace(/nameEn:\s*"[^"]+"/, `nameEn: "${nameEn}"`)
    .replace(/description:\s*"[^"]+"/, `description: "${desc}"`)
    .replace(/shortDesc:\s*"[^"]+"/, `shortDesc: "${shortDesc}"`)
    .replace(/tips:\s*\[[^\]]*\]/, `tips: ["${tips.join('","')}"]`)
    .replace(/address:\s*"[^"]+"/, `address: "${addr}"`)
    .replace(/openHours:\s*"[^"]+"/, `openHours: "영업시간 확인 필요"`);

  cleaned.push(newBlock);
}

console.log(`✅ ${cleaned.length}개 재작성 완료`);

// 마지막 블록 trailing comma
let last = cleaned[cleaned.length - 1];
last = last.replace(/\]\s*\)\s*as\s*unknown\s*as\s*Place\[\];?\s*$/g, "");
last = last.replace(/;\s*$/g, "");
if (!last.trimEnd().endsWith(",")) {
  last = last.trimEnd() + ",\n";
}
cleaned[cleaned.length - 1] = last;

const out = header + cleaned.join("") + "]) as unknown as Place[];\n";
fs.writeFileSync(filePath, out, "utf8");

console.log(`📁 저장 완료: ${filePath}`);
