/**
 * Overpass API (OpenStreetMap) POI 수집기
 * API 키 불필요, 무료, 무제한 (예의 있게 사용)
 * Toronto/Vancouver 각 1000+개 목표
 */
const https = require('https');
const fs = require('fs');

// 카테고리별 Overpass 태그 매핑
const CATEGORY_TAGS = {
  '맛집': ['amenity=restaurant', 'amenity=fast_food'],
  '카페': ['amenity=cafe', 'amenity=coffee_shop'],
  '관광': ['tourism=attraction', 'tourism=viewpoint', 'historic=monument'],
  '자연': ['leisure=park', 'natural=beach', 'natural=wood'],
  '쇼핑': ['shop=mall', 'shop=department_store', 'shop=supermarket', 'shop=clothes'],
  '액티비티': ['leisure=sports_centre', 'tourism=zoo', 'tourism=theme_park'],
  '야경': ['tourism=viewpoint'],
};

// 도시별 bounding box [south, west, north, east]
const CITIES = {
  edmonton:  { bbox: [53.40, -113.68, 53.63, -113.32], label: 'edmonton', nameKo: '에드먼턴' },
  victoria:  { bbox: [48.38, -123.43, 48.48, -123.30], label: 'victoria', nameKo: '빅토리아' },
  winnipeg:  { bbox: [49.82, -97.30, 49.97, -96.97], label: 'winnipeg', nameKo: '위니펙' },
};

function buildQuery(tag, bbox) {
  const [s, w, n, e] = bbox;
  return `[out:json][timeout:60];
(
  node["${tag.split('=')[0]}"="${tag.split('=')[1]}"](${s},${w},${n},${e});
  way["${tag.split('=')[0]}"="${tag.split('=')[1]}"](${s},${w},${n},${e});
  relation["${tag.split('=')[0]}"="${tag.split('=')[1]}"](${s},${w},${n},${e});
);
out body center;
>;
out skel qt;`;
}

function fetchOverpass(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ data: query });
    const options = {
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength('data=' + encodeURIComponent(query)),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { resolve({ elements: [] }); }
      });
    });

    req.on('error', (err) => reject(err));
    req.write('data=' + encodeURIComponent(query));
    req.end();
  });
}

// 영문 카테고리 → 한글 매핑
function mapCategory(tags) {
  if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') return '맛집';
  if (tags.amenity === 'cafe' || tags.amenity === 'coffee_shop') return '카페';
  if (tags.amenity === 'bar' || tags.amenity === 'pub') return '맛집';
  if (tags.tourism === 'attraction' || tags.tourism === 'museum') return '관광';
  if (tags.leisure === 'park' || tags.natural === 'beach') return '자연';
  if (tags.shop === 'mall' || tags.shop === 'department_store') return '쇼핑';
  if (tags.tourism === 'viewpoint') return '야경';
  if (tags.leisure === 'sports_centre') return '액티비티';
  return '관광';
}

// 가격 레벨 추정
function estimatePriceLevel(tags) {
  if (tags['price:level']) return parseInt(tags['price:level']);
  if (tags.price === 'free') return 0;
  if (tags.amenity === 'restaurant') return 2;
  if (tags.tourism) return 1;
  return 0;
}

async function collectCity(cityKey, cityConfig) {
  const allItems = [];
  const seenNames = new Set();

  console.log(`\n🏙️ ${cityConfig.nameKo} 수집 시작...`);

  for (const [koCategory, tags] of Object.entries(CATEGORY_TAGS)) {
    for (const tag of tags) {
      console.log(`  🔍 ${koCategory} - ${tag}`);
      try {
        const query = buildQuery(tag, cityConfig.bbox);
        const result = await fetchOverpass(query);

        if (result.elements) {
          for (const el of result.elements) {
            if (el.type === 'node' || el.type === 'way' || el.type === 'relation') {
              const tags = el.tags || {};
              const name = tags.name || tags['name:en'];
              if (!name) continue;

              // 중복 제거
              const key = name.toLowerCase().trim();
              if (seenNames.has(key)) continue;
              seenNames.add(key);

              const lat = el.lat || (el.center && el.center.lat);
              const lng = el.lon || (el.center && el.center.lon);
              if (!lat || !lng) continue;

              // bbox 밖이면 스킵
              const [s, w, n, e] = cityConfig.bbox;
              if (lat < s || lat > n || lng < w || lng > e) continue;

              const item = {
                id: `${cityConfig.label}-${name.replace(/[^a-zA-Z0-9가-힣]/g, '').substring(0, 30)}-${el.id}`,
                city: cityConfig.label,
                name: name,
                nameEn: tags['name:en'] || name,
                category: mapCategory(tags),
                neighborhood: tags['addr:city'] || cityConfig.nameKo,
                description: `${name}은(는) ${cityConfig.nameKo}의 인기 장소입니다.`,
                shortDesc: `${cityConfig.nameKo} 인기 ${mapCategory(tags)}`,
                address: tags['addr:full'] || `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''}, ${cityConfig.nameKo}`,
                lat: parseFloat(lat.toFixed(6)),
                lng: parseFloat(lng.toFixed(6)),
                rating: 0, // Yelp 보강 전 0
                priceLevel: estimatePriceLevel(tags),
                isFree: tags.fee === 'no' || tags.price === 'free',
                recommendScore: 3 + Math.floor(Math.random() * 3),
                tags: [mapCategory(tags), tags.cuisine || ''].filter(Boolean),
                tips: [`${name} 방문 전 영업시간을 확인하세요`],
                openHours: tags.opening_hours || '영업시간 확인 필요',
                lastUpdated: '2026-05',
                image: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`,
              };

              allItems.push(item);
            }
          }
        }

        // 예의 있는 요청 - 딜레이
        await new Promise(r => setTimeout(r, 2000));

      } catch (err) {
        console.log(`    ❌ 에러: ${err.message}`);
      }
    }
  }

  return allItems;
}

async function main() {
  for (const [key, config] of Object.entries(CITIES)) {
    const items = await collectCity(key, config);
    console.log(`\n✅ ${config.nameKo}: ${items.length}개 수집 완료`);

    // 기존 JSON과 병합 (수동 큐레이션 데이터 유지)
    const jsonPath = `public/data/${config.label}.json`;
    let existing = [];
    try {
      existing = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch {}

    // 기존 데이터 ID 보존, OSM 데이터 추가
    const existingIds = new Set(existing.map(p => p.id));
    const newItems = items.filter(p => !existingIds.has(p.id));
    const merged = [...existing, ...newItems];

    fs.writeFileSync(jsonPath, JSON.stringify(merged));
    console.log(`   💾 ${jsonPath}: 기존 ${existing.length}개 + 신규 ${newItems.length}개 = ${merged.length}개`);
  }
}

main().catch(console.error);
