import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const UX = "https://images.unsplash.com/photo-";
const Q = "?w=600&q=80&auto=format&fit=crop";

// Sub-category override images (food-heavy since that's the default)
const SUB_IMAGES: Record<string, string> = {
  "한식":         `${UX}1604908176997-125f25cc6f3d${Q}`,
  "일식":         `${UX}1553621042-f6e147245754${Q}`,
  "아시안":       `${UX}1569718212165-c4756e1c53f4${Q}`,
  "양식":         `${UX}1568901346375-23c9450c58cd${Q}`,
  "해산물":       `${UX}1519708227418-1e0b65f71a6e${Q}`,
  "브런치카페":   `${UX}1533089860892-a7c6f0f88b48${Q}`,
  "스페셜티카페": `${UX}1509042239860-f550ce710b93${Q}`,
  "디저트카페":   `${UX}1551024601-bec78aea704b${Q}`,
  "테마카페":     `${UX}1461023058943-07fcbe16d735${Q}`,
  "박물관":       `${UX}1584385002340-d886f3a52e3f${Q}`,
  "미술관갤러리": `${UX}1536924940903-f4e4eeeb5e20${Q}`,
  "역사건축":     `${UX}1508193638397-1c4234db14d8${Q}`,
  "전망대":       `${UX}1477959858617-67f85cf4f1df${Q}`,
  "테마파크":     `${UX}1530866787429-f0a2cc0e06f2${Q}`,
  "야외액티비티": `${UX}1533107862482-0e58bcb24e40${Q}`,
  "실내액티비티": `${UX}1511512578047-ab58c1f00b04${Q}`,
  "투어":         `${UX}1501854140801-50d01698950b${Q}`,
  "문화체험":     `${UX}1533106958148-daac6b5caf40${Q}`,
  "도심공원":     `${UX}1441974231531-c6227db76b6e${Q}`,
  "하이킹":       `${UX}1551632811-561732d1e306${Q}`,
  "해변호수":     `${UX}1507525428034-b723cf961d3e${Q}`,
  "동물원정원":   `${UX}1488459716781-31db5a5c3927${Q}`,
  "쇼핑몰":       `${UX}1483985988355-763728e1cec6${Q}`,
  "마켓":         `${UX}1542838132-92d22d2b1d3a${Q}`,
  "빈티지편집샵": `${UX}1558171813-89d6734a7b80${Q}`,
  "캐나다브랜드": `${UX}1519167758481-83f550bb49b3${Q}`,
  "루프탑바":     `${UX}1516450360452-9312f5e86fc7${Q}`,
  "야경뷰포인트": `${UX}1477959858617-67f85cf4f1df${Q}`,
  "스포츠직관":   `${UX}1461896836934-ffe607ba8211${Q}`,
  "겨울스포츠":   `${UX}1548880294-d0a2b8db0b16${Q}`,
  "피자":         `${UX}1513104890138-7c749bd0007d${Q}`,
  "버거":         `${UX}1568901346375-23c9450c58cd${Q}`,
  "타코":         `${UX}1551500543-cef1b74c5659${Q}`,
  "스테이크":     `${UX}1544025166-7f2d7f7c3e8e${Q}`,
  "와인바":       `${UX}1516594913981-6d7c4c7c0e81${Q}`,
  "칵테일바":     `${UX}1514362545857-6bc16c3b6b9a${Q}`,
  "베이커리":     `${UX}1509365465985-12c552adce53${Q}`,
  "아이스크림":   `${UX}1497034825424-236bbcb6f85a${Q}`,
  "책방카페":     `${UX}1521587760475-19784c7c8dff${Q}`,
  "로스터리":     `${UX}1495474479287-78678f9a7d0f${Q}`,
  "비건":         `${UX}1512621776950-a571f6c9c9e1${Q}`,
  "푸드트럭":     `${UX}1565123409373-0f4d6f7e5e7c${Q}`,
  "푸드홀":       `${UX}1559339352-92d4b8d3e5f6${Q}`,
  "지하철투어":   `${UX}1518391840015-354a7668e8a2${Q}`,
  "거리예술":     `${UX}1499781354788-ac8abcee9c76${Q}`,
  "공연장":       `${UX}1501281668745-f7a555bde9dd${Q}`,
  "영화관":       `${UX}1489599849927-3a4a6e5e8b0e${Q}`,
  "미술관":       `${UX}1536924940903-f4e4eeeb5e20${Q}`,
  "요가":         `${UX}1544367563-1234567890ab${Q}`,
  "클라이밍":     `${UX}1522160194842-6c77b2d3f5f6${Q}`,
  "자전거":       `${UX}1485965129407-ff6e1f5f0b3e${Q}`,
  "보드게임":     `${UX}1610890719427-1c5e1c5c5c5c${Q}`,
  "에스케이프룸": `${UX}1519074069440-1ba4c7d8f5b7${Q}`,
  "비치":         `${UX}1507525428034-b723cf961d3e${Q}`,
  "산책로":       `${UX}1441974231531-c6227db76b6e${Q}`,
  "식물원":       `${UX}1466699510359-5f32f3e8b27f${Q}`,
  "도서관":       `${UX}1507842217121-9e9628356f5c${Q}`,
  "대학":         `${UX}1523050854058-8df90110f5d0${Q}`,
  "야시장":       `${UX}1533900298318-ffb7e7f5f5f5${Q}`,
  "로컬브랜드":   `${UX}1441986304887-3d6f5e7f5e7f${Q}`,
  "수제맥주":     `${UX}1535959204615-b9f3ee6b7a7e${Q}`,
};

// Main category fallback images
const CAT_IMAGES: Record<string, string> = {
  "맛집":   `${UX}1567620905732-2d1ec7ab7445${Q}`,
  "카페":   `${UX}1509042239860-f550ce710b93${Q}`,
  "관광":   `${UX}1508193638397-1c4234db14d8${Q}`,
  "액티비티":`${UX}1533107862482-0e58bcb24e40${Q}`,
  "자연":   `${UX}1441974231531-c6227db76b6e${Q}`,
  "야경":   `${UX}1477959858617-67f85cf4f1df${Q}`,
  "쇼핑":   `${UX}1483985988355-763728e1cec6${Q}`,
  "스포츠": `${UX}1461896836934-ffe607ba8211${Q}`,
};

export const FALLBACK_IMAGE = `${UX}1567620905732-2d1ec7ab7445${Q}`;

/**
 * Returns the best available image URL for a place.
 * Priority: place.image → sub-category → main category
 */
export function getPlaceImage(
  image: string | null | undefined,
  category: string,
  tags: string[],
): string {
  if (image) return image;
  // Try sub-category match via tags
  for (const [subId, url] of Object.entries(SUB_IMAGES)) {
    if (tags.some((t) => t.toLowerCase().includes(subId.toLowerCase()))) return url;
  }
  return CAT_IMAGES[category] ?? `${UX}1567620905732-2d1ec7ab7445${Q}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 두 좌표 간의 거리를 킬로미터로 계산 (Haversine formula)
 */
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export const haversineDistance = getDistance;

/**
 * 거리를 사람이 읽기 좋은 형식으로 변환
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${Math.round(km * 10) / 10}km`;
}
