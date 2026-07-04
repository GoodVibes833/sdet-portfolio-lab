/**
 * Foursquare Places API fetcher
 * 무료: 500회/일, 가입만 하면 카드 불필요
 * https://location.foursquare.com/developer/
 */

import type { Place, City, Neighborhood } from "@/data/places";

const FSQ_BASE = "https://api.foursquare.com/v3/places/search";

// 👉 개발자 콘솔에서 발급한 API Key를 .env.local에 넣으세요
// NEXT_PUBLIC_FSQ_API_KEY=fsq_xxxx...
const API_KEY = process.env.NEXT_PUBLIC_FSQ_API_KEY || "";

interface FsqPlace {
  fsq_id: string;
  name: string;
  geocodes: { main: { latitude: number; longitude: number } };
  location: { address?: string; neighborhood?: string[] };
  categories: { name: string; icon: { prefix: string; suffix: string } }[];
  photos?: { prefix: string; suffix: string }[];
  rating?: number; // 0-10
  price?: number; // 1-4
  hours?: { display?: string };
  tel?: string;
  website?: string;
  description?: string;
}

interface FsqResponse {
  results: FsqPlace[];
}

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  toronto: { lat: 43.6532, lng: -79.3832 },
  vancouver: { lat: 49.2827, lng: -123.1207 },
  montreal: { lat: 45.5019, lng: -73.5674 },
  calgary: { lat: 51.0447, lng: -114.0719 },
  edmonton: { lat: 53.5461, lng: -113.4938 },
  ottawa: { lat: 45.4215, lng: -75.6972 },
  victoria: { lat: 48.4284, lng: -123.3656 },
  winnipeg: { lat: 49.8951, lng: -97.1384 },
};

const FSQ_CAT_MAP: Record<string, string> = {
  "Korean Restaurant": "한식",
  "Japanese Restaurant": "일식",
  "Chinese Restaurant": "중식",
  "Sushi Restaurant": "스시",
  "Ramen Restaurant": "라멘",
  "BBQ Joint": "바비큐",
  "Seafood Restaurant": "씨푸드",
  "Steakhouse": "스테이크",
  "Burger Joint": "버거",
  "Pizza Place": "피자",
  "Café": "카페",
  "Dessert Shop": "디저트",
  "Bakery": "베이커리",
  "Ice Cream Shop": "아이스크림",
  "Bar": "바",
  "Park": "자연",
  "Beach": "해변",
  "Museum": "관광",
  "Art Gallery": "관광",
  "Tourist Attraction": "관광",
  "Shopping Mall": "쇼핑",
  "Supermarket": "마트",
  "Grocery Store": "마트",
};

function fsqToPlace(item: FsqPlace, cityKey: string): Place {
  const catName = item.categories[0]?.name || "";
  const mappedTag = FSQ_CAT_MAP[catName];

  const tags: string[] = [];
  if (mappedTag) tags.push(mappedTag);
  if (item.price) {
    const priceLabels = ["무료", "$", "$$", "$$$"];
    if (item.price <= priceLabels.length) tags.push(priceLabels[item.price - 1]);
  }
  if (item.rating && item.rating >= 8) tags.push("추천");

  const now = new Date();
  return {
    id: `fsq-${item.fsq_id}`,
    name: item.name,
    nameEn: item.name,
    city: cityKey as City,
    category: mappedTag === "한식" || mappedTag === "일식" || mappedTag === "중식" || mappedTag === "스시" || mappedTag === "라멘" || mappedTag === "바비큐" || mappedTag === "씨푸드" || mappedTag === "스테이크" || mappedTag === "버거" || mappedTag === "피자" ? "맛집"
      : mappedTag === "카페" || mappedTag === "디저트" || mappedTag === "베이커리" || mappedTag === "아이스크림" ? "카페"
      : mappedTag === "관광" ? "관광"
      : mappedTag === "자연" || mappedTag === "해변" ? "자연"
      : mappedTag === "쇼핑" || mappedTag === "마트" ? "쇼핑"
      : "맛집",
    neighborhood: (item.location.neighborhood?.[0] || "다운타운") as Neighborhood,
    description: item.description || `${item.name}은(는) ${cityKey}의 인기 장소입니다.`,
    shortDesc: catName.slice(0, 30) || `${cityKey} 인기 장소`,
    address: item.location.address || "",
    lat: item.geocodes.main.latitude,
    lng: item.geocodes.main.longitude,
    rating: item.rating ? item.rating / 2 : 0, // Foursquare 0-10 → 우리 0-5
    priceLevel: (item.price ?? 1) as 0 | 1 | 2 | 3,
    tags,
    tips: [],
    openHours: item.hours?.display,
    website: item.website,
    lastUpdated: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    image: item.photos?.[0] ? `${item.photos[0].prefix}original${item.photos[0].suffix}` : "",
    indoorOutdoor: "indoor",
  };
}

/** 키워드 기반 Foursquare 검색 */
export async function fetchFsqPlaces(
  cityKey: string,
  query: string,
  limit = 50
): Promise<Place[]> {
  if (!API_KEY) {
    console.warn("⚠️ Foursquare API Key 없음. .env.local에 NEXT_PUBLIC_FSQ_API_KEY를 추가하세요.");
    return [];
  }

  const coords = CITY_COORDS[cityKey.toLowerCase()];
  if (!coords) throw new Error(`Unknown city: ${cityKey}`);

  const params = new URLSearchParams({
    ll: `${coords.lat},${coords.lng}`,
    radius: "15000", // 15km
    query,
    limit: String(limit),
  });

  const res = await fetch(`${FSQ_BASE}?${params.toString()}`, {
    headers: { Authorization: API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Foursquare API error: ${res.status}`);
  }

  const data: FsqResponse = await res.json();
  return data.results.map((item) => fsqToPlace(item, cityKey));
}

/** 한식/카페/관광지 등 프리셋 */
export async function fetchFsqTorontoKorean(): Promise<Place[]> {
  return fetchFsqPlaces("toronto", "korean restaurant", 50);
}

export async function fetchFsqTorontoCafes(): Promise<Place[]> {
  return fetchFsqPlaces("toronto", "cafe", 50);
}

export async function fetchFsqTorontoAttractions(): Promise<Place[]> {
  return fetchFsqPlaces("toronto", "tourist attraction", 50);
}
