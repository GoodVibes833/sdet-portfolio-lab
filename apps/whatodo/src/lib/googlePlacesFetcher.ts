/**
 * Google Places API (New) fetcher — 나중에 활성화
 * $200/월 무료 크레딧, but 신용카드 등록 필수
 * https://developers.google.com/maps/documentation/places/web-service
 *
 * 👉 사용 전:
 *  1. Google Cloud Console 가입
 *  2. Places API (New) 활성화
 *  3. 결제 계정 생성 (카드 등록 — $200 초과 시에만 과금)
 *  4. API Key 발급 → .env.local에 NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=xxx
 */

import type { Place, City, Neighborhood } from "@/data/places";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "";

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  location?: { latitude: number; longitude: number };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: "PRICE_LEVEL_UNSPECIFIED" | "PRICE_LEVEL_FREE" | "PRICE_LEVEL_INEXPENSIVE" | "PRICE_LEVEL_MODERATE" | "PRICE_LEVEL_EXPENSIVE";
  primaryType?: string;
  photos?: { name: string }[];
  nationalPhoneNumber?: string;
  websiteUri?: string;
  regularOpeningHours?: { weekdayDescriptions: string[] };
  editorialSummary?: { text: string };
}

const PRICE_MAP: Record<string, 0 | 1 | 2 | 3> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
};

const TYPE_MAP: Record<string, { category: string; tags: string[] }> = {
  korean_restaurant: { category: "맛집", tags: ["한식"] },
  japanese_restaurant: { category: "맛집", tags: ["일식"] },
  sushi_restaurant: { category: "맛집", tags: ["일식", "스시"] },
  ramen_restaurant: { category: "맛집", tags: ["일식", "라멘"] },
  chinese_restaurant: { category: "맛집", tags: ["중식"] },
  vietnamese_restaurant: { category: "맛집", tags: ["쌀국수", "베트남"] },
  thai_restaurant: { category: "맛집", tags: ["태국", "똠양꿍"] },
  mexican_restaurant: { category: "맛집", tags: ["멕시칸", "타코"] },
  italian_restaurant: { category: "맛집", tags: ["이탈리안", "파스타"] },
  french_restaurant: { category: "맛집", tags: ["프렌치"] },
  indian_restaurant: { category: "맛집", tags: ["인도", "커리"] },
  seafood_restaurant: { category: "맛집", tags: ["씨푸드", "해산물"] },
  steakhouse: { category: "맛집", tags: ["스테이크"] },
  hamburger_restaurant: { category: "맛집", tags: ["버거"] },
  pizza_restaurant: { category: "맛집", tags: ["피자"] },
  cafe: { category: "카페", tags: ["카페"] },
  bakery: { category: "카페", tags: ["베이커리"] },
  ice_cream_shop: { category: "카페", tags: ["아이스크림", "디저트"] },
  dessert_shop: { category: "카페", tags: ["디저트"] },
  bar: { category: "야경", tags: ["바"] },
  tourist_attraction: { category: "관광", tags: ["관광지"] },
  museum: { category: "관광", tags: ["박물관"] },
  art_gallery: { category: "관광", tags: ["미술관"] },
  park: { category: "자연", tags: ["공원"] },
  beach: { category: "자연", tags: ["해변"] },
  shopping_mall: { category: "쇼핑", tags: ["쇼핑몰"] },
  grocery_store: { category: "쇼핑", tags: ["마트"] },
  convenience_store: { category: "쇼핑", tags: ["편의점"] },
};

function googleToPlace(item: GooglePlace, cityKey: string): Place {
  const mapped = item.primaryType ? TYPE_MAP[item.primaryType] : undefined;
  const now = new Date();

  return {
    id: `google-${item.id}`,
    name: item.displayName?.text || "",
    nameEn: item.displayName?.text || "",
    city: cityKey as City,
    category: (mapped?.category || "관광") as any,
    neighborhood: "다운타운" as Neighborhood,
    description: item.editorialSummary?.text || `${item.displayName?.text}은(는) ${cityKey}의 인기 장소입니다.`,
    shortDesc: item.primaryType?.replace(/_/g, " ").slice(0, 30) || `${cityKey} 장소`,
    address: item.formattedAddress || "",
    lat: item.location?.latitude || 0,
    lng: item.location?.longitude || 0,
    rating: item.rating || 0,
    priceLevel: item.priceLevel ? PRICE_MAP[item.priceLevel] : 1,
    tags: mapped?.tags || [],
    tips: [],
    openHours: item.regularOpeningHours?.weekdayDescriptions?.join("\n"),
    website: item.websiteUri,
    lastUpdated: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    image: "", // Google 사진은 별도 fetch 필요
    indoorOutdoor: "indoor",
  };
}

/** Text Search (New) — 키워드로 장소 검색 */
export async function fetchGoogleTextSearch(
  cityKey: string,
  query: string,
  maxResults = 20
): Promise<Place[]> {
  if (!GOOGLE_KEY) {
    console.warn(
      "⚠️ Google Places API Key 없음.\n" +
      "   1. Google Cloud Console 가입\n" +
      "   2. Places API (New) 활성화\n" +
      "   3. 결제 계정 생성 (카드 등록 — $200 초과 시만 과금)\n" +
      "   4. .env.local에 NEXT_PUBLIC_GOOGLE_PLACES_API_KEY 추가"
    );
    return [];
  }

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.location,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.primaryType,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.editorialSummary",
    },
    body: JSON.stringify({ textQuery: `${query} in ${cityKey}` }),
  });

  if (!res.ok) {
    throw new Error(`Google Places error: ${res.status}`);
  }

  const data = await res.json();
  const places: GooglePlace[] = data.places || [];
  return places.slice(0, maxResults).map((item) => googleToPlace(item, cityKey));
}

/** Place Details (New) — 사진 포함 상세 정보 */
export async function fetchGooglePlaceDetails(placeId: string): Promise<Partial<Place>> {
  if (!GOOGLE_KEY) {
    console.warn("⚠️ Google Places API Key 없음.");
    return {};
  }

  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": GOOGLE_KEY,
      "X-Goog-FieldMask": "photos,regularOpeningHours,websiteUri,editorialSummary",
    },
  });

  if (!res.ok) throw new Error(`Google Places detail error: ${res.status}`);
  const data = await res.json();

  const photo = data.photos?.[0];
  return {
    image: photo
      ? `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${GOOGLE_KEY}`
      : "",
    openHours: data.regularOpeningHours?.weekdayDescriptions?.join("\n"),
    website: data.websiteUri,
  };
}

/** 프리셋 */
export async function fetchGoogleTorontoKorean(): Promise<Place[]> {
  return fetchGoogleTextSearch("toronto", "korean restaurant", 20);
}

export async function fetchGoogleTorontoCafes(): Promise<Place[]> {
  return fetchGoogleTextSearch("toronto", "cafe", 20);
}

export async function fetchGoogleTorontoAttractions(): Promise<Place[]> {
  return fetchGoogleTextSearch("toronto", "tourist attraction", 20);
}
