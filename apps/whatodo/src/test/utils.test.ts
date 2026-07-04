import { describe, it, expect } from "vitest";
import { getDistance, formatDistance } from "@/lib/utils";

describe("Distance Utilities", () => {
  describe("getDistance", () => {
    it("두 좌표 간의 거리를 킬로미터로 계산한다", () => {
      // Toronto to North York (roughly 15km)
      const dist = getDistance(43.651, -79.347, 43.77, -79.41);
      expect(dist).toBeGreaterThan(10);
      expect(dist).toBeLessThan(20);
    });

    it("같은 위치의 거리는 0이다", () => {
      const dist = getDistance(43.651, -79.347, 43.651, -79.347);
      expect(dist).toBe(0);
    });

    it("멀리 떨어진 도시들의 거리를 계산한다", () => {
      // Toronto to Vancouver (roughly 3300km)
      const dist = getDistance(43.651, -79.347, 49.2827, -123.1207);
      expect(dist).toBeGreaterThan(3000);
      expect(dist).toBeLessThan(3500);
    });
  });

  describe("formatDistance", () => {
    it("1km 미만은 미터로 표시한다", () => {
      expect(formatDistance(0.5)).toBe("500m");
      expect(formatDistance(0.123)).toBe("123m");
    });

    it("1km 이상은 km로 표시한다", () => {
      expect(formatDistance(1.5)).toBe("1.5km");
      expect(formatDistance(10.75)).toBe("10.8km");
    });

    it("정확한 km는 소수점 없이 표시한다", () => {
      expect(formatDistance(5)).toBe("5km");
    });
  });
});
