import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGeolocation } from "@/hooks/useGeolocation";

describe("useGeolocation", () => {
  let originalGeolocation: Geolocation | undefined;

  beforeEach(() => {
    originalGeolocation = global.navigator.geolocation;
  });

  afterEach(() => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: originalGeolocation,
      writable: true,
      configurable: true,
    });
  });

  it("초기 상태는 loading=true, lat/lng=null이다", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: vi.fn() },
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.loading).toBe(true);
    expect(result.current.lat).toBeNull();
    expect(result.current.lng).toBeNull();
  });

  it("위치 획득 성공 시 lat/lng가 설정된다", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: 43.6532, longitude: -79.3832, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
            timestamp: Date.now(),
          } as GeolocationPosition);
        },
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lat).toBe(43.6532);
    expect(result.current.lng).toBe(-79.3832);
    expect(result.current.error).toBeNull();
  });

  it("위치 획득 실패 시 에러 메시지가 설정된다", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: (_: PositionCallback, error?: PositionErrorCallback) => {
          error?.({ code: 1, message: "Permission denied" } as GeolocationPositionError);
        },
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("위치 권한을 허용해주세요!");
    expect(result.current.lat).toBeNull();
  });

  it("geolocation 미지원 브라우저 에러 처리", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("위치 정보를 지원하지 않는 브라우저예요");
  });
});
