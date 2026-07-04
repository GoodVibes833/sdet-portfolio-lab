/**
 * Yelp Fusion API fetcher
 * 무료: 500회/일, 가입만 하면 카드 불필요
 * https://docs.developer.yelp.com/
 */

import type { Place, City, Neighborhood } from "@/data/places";

const YELP_BASE = "https://api.yelp.com/v3/businesses/search";

// 👉 개발자 콘솔에서 발급한 API Key를 .env.local에 넣으세요
// NEXT_PUBLIC_YELP_API_KEY=xxxx...
const API_KEY = process.env.NEXT_PUBLIC_YELP_API_KEY || "";

interface YelpBusiness {
  id: string;
  name: string;
  image_url: string;
  url: string;
  review_count: number;
  rating: number; // 1-5
  coordinates: { latitude: number; longitude: number };
  price?: string; // "$", "$$", "$$$", "$$$$"
  location: { display_address: string[]; neighborhood?: string };
  display_phone?: string;
  categories: { alias: string; title: string }[];
  hours?: { open: { start: string; end: string }[] }[];
}

interface YelpResponse {
  businesses: YelpBusiness[];
  total: number;
}

const YELP_CAT_MAP: Record<string, string> = {
  korean: "한식",
  japanese: "일식",
  sushi: "스시",
  ramen: "라멘",
  chinese: "중식",
  vietnamese: "쌀국수",
  thai: "태국",
  mexican: "멕시칸",
  italian: "이탈리안",
  french: "프렌치",
  indian: "인도",
  seafood: "씨푸드",
  steakhouses: "스테이크",
  burgers: "버거",
  pizza: "피자",
  bbq: "바비큐",
  cafes: "카페",
  coffee: "카페",
  desserts: "디저트",
  bakeries: "베이커리",
  icecream: "아이스크림",
  bars: "바",
  parks: "자연",
  museums: "관광",
  shopping: "쇼핑",
};

function yelpToPlace(item: YelpBusiness, cityKey: string): Place {
  const catAlias = item.categories[0]?.alias || "";
  const catTitle = item.categories[0]?.title || "";
  const mappedTag = YELP_CAT_MAP[catAlias] || YELP_CAT_MAP[catTitle.toLowerCase()];

  const tags: string[] = [];
  if (mappedTag) tags.push(mappedTag);
  if (item.price) tags.push(item.price);
  if (item.rating >= 4.5) tags.push("추천");
  if (item.review_count > 500) tags.push("리뷰많음");

  const now = new Date();
  return {
    id: `yelp-${item.id}`,
    name: item.name,
    nameEn: item.name,
    city: cityKey as City,
    category: mappedTag === "한식" || mappedTag === "일식" || mappedTag === "중식" || mappedTag === "스시" || mappedTag === "라멘" || mappedTag === "쌀국수" || mappedTag === "태국" || mappedTag === "멕시칸" || mappedTag === "이탈리안" || mappedTag === "프렌치" || mappedTag === "인도" || mappedTag === "씨푸드" || mappedTag === "스테이크" || mappedTag === "버거" || mappedTag === "피자" || mappedTag === "바비큐" ? "맛집"
      : mappedTag === "카페" || mappedTag === "디저트" || mappedTag === "베이커리" || mappedTag === "아이스크림" ? "카페"
      : mappedTag === "관광" ? "관광"
      : mappedTag === "자연" ? "자연"
      : mappedTag === "쇼핑" ? "쇼핑"
      : "맛집",
    neighborhood: (item.location.neighborhood || "다운타운") as Neighborhood,
    description: `${item.name}은(는) ${cityKey}에서 평점 ${item.rating} (${item.review_count}개 리뷰)를 받은 인기 장소입니다.`,
    shortDesc: `${catTitle} · 평점 ${item.rating}`,
    address: item.location.display_address.join(", ") || "",
    lat: item.coordinates.latitude,
    lng: item.coordinates.longitude,
    rating: item.rating,
    priceLevel: (item.price?.length ?? 1) as 0 | 1 | 2 | 3,
    tags,
    tips: [],
    website: item.url,
    lastUpdated: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    image: item.image_url || "",
    indoorOutdoor: "indoor",
  };
}

/** Yelp 검색 */
export async function fetchYelpPlaces(
  cityKey: string,
  term: string,
  limit = 50
): Promise<Place[]> {
  if (!API_KEY) {
    console.warn("⚠️ Yelp API Key 없음. .env.local에 NEXT_PUBLIC_YELP_API_KEY를 추가하세요.");
    return [];
  }

  const params = new URLSearchParams({
    location: cityKey,
    term,
    limit: String(limit),
    sort_by: "rating",
  });

  const res = await fetch(`${YELP_BASE}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`Yelp API error: ${res.status}`);
  }

  const data: YelpResponse = await res.json();
  return data.businesses.map((item) => yelpToPlace(item, cityKey));
}

/** 프리셋 */
export async function fetchYelpTorontoKorean(): Promise<Place[]> {
  return fetchYelpPlaces("Toronto, ON", "korean", 50);
}

export async function fetchYelpTorontoCafes(): Promise<Place[]> {
  return fetchYelpPlaces("Toronto, ON", "cafe", 50);
}

export async function fetchYelpTorontoAttractions(): Promise<Place[]> {
  return fetchYelpPlaces("Toronto, ON", "tourist attractions", 50);
}
