/**
 * 모든 수집 데이터 병합 + 검증 + 중복 제거
 * 결과를 각 도시 파일(vancouver.ts, toronto.ts 등)에 추가
 */
const fs = require('fs');

function loadPlaces(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/\((\[[\s\S]*\])\)/);
  if (!match) return [];
  try { return JSON.parse(match[1]); } catch { return []; }
}

function isValidPlace(p) {
  if (!p.name || p.name.length < 2) return false;
  if (!p.lat || !p.lng) return false;
  if (p.lat === 0 && p.lng === 0) return false;
  if (p.name.includes('undefined') || p.name.includes('null')) return false;
  if (/^\d/.test(p.name) && p.name.length < 5) return false; // 날짜/숫자로 시작하는 짧은 이름
  return true;
}

function deduplicate(places) {
  const seen = new Map();
  const result = [];

  for (const p of places) {
    // 이름+좌표로 키 생성 (반올림해서 비슷한 위치 묶기)
    const latRounded = Math.round(p.lat * 100) / 100;
    const lngRounded = Math.round(p.lng * 100) / 100;
    const key = `${p.name.toLowerCase().trim()}_${latRounded}_${lngRounded}`;

    if (!seen.has(key)) {
      seen.set(key, p);
      result.push(p);
    }
  }

  return result;
}

function generatePlaceObject(p, index) {
  const comma = index < 0 ? '' : ',';
  return `  {
    id: "${p.id}",
    city: "${p.city}",
    name: "${p.name}",
    nameEn: "${p.nameEn}",
    category: "${p.category}",
    neighborhood: "${p.neighborhood}",
    description:
      "${p.description}",
    shortDesc: "${p.shortDesc}",
    address: "${p.address}",
    lat: ${p.lat},
    lng: ${p.lng},
    rating: ${p.rating},
    priceLevel: ${p.priceLevel},
    isFree: ${p.isFree},
    recommendScore: ${p.recommendScore},
    tags: ${JSON.stringify(p.tags)},
    tips: ${JSON.stringify(p.tips)},
    openHours: "${p.openHours}",
    lastUpdated: "${p.lastUpdated}",
    image: "${p.image}",
  }${comma}`;
}

async function main() {
  console.log('📦 데이터 병합 시작...\n');

  // 1. 기존 데이터 로드
  const existingVancouver = loadPlaces('src/data/vancouver.ts');
  const existingToronto = [];
  const existingCollected = loadPlaces('src/data/collected-places.ts');
  const osmData = loadPlaces('src/data/osm-places.ts');
  const mapsData = loadPlaces('src/data/maps-places.ts');

  console.log(`기존 vancouver.ts: ${existingVancouver.length}개`);
  console.log(`기존 collected: ${existingCollected.length}개`);
  console.log(`OSM 수집: ${osmData.length}개`);
  console.log(`Maps 수집: ${mapsData.length}개`);

  // 2. 모든 데이터 합치기
  const allData = [
    ...existingVancouver,
    ...existingCollected,
    ...osmData,
    ...mapsData,
  ];

  // 3. 검증
  const valid = allData.filter(isValidPlace);
  console.log(`\n✅ 검증 통과: ${valid.length} / ${allData.length}`);

  // 4. 중복 제거
  const unique = deduplicate(valid);
  console.log(`✅ 중복 제거 후: ${unique.length}개`);

  // 5. 도시별 분리
  const vancouverItems = unique.filter(p => p.city === 'vancouver');
  const torontoItems = unique.filter(p => p.city === 'toronto');
  const otherItems = unique.filter(p => !['vancouver', 'toronto'].includes(p.city));

  console.log(`\n🏙️ 밴쿠버: ${vancouverItems.length}개`);
  console.log(`🏙️ 토론토: ${torontoItems.length}개`);
  console.log(`🏙️ 기타: ${otherItems.length}개`);

  // 6. vancouver.ts 업데이트
  if (vancouverItems.length > 0) {
    const header = `import type { Place } from "./places";

export const vancouverPlaces: Place[] = [`;
    const body = vancouverItems.map((p, i) => generatePlaceObject(p, i)).join('\n');
    const footer = `];\n`;
    fs.writeFileSync('src/data/vancouver.ts', header + '\n' + body + '\n' + footer);
    console.log(`\n📁 vancouver.ts 업데이트 완료 (${vancouverItems.length}개)`);
  }

  // 7. 토론토는 places.ts에 inline으로 있음 - 별도 toronto.ts 생성
  if (torontoItems.length > 0) {
    const header = `import type { Place } from "./places";

export const torontoPlaces: Place[] = [`;
    const body = torontoItems.map((p, i) => generatePlaceObject(p, i)).join('\n');
    const footer = `];\n`;
    fs.writeFileSync('src/data/toronto-collected.ts', header + '\n' + body + '\n' + footer);
    console.log(`📁 toronto-collected.ts 생성 완료 (${torontoItems.length}개)`);
  }

  console.log('\n🎉 병합 완료!');
}

main().catch(console.error);
