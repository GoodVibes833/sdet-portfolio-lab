/**
 * Google Places API로 좌표 정확도를 99%로 끌어올립니다.
 * 실행 전 .env.local 에 GOOGLE_PLACES_API_KEY=... 추가 필요
 */
import fs from "fs";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error("❌ GOOGLE_PLACES_API_KEY 환경변수를 설정하세요.");
  console.error("   echo 'GOOGLE_PLACES_API_KEY=your_key' >> .env.local");
  process.exit(1);
}

const CITIES: Record<string, { lat: number; lng: number }> = {
  toronto: { lat: 43.6532, lng: -79.3832 },
  vancouver: { lat: 49.2827, lng: -123.1207 },
  montreal: { lat: 45.5017, lng: -73.5673 },
  ottawa: { lat: 45.4215, lng: -75.6972 },
  calgary: { lat: 51.0447, lng: -114.0719 },
};

async function googleFindPlace(query: string, cityLat: number, cityLng: number) {
  const url = `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-FieldMask": "places.location" },
    body: JSON.stringify({ textQuery: query, locationBias: { circle: { center: { latitude: cityLat, longitude: cityLng }, radius: 50000 } } }),
  });
  const json = await res.json();
  if (!json.places || json.places.length === 0) return null;
  const loc = json.places[0].location;
  return { lat: loc.latitude, lng: loc.longitude };
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function main() {
  let fixed = 0, skipped = 0, failed = 0;
  for (const [city, center] of Object.entries(CITIES)) {
    const path = `public/data/${city}.json`;
    const data = JSON.parse(fs.readFileSync(path, "utf8"));
    console.log(`\n=== ${city.toUpperCase()} (${data.length}개) ===`);

    for (const place of data) {
      if (!place.address) { skipped++; continue; }
      const query = `${place.name} ${place.address}`;
      try {
        const coord = await googleFindPlace(query, center.lat, center.lng);
        if (!coord) { failed++; continue; }
        const dist = haversine(place.lat, place.lng, coord.lat, coord.lng);
        if (dist > 0.5) {
          console.log(`  ✏️ ${place.name} | ${dist.toFixed(2)}km 차이`);
          place.lat = coord.lat;
          place.lng = coord.lng;
          fixed++;
        }
        await new Promise((r) => setTimeout(r, 200)); // rate limit
      } catch (e) {
        failed++;
      }
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }
  console.log(`\n✅ 완료: ${fixed}개 수정, ${skipped}개 주소없음, ${failed}개 실패`);
}

main();
