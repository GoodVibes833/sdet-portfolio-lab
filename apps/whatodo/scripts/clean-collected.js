/**
 * collected-places.ts 데이터 정리 스크립트
 * 이상한 제목, 문장형 이름, 날짜 등 제거
 */
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/data/collected-places.ts");
const content = fs.readFileSync(filePath, "utf8");

// 객체 블록 분리: "  {" 로 시작하는 블록들
const objectRegex = /  \{[\s\S]*?\n  \},?/g;
const allBlocks = content.match(objectRegex) || [];

// 헤더: 첫 "  {" 전까지
const firstObjIdx = content.indexOf("  {");
const header = content.slice(0, firstObjIdx);

const badPatterns = [
  /^\d+$/, /^\d+월/, /^\d+일/, /^D\+/, /^day/i,
  /\.\.\./, /!!!/, /^워홀/, /^캐나다/, /^여행/, /^일상/,
  /^밴쿠버$/, /^토론토$/, /일차$/, /회$/, /ep\./i,
  /blog/i, /블로그/i, /후기$/, /기록$/, /정리$/, /총정리/,
  /가이드/, /tip/i, /꿀팁/, /추천$/,
];

function tooManyWords(name) {
  return name.split(/\s+/).filter(w => w.length > 0).length > 6;
}

function getChosung(str) {
  const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  return str.split("").map(c => {
    const code = c.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return c;
    return cho[Math.floor(code / 588)];
  }).join("");
}

const seenNames = new Set();
const seenChosung = new Set();
let removed = 0;
const cleaned = [];

for (const block of allBlocks) {
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  if (!nameMatch) continue;
  const name = nameMatch[1];

  let isBad = false;
  for (const p of badPatterns) {
    if (p.test(name)) { isBad = true; break; }
  }
  if (!isBad && tooManyWords(name)) isBad = true;

  if (!isBad) {
    const cs = getChosung(name);
    if (seenNames.has(name) || seenChosung.has(cs)) {
      isBad = true;
    } else {
      seenNames.add(name);
      seenChosung.add(cs);
    }
  }

  if (isBad) {
    removed++;
  } else {
    cleaned.push(block);
  }
}

console.log(`총 ${allBlocks.length}개 중 ❌ ${removed}개 제거 → ✅ ${cleaned.length}개 남음`);

if (cleaned.length === 0) {
  console.log("⚠️  남은 데이터가 없습니다! 원본 유지합니다.");
  process.exit(0);
}

// 마지막 블록: 쉼표 추가, trailing `]);` 제거
let last = cleaned[cleaned.length - 1];
last = last.replace(/\]\s*\)\s*as\s*unknown\s*as\s*Place\[\];?\s*$/g, "");
last = last.replace(/;\s*$/g, "");
if (!last.trimEnd().endsWith(",")) {
  last = last.trimEnd() + ",\n";
}
cleaned[cleaned.length - 1] = last;

// 조합
const out = header + cleaned.join("") + "]) as unknown as Place[];\n";
fs.writeFileSync(filePath, out, "utf8");

console.log(`📁 저장 완료: ${filePath}`);
console.log("\n다음: npm run build");
