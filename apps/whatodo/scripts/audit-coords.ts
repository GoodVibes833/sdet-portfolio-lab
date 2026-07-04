import fs from "fs";
import { haversineDistance } from "../src/lib/utils";

const CITIES: Record<string, { lat: number; lng: number }> = {
  toronto: { lat: 43.6532, lng: -79.3832 },
  vancouver: { lat: 49.2827, lng: -123.1207 },
  montreal: { lat: 45.5017, lng: -73.5673 },
  ottawa: { lat: 45.4215, lng: -75.6972 },
  calgary: { lat: 51.0447, lng: -114.0719 },
  edmonton: { lat: 53.5461, lng: -113.4938 },
  victoria: { lat: 48.4284, lng: -123.3656 },
  winnipeg: { lat: 49.8951, lng: -97.1384 },
};

const CHAINS = [
  "Starbucks","Tim Hortons","McDonald","Subway","Wendy","A&W","Popeyes",
  "Chipotle","KFC","Taco Bell","Burger King","Dairy Queen","Five Guys",
  "Pizza Pizza","Pizza Hut","Domino","Papa John","Little Caesars",
  "bb.q Chicken","Cheesecake Factory","Olive Garden","Boston Pizza",
  "Swiss Chalet","Montana","East Side Mario","Milestone","Kelseys",
  "Jack Astor","The Keg","Cactus Club","Earls","Joey","Moxies",
];

function isChain(name: string) {
  return CHAINS.some((c) => name.toLowerCase().includes(c.toLowerCase()));
}

for (const [city, center] of Object.entries(CITIES)) {
  const path = `public/data/${city}.json`;
  let data: any[] = [];
  try {
    data = JSON.parse(fs.readFileSync(path, "utf8"));
  } catch { continue; }

  const suspects = data
    .map((p) => ({
      ...p,
      _dist: haversineDistance(center.lat, center.lng, p.lat, p.lng),
    }))
    .filter((p) => p._dist > 10 || (isChain(p.name) && p._dist > 5));

  if (suspects.length > 0) {
    console.log(`\n=== ${city.toUpperCase()} (${data.length}개) ===`);
    for (const p of suspects.slice(0, 15)) {
      console.log(
        `  ${p.name} | ${p._dist.toFixed(1)}km | ${p.address || "주소없음"} | lat:${p.lat}, lng:${p.lng}`
      );
    }
    if (suspects.length > 15) {
      console.log(`  ... 외 ${suspects.length - 15}개`);
    }
  }
}

console.log("\n✅ Audit 완료. 위 장소들의 좌표를 확인하세요.");
