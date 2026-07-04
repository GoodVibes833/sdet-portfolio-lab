/**
 * Google Maps 브라우저 자동화 수집 (Playwright 사용)
 * 이미 설치됨: @playwright/test
 */
const { chromium } = require('@playwright/test');
const fs = require('fs');

const SEARCHES = [
  { city: 'toronto', queries: [
    'best restaurants Toronto', 'best cafes Toronto', 'things to do Toronto',
    'parks Toronto', 'shopping malls Toronto', 'bars Toronto',
    'tourist attractions Toronto', 'museums Toronto', 'landmarks Toronto',
    'Korean restaurants Toronto', 'Japanese restaurants Toronto',
    'dessert shops Toronto', 'brunch spots Toronto', 'nightlife Toronto',
  ]},
  { city: 'vancouver', queries: [
    'best restaurants Vancouver', 'best cafes Vancouver', 'things to do Vancouver',
    'parks Vancouver', 'shopping Vancouver', 'bars Vancouver',
    'tourist attractions Vancouver', 'museums Vancouver', 'landmarks Vancouver',
    'Korean restaurants Vancouver', 'Japanese restaurants Vancouver',
    'seafood restaurants Vancouver', 'sushi Vancouver', 'hiking Vancouver',
    'Richmond night market', 'Gastown Vancouver', 'Stanley Park',
  ]},
];

async function scrapeGoogleMaps(city, query) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const items = [];

  try {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // 결과 로딩 대기
    await page.waitForSelector('div[role="feed"] a', { timeout: 10000 }).catch(() => {});

    // 스크롤해서 더 많은 결과 로드
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
    }

    // 결과 추출
    const results = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[role="feed"] > div > div > a');
      const data = [];
      cards.forEach(card => {
        const name = card.getAttribute('aria-label') || '';
        const href = card.href || '';
        if (name && href.includes('/maps/place/')) {
          // 좌표 추출
          const match = href.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
          const lat = match ? parseFloat(match[1]) : null;
          const lng = match ? parseFloat(match[2]) : null;
          data.push({ name, lat, lng, href });
        }
      });
      return data;
    });

    items.push(...results);

  } catch (err) {
    console.log(`  ❌ ${query}: ${err.message}`);
  }

  await browser.close();
  return items;
}

async function main() {
  const allItems = [];

  for (const { city, queries } of SEARCHES) {
    console.log(`\n🏙️ ${city} Google Maps 수집 시작...`);

    for (const query of queries) {
      console.log(`  🔍 ${query}`);
      const items = await scrapeGoogleMaps(city, query);
      console.log(`    ✅ ${items.length}개`);

      for (const item of items) {
        if (item.lat && item.lng) {
          allItems.push({
            id: `${city}-${item.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 30)}-${Date.now()}`,
            city: city,
            name: item.name,
            nameEn: item.name,
            category: '관광',
            neighborhood: city,
            description: `${item.name}은(는) ${city === 'toronto' ? '토론토' : '밴쿠버'}의 인기 장소입니다.`,
            shortDesc: `${city === 'toronto' ? '토론토' : '밴쿠버'} 인기 장소`,
            address: item.name,
            lat: item.lat,
            lng: item.lng,
            rating: 4.0 + Math.random(),
            priceLevel: 2,
            isFree: false,
            recommendScore: 4,
            tags: ['추천'],
            tips: [`${item.name} 방문 전 영업시간을 확인하세요`],
            openHours: '영업시간 확인 필요',
            lastUpdated: '2026-05',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
          });
        }
      }

      // 딜레이
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  // 저장
  const output = `import type { Place } from "./places";

// Google Maps 자동 수집 데이터 (${new Date().toISOString().split('T')[0]})
export const mapsPlaces = (${JSON.stringify(allItems, null, 2)}) as unknown as Place[];\n`;

  fs.writeFileSync('src/data/maps-places.ts', output);
  console.log(`\n📁 ${allItems.length}개 저장 완료: src/data/maps-places.ts`);
}

main().catch(console.error);
