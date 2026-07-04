/**
 * OpenStreetMap Overpass API fetcher + Place 타입 변환 모듈
 * 완전 무료, API 키 불필요
 */

import type { Place, City, Category, Neighborhood } from "@/data/places";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// ── Overpass QL 빌더 ──────────────────────────────────────────

// 모든 카테고리 amenity 필터 (최대 커버리지)
export const ALL_AMENITY_FILTERS = [
  "restaurant", "cafe", "fast_food", "bakery", "bar", "pub", "ice_cream",
  "food_court", "biergarten", "juice_bar", "bubble_tea", "sushi",
  "cinema", "theatre", "nightclub", "casino",
  "hospital", "clinic", "pharmacy", "dentist",
  "bank", "atm", "post_office",
  "fuel", "car_wash", "car_rental",
  "library", "community_centre", "place_of_worship",
];

export const ALL_TOURISM_FILTERS = [
  "attraction", "museum", "gallery", "viewpoint",
  "hotel", "hostel", "motel", "guest_house", "resort",
  "theme_park", "zoo", "aquarium", "spa",
  "information", "camp_site", "caravan_site",
];

export const ALL_SHOP_FILTERS = [
  "convenience", "supermarket", "mall", "pastry",
  "clothes", "electronics", "books", "sports",
  "beauty", "hairdresser", "jewelry", "optician",
  "furniture", "florist", "gift", "toys",
  "alcohol", "butcher", "seafood", "deli", "greengrocer",
  "asian", "korean", "japanese", "chinese", "grocery",
];

export const ALL_LEISURE_FILTERS = [
  "park", "sports_centre", "fitness_centre",
  "swimming_pool", "golf_course", "bowling_alley",
  "playground", "marina", "sauna",
];

export const ALL_NATURAL_FILTERS = [
  "beach", "wood", "water", "peak", "lake",
];

interface OverpassQuery {
  cityName: string;
  areaId?: number;
  bbox?: [number, number, number, number]; // [south, west, north, east]
  amenityFilters?: string[];
  tourismFilters?: string[];
  shopFilters?: string[];
  leisureFilters?: string[];
  naturalFilters?: string[];
  limit?: number;
}

function buildOverpassQL(q: OverpassQuery): string {
  const clauses: string[] = [];
  const scope = q.bbox
    ? `(${q.bbox[0]},${q.bbox[1]},${q.bbox[2]},${q.bbox[3]})`
    : `(area.searchArea)`;

  q.amenityFilters?.forEach((a) => {
    clauses.push(`node["amenity"="${a}"]${scope};`);
    clauses.push(`way["amenity"="${a}"]${scope};`);
  });
  q.tourismFilters?.forEach((t) => {
    clauses.push(`node["tourism"="${t}"]${scope};`);
    clauses.push(`way["tourism"="${t}"]${scope};`);
  });
  q.shopFilters?.forEach((s) => {
    clauses.push(`node["shop"="${s}"]${scope};`);
    clauses.push(`way["shop"="${s}"]${scope};`);
  });
  q.leisureFilters?.forEach((l) => {
    clauses.push(`node["leisure"="${l}"]${scope};`);
    clauses.push(`way["leisure"="${l}"]${scope};`);
  });
  q.naturalFilters?.forEach((n) => {
    clauses.push(`node["natural"="${n}"]${scope};`);
    clauses.push(`way["natural"="${n}"]${scope};`);
  });

  if (q.bbox) {
    return `[out:json][timeout:180];\n(\n${clauses.map((c) => "  " + c).join("\n")}\n);\nout center body;`;
  } else {
    const areaLine = q.areaId
      ? `area(${q.areaId})->.searchArea;`
      : `area["name"="${q.cityName}"]->.searchArea;`;
    return `[out:json][timeout:180];\n${areaLine}\n(\n${clauses.map((c) => "  " + c).join("\n")}\n);\nout center body;`;
  }
}

// ── OSM 응답 타입 ───────────────────────────────────────────────

interface OsmElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OsmResponse {
  elements: OsmElement[];
}

// 관광과 무관해서 수집하지 않을 amenity 목록
const SKIP_AMENITY = new Set([
  "bank", "atm", "post_office", "bureau_de_change",
  "pharmacy", "dentist", "hospital", "clinic", "doctors", "veterinary",
  "fuel", "car_wash", "car_rental", "charging_station",
  "police", "fire_station", "courthouse",
  "community_centre", "place_of_worship", "social_facility",
  "library", "embassy",
  "recycling", "waste_disposal", "toilets",
]);

// ── 태그 → Category 매핑 ────────────────────────────────────────

function tagsToCategory(tags: Record<string, string>): Category | null {
  const a = tags.amenity || "";
  const t = tags.tourism || "";
  const s = tags.shop || "";
  const l = tags.leisure || "";
  const n = tags.natural || "";
  const cuisine = tags.cuisine || "";

  // 관광 무관 제외
  if (SKIP_AMENITY.has(a)) return null;

  // 음식/카페
  if (a === "restaurant" || a === "fast_food" || a === "food_court" || a === "biergarten") return "맛집";
  if (a === "cafe" || a === "bakery" || a === "ice_cream" || a === "juice_bar" || a === "bubble_tea") return "카페";

  // 야경/바
  if (a === "bar" || a === "pub" || a === "nightclub" || a === "casino") return "야경";
  if (t === "viewpoint" || a === "observation_platform") return "야경";

  // 관광
  if (a === "cinema" || a === "theatre" || a === "arts_centre") return "관광";
  if (t === "attraction" || t === "museum" || t === "gallery" || t === "zoo" || t === "aquarium" || t === "theme_park") return "관광";
  if (t === "hotel" || t === "hostel" || t === "motel" || t === "guest_house" || t === "resort" || t === "spa") return "관광";

  // 자연
  if (l === "park" || l === "nature_reserve" || l === "garden") return "자연";
  if (n === "beach" || n === "wood" || n === "water" || n === "peak") return "자연";
  if (l === "marina") return "자연";

  // 스포츠
  if (l === "sports_centre" || l === "fitness_centre" || l === "swimming_pool" || l === "golf_course" || l === "bowling_alley") return "스포츠";
  if (a === "stadium" || a === "sports_centre") return "스포츠";

  // 쇼핑
  if (s) return "쇼핑";
  if (a === "marketplace") return "쇼핑";

  // cuisine 기반 fallback
  if (cuisine) return "맛집";

  // 나머지 tourism
  if (t) return "관광";

  return null; // 카테고리 불명확 → 수집 제외
}

// ── 태그 → Tags 배열 ──────────────────────────────────────────

function tagsToTags(tags: Record<string, string>): string[] {
  const out: string[] = [];
  const cuisine = tags.cuisine || "";

  if (cuisine.includes("korean")) out.push("한식");
  if (cuisine.includes("japanese")) out.push("일식");
  if (cuisine.includes("sushi")) out.push("스시");
  if (cuisine.includes("chinese")) out.push("중식");
  if (cuisine.includes("vietnamese")) out.push("쌀국수", "베트남");
  if (cuisine.includes("thai")) out.push("태국", "똠양꿍");
  if (cuisine.includes("mexican")) out.push("멕시칸", "타코");
  if (cuisine.includes("italian")) out.push("이탈리안", "파스타");
  if (cuisine.includes("french")) out.push("프렌치");
  if (cuisine.includes("indian")) out.push("인도", "커리");
  if (cuisine.includes("burger")) out.push("버거");
  if (cuisine.includes("pizza")) out.push("피자");
  if (cuisine.includes("bbq")) out.push("바비큐");
  if (cuisine.includes("seafood")) out.push("씨푸드", "해산물");
  if (cuisine.includes("steak")) out.push("스테이크");
  if (cuisine.includes("ramen")) out.push("라멘");
  if (cuisine.includes("dessert") || tags.amenity === "ice_cream" || tags.shop === "pastry") {
    out.push("디저트");
  }
  if (tags.amenity === "cafe") out.push("카페");
  if (tags.amenity === "bakery") out.push("베이커리");
  if (tags.takeaway === "yes") out.push("포장가능");
  if (tags.delivery === "yes") out.push("배달가능");
  if (tags.wifi === "yes") out.push("와이파이");
  if (tags.outdoor_seating === "yes") out.push("야외석");
  if (tags.reservation === "yes") out.push("예약필수");
  if (tags.reservation === "recommended") out.push("예약권장");
  if (tags.diet_vegan === "yes") out.push("비건");
  if (tags.diet_halal === "yes") out.push("할랄");
  if (tags.diet_gluten_free === "yes") out.push("글루텐프리");
  if (tags.opening_hours) out.push("영업시간확인");
  if (tags.website || tags["url:official"]) out.push("공식웹사이트있음");

  // avoid duplicates
  return [...new Set(out)];
}

// ── neighborhood 추정 ─────────────────────────────────────────

function guessNeighborhood(tags: Record<string, string>, city: City): Neighborhood {
  const addr = tags["addr:street"] || tags["addr:district"] || "";
  const lower = addr.toLowerCase();

  if (city === "toronto") {
    if (lower.includes("yonge") || lower.includes("bloor") || lower.includes("university")) return "다운타운";
    if (lower.includes("york") || lower.includes("finch")) return "노스욕";
    if (lower.includes("mississauga")) return "미시사가";
    if (lower.includes("scarborough")) return "스카버러";
    if (lower.includes("china")) return "차이나타운";
    if (lower.includes("kensington")) return "켄싱턴";
    if (lower.includes("yorkville")) return "요크빌";
    return "다운타운";
  }
  if (city === "vancouver") {
    if (lower.includes("stanley")) return "스탠리파크";
    if (lower.includes("gastown")) return "개스타운";
    if (lower.includes("granville")) return "그랜빌";
    if (lower.includes("kitsilano")) return "키칠라노";
    if (lower.includes("richmond")) return "리치몬드";
    if (lower.includes("north van")) return "노스밴쿠버";
    return "다운타운";
  }
  if (city === "montreal") {
    if (lower.includes("old port") || lower.includes("vieux")) return "올드포트";
    if (lower.includes("mile end")) return "밀레엔드";
    if (lower.includes("laurent")) return "생로랑";
    return "다운타운몬트리올";
  }

  // default fallback per city
  const fallback: Record<string, Neighborhood> = {
    toronto: "다운타운",
    vancouver: "다운타운",
    montreal: "다운타운몬트리올",
    calgary: "다운타운캘거리",
    edmonton: "다운타운에드먼턴",
    ottawa: "다운타운오타와",
    victoria: "다운타운빅토리아",
    winnipeg: "다운타운",
  };
  return fallback[city] ?? "다운타운";
}

// ── priceLevel 추정 ─────────────────────────────────────────────

function guessPriceLevel(tags: Record<string, string>): 0 | 1 | 2 | 3 {
  const price = tags["price:range"] || tags.price || "";
  if (price.includes("€€€")) return 3;
  if (price.includes("€€")) return 2;
  if (price.includes("€")) return 1;
  return 1;
}

// ── OSM Element → Place 변환 ────────────────────────────────────

function osmElementToPlace(el: OsmElement, city: City): Place | null {
  const tags = el.tags || {};
  const name = tags.name || tags["name:en"] || tags.brand || "";
  if (!name) return null; // 이름 없으면 skip

  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (lat == null || lng == null) return null;

  const category = tagsToCategory(tags);
  if (!category) return null; // 관광 무관 → 수집 제외

  const placeTags = tagsToTags(tags);
  const neighborhood = guessNeighborhood(tags, city);
  const priceLevel = guessPriceLevel(tags);
  const now = new Date();
  const lastUpdated = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return {
    id: `osm-${el.type}-${el.id}`,
    name: name,
    nameEn: tags["name:en"] || name,
    city,
    category,
    neighborhood,
    description: tags.description || `${name}은(는) ${city}의 ${category}입니다.`,
    shortDesc: tags.description?.slice(0, 60) || `${category} · ${neighborhood}`,
    address: tags["addr:full"] || tags["addr:street"] || "",
    lat,
    lng,
    rating: 0, // OSM에 없음 → Google/Yelp로 보강
    priceLevel,
    tags: placeTags,
    tips: [],
    openHours: tags.opening_hours || undefined,
    website: tags.website || tags["url:official"] || undefined,
    officialWebsite: tags["url:official"] || tags.website || undefined,
    lastUpdated,
    image: "", // OSM에 없음 → 수동 또는 Google 보강
    isFree: priceLevel === 0,
    indoorOutdoor: tags.outdoor_seating === "yes" ? "both" : "indoor",
  };
}

// ── 공개 API ────────────────────────────────────────────────────

export async function fetchOsmPlaces(query: OverpassQuery): Promise<Place[]> {
  const ql = buildOverpassQL(query);

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "whatodo-app/1.0 (https://whatodo-seven.vercel.app)",
      "Accept": "application/json",
    },
    body: new URLSearchParams({ data: ql }).toString(),
  });

  if (!res.ok) {
    throw new Error(`Overpass API error: ${res.status} ${res.statusText}`);
  }

  const data: OsmResponse = await res.json();

  const places = data.elements
    .map((el) => osmElementToPlace(el, query.cityName.toLowerCase() as City))
    .filter((p): p is Place => p !== null);

  // deduplicate by lat/lng rounded to 4 decimals (≈ 11m)
  const seen = new Set<string>();
  const unique: Place[] = [];
  for (const p of places) {
    const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(p);
    }
  }

  return unique;
}

// 토론토 전용 프리셋
export function buildTorontoRestaurantQuery(): OverpassQuery {
  return {
    cityName: "Toronto",
    amenityFilters: ["restaurant", "cafe", "fast_food", "bakery", "bar", "pub", "ice_cream"],
    tourismFilters: ["attraction", "museum", "gallery", "viewpoint"],
    shopFilters: ["convenience", "supermarket", "mall", "pastry"],
    leisureFilters: ["park", "sports_centre"],
    naturalFilters: ["beach", "wood"],
  };
}

// 밴쿠버 전용 프리셋
export function buildVancouverRestaurantQuery(): OverpassQuery {
  return {
    cityName: "Vancouver",
    amenityFilters: ["restaurant", "cafe", "fast_food", "bakery", "bar", "pub"],
    tourismFilters: ["attraction", "museum", "viewpoint"],
    shopFilters: ["convenience", "supermarket", "mall"],
    leisureFilters: ["park", "sports_centre"],
    naturalFilters: ["beach", "wood"],
  };
}
