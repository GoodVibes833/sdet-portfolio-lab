/**
 * Yelp API로 새로운 장소를 수집해 기존 JSON에 병합합니다.
 * Toronto, Vancouver 중심으로 restaurants, cafes, bars, parks 등 검색
 */
import fs from "fs";

const API_KEY = process.env.NEXT_PUBLIC_YELP_API_KEY || process.env.YELP_API_KEY;
if (!API_KEY) {
  console.error("❌ Yelp API 키가 없습니다. .env.local 확인");
  process.exit(1);
}

const CITIES: Record<string, { lat: number; lng: number }> = {
  edmonton: { lat: 53.5461, lng: -113.4938 },
  victoria: { lat: 48.4284, lng: -123.3656 },
  winnipeg: { lat: 49.8951, lng: -97.1384 },
};

const CATEGORIES = [
  "restaurants", "cafes", "bars", "parks", "landmarks",
  "museums", "shopping", "bakery", "dessert", "korean",
  "japanese", "chinese", "italian", "indian", "mexican",
];

interface YelpBiz {
  id: string;
  name: string;
  coordinates: { latitude: number; longitude: number };
  location: { display_address: string[] };
  rating?: number;
  review_count?: number;
  price?: string;
  categories: { title: string }[];
  image_url?: string;
  url?: string;
}

async function searchYelp(lat: number, lng: number, category: string, offset = 0): Promise<YelpBiz[]> {
  const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}&categories=${category}&limit=50&offset=${offset}&sort_by=best_match&radius=40000`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}`, "Accept": "application/json" },
  });
  if (!res.ok) {
    console.error(`  ⚠️ Yelp API 오류: ${res.status} ${res.statusText}`);
    return [];
  }
  const json = await res.json();
  return json.businesses || [];
}

function toCategory(yelpCats: { title: string }[]): string {
  const map: Record<string, string> = {
    "Korean": "food", "Japanese": "food", "Chinese": "food", "Italian": "food",
    "Indian": "food", "Mexican": "food", "Thai": "food", "Vietnamese": "food",
    "Seafood": "food", "Sushi Bars": "food", "Ramen": "food",
    "Cafes": "cafe", "Coffee": "cafe", "Bakeries": "bakery",
    "Bars": "bar", "Pubs": "bar", "Cocktail Bars": "bar",
    "Parks": "park", "Landmarks": "attraction", "Museums": "attraction",
    "Shopping": "shopping", "Bookstores": "shopping",
  };
  for (const c of yelpCats) {
    if (map[c.title]) return map[c.title];
  }
  return "other";
}

function toPriceLevel(price?: string): number {
  if (!price) return 0;
  return price.length; // "$"→1, "$$"→2, "$$$"→3, "$$$$"→4
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function main() {
  for (const [city, center] of Object.entries(CITIES)) {
    const jsonPath = `public/data/${city}.json`;
    const existing = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const existingCoords = new Set(existing.map((p: any) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`));
    const existingNames = new Set(existing.map((p: any) => p.name.toLowerCase().trim()));
    const newPlaces: any[] = [];

    console.log(`\n=== ${city.toUpperCase()} ===`);
    console.log(`기존: ${existing.length}개`);

    for (const category of CATEGORIES) {
      console.log(`  🔍 ${category} 검색 중...`);
      let offset = 0;
      let total = 0;
      while (offset < 200) { // 최대 200개 (4페이지)
        const businesses = await searchYelp(center.lat, center.lng, category, offset);
        if (businesses.length === 0) break;

        for (const biz of businesses) {
          if (!biz.coordinates || biz.coordinates.latitude == null || biz.coordinates.longitude == null) continue;
          const coordKey = `${biz.coordinates.latitude.toFixed(5)},${biz.coordinates.longitude.toFixed(5)}`;
          const nameLower = biz.name.toLowerCase().trim();

          // 중복 체크: 좌표 또는 이름
          if (existingCoords.has(coordKey) || existingNames.has(nameLower)) continue;

          // 도심 30km 이내
          const dist = getDistance(center.lat, center.lng, biz.coordinates.latitude, biz.coordinates.longitude);
          if (dist > 30) continue;

          const place = {
            id: `yelp_${biz.id}`,
            name: biz.name,
            nameKo: "",
            category: toCategory(biz.categories),
            description: biz.categories.map((c) => c.title).join(", "),
            address: biz.location?.display_address?.join(", ") || "",
            lat: biz.coordinates.latitude,
            lng: biz.coordinates.longitude,
            rating: biz.rating || 0,
            reviewCount: biz.review_count || 0,
            priceLevel: toPriceLevel(biz.price),
            image: biz.image_url || "",
            website: biz.url || "",
            tags: biz.categories.map((c) => c.title),
            source: "yelp",
            createdAt: new Date().toISOString(),
          };

          newPlaces.push(place);
          existingCoords.add(coordKey);
          existingNames.add(nameLower);
          total++;
        }

        offset += 50;
        await new Promise((r) => setTimeout(r, 300)); // rate limit
      }
      console.log(`     → ${total}개 신규`);
    }

    const merged = [...existing, ...newPlaces];
    fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2));
    console.log(`✅ ${city}: 기존 ${existing.length}개 + 신규 ${newPlaces.length}개 = ${merged.length}개`);
  }

  console.log("\n🎉 완료!");
}

main().catch(console.error);
