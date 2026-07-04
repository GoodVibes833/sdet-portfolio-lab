import { describe, it, expect } from "vitest";
import { places } from "@/data/places";
import { getDistance } from "@/lib/utils";

const HIDDEN_TAGS = ["히든", "hidden", "숨은명소", "히든카페", "히든맛집", "히든바"];

function isHiddenPlace(tags: string[]) {
  return tags.some((t) => HIDDEN_TAGS.some((h) => t.includes(h)));
}

function filterPlaces(opts: {
  category?: string | null;
  priceLevel?: number | null;
  hiddenOnly?: boolean;
  search?: string;
  freeOnly?: boolean;
  userLat?: number;
  userLng?: number;
  radiusKm?: number;
}) {
  return places.filter((p) => {
    if (opts.category && p.category !== opts.category) return false;
    if (opts.priceLevel !== undefined && opts.priceLevel !== null && p.priceLevel !== opts.priceLevel) return false;
    if (opts.freeOnly && p.priceLevel !== 0) return false;
    if (opts.hiddenOnly && !isHiddenPlace(p.tags)) return false;
    if (opts.radiusKm !== undefined && opts.userLat !== undefined && opts.userLng !== undefined) {
      const dist = getDistance(opts.userLat, opts.userLng, p.lat, p.lng);
      if (dist > opts.radiusKm) return false;
    }
    if (opts.search) {
      const q = opts.search.toLowerCase();
      const hit =
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      if (!hit) return false;
    }
    return true;
  });
}

describe("필터 로직 — 카테고리", () => {
  it("맛집 카테고리 필터가 올바르게 동작한다", () => {
    const result = filterPlaces({ category: "맛집" });
    expect(result.every((p) => p.category === "맛집")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("카페 카테고리 필터가 올바르게 동작한다", () => {
    const result = filterPlaces({ category: "카페" });
    expect(result.every((p) => p.category === "카페")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("카테고리 null이면 전체 반환한다", () => {
    const all = filterPlaces({});
    const withNull = filterPlaces({ category: null });
    expect(withNull.length).toBe(all.length);
  });
});

describe("필터 로직 — 가격", () => {
  it("무료(0) 필터가 priceLevel=0 장소만 반환한다", () => {
    const result = filterPlaces({ priceLevel: 0 });
    expect(result.every((p) => p.priceLevel === 0)).toBe(true);
  });

  it("freeOnly=true가 무료 장소만 반환한다", () => {
    const result = filterPlaces({ freeOnly: true });
    expect(result.every((p) => p.priceLevel === 0)).toBe(true);
  });
});

describe("필터 로직 — GPS 반경", () => {
  const TORONTO = { lat: 43.651, lng: -79.347 };

  it("반경 5km 내 장소만 반환한다", () => {
    const result = filterPlaces({ userLat: TORONTO.lat, userLng: TORONTO.lng, radiusKm: 5 });
    result.forEach((p) => {
      const dist = getDistance(TORONTO.lat, TORONTO.lng, p.lat, p.lng);
      expect(dist).toBeLessThanOrEqual(5);
    });
  });

  it("반경 넓히면 결과가 늘어난다", () => {
    const small = filterPlaces({ userLat: TORONTO.lat, userLng: TORONTO.lng, radiusKm: 5 });
    const large = filterPlaces({ userLat: TORONTO.lat, userLng: TORONTO.lng, radiusKm: 50 });
    expect(large.length).toBeGreaterThanOrEqual(small.length);
  });

  it("반경 0km는 빈 배열을 반환한다", () => {
    const result = filterPlaces({ userLat: TORONTO.lat, userLng: TORONTO.lng, radiusKm: 0 });
    expect(result.length).toBe(0);
  });

  it("반경 내 장소를 거리순으로 정렬할 수 있다", () => {
    const result = filterPlaces({ userLat: TORONTO.lat, userLng: TORONTO.lng, radiusKm: 50 })
      .map((p) => ({ ...p, _dist: getDistance(TORONTO.lat, TORONTO.lng, p.lat, p.lng) }))
      .sort((a, b) => a._dist - b._dist);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i]._dist).toBeLessThanOrEqual(result[i + 1]._dist);
    }
  });
});

describe("필터 로직 — 히든 스팟", () => {
  it("hiddenOnly=true가 히든 태그 있는 장소만 반환한다", () => {
    const result = filterPlaces({ hiddenOnly: true });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => isHiddenPlace(p.tags))).toBe(true);
  });

  it("isHiddenPlace가 히든 태그를 올바르게 감지한다", () => {
    expect(isHiddenPlace(["히든카페", "분위기좋은"])).toBe(true);
    expect(isHiddenPlace(["hidden", "맛있는"])).toBe(true);
    expect(isHiddenPlace(["숨은명소"])).toBe(true);
    expect(isHiddenPlace(["관광", "유명한"])).toBe(false);
  });
});

describe("필터 로직 — 검색", () => {
  it("이름으로 검색이 된다", () => {
    const first = places[0];
    const result = filterPlaces({ search: first.name.slice(0, 3) });
    expect(result.some((p) => p.id === first.id)).toBe(true);
  });

  it("빈 검색어는 모두 통과한다", () => {
    const all = filterPlaces({});
    const result = filterPlaces({ search: "" });
    expect(result.length).toBe(all.length);
  });
});

describe("필터 로직 — 복합 조건", () => {
  it("GPS 반경 + 카테고리 복합 필터가 동작한다", () => {
    const TORONTO = { lat: 43.651, lng: -79.347 };
    const result = filterPlaces({ userLat: TORONTO.lat, userLng: TORONTO.lng, radiusKm: 100, category: "맛집" });
    expect(result.every((p) => p.category === "맛집")).toBe(true);
    result.forEach((p) => {
      const dist = getDistance(TORONTO.lat, TORONTO.lng, p.lat, p.lng);
      expect(dist).toBeLessThanOrEqual(100);
    });
  });

  it("GPS 반경 + 무료 복합 필터가 동작한다", () => {
    const TORONTO = { lat: 43.651, lng: -79.347 };
    const result = filterPlaces({ userLat: TORONTO.lat, userLng: TORONTO.lng, radiusKm: 100, freeOnly: true });
    expect(result.every((p) => p.priceLevel === 0)).toBe(true);
  });
});
