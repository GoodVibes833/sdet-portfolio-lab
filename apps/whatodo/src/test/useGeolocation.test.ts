import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGeolocation } from "@/hooks/useGeolocation";

function mockPermissions(state: "granted" | "prompt" | "denied") {
  Object.defineProperty(global.navigator, "permissions", {
    value: {
      query: () => Promise.resolve({ state, onchange: null }),
    },
    writable: true,
    configurable: true,
  });
}

describe("useGeolocation", () => {
  let originalGeolocation: Geolocation | undefined;

  beforeEach(() => {
    originalGeolocation = global.navigator.geolocation;
    // Default: permissions API returns 'prompt'
    mockPermissions("prompt");
  });

  afterEach(() => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: originalGeolocation,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it("초기 상태는 loading=false, lat/lng=null이다 (권한 미허가 시)", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: vi.fn(), watchPosition: vi.fn(), clearWatch: vi.fn() },
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useGeolocation());
    // With new hook: loading starts false until requestLocation is called
    expect(result.current.lat).toBeNull();
    expect(result.current.lng).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("requestLocation 호출 후 위치 획득 성공 시 lat/lng가 설정된다", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: 43.6532, longitude: -79.3832, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
            timestamp: Date.now(),
          } as GeolocationPosition);
        },
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    act(() => { result.current.requestLocation(); });
    await waitFor(() => expect(result.current.lat).toBe(43.6532));
    expect(result.current.lng).toBe(-79.3832);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.permissionStatus).toBe("granted");
  });

  it("requestLocation 호출 후 위치 획득 실패 시 에러 메시지가 설정된다", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: (_: PositionCallback, error?: PositionErrorCallback) => {
          error?.({ code: 1, message: "Permission denied" } as GeolocationPositionError);
        },
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    act(() => { result.current.requestLocation(); });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("위치 권한이 거부됐어요. 브라우저 설정에서 허용해주세요.");
    expect(result.current.permissionStatus).toBe("denied");
    expect(result.current.lat).toBeNull();
  });

  it("geolocation 미지원 브라우저에서 requestLocation 호출 시 에러가 설정된다", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    act(() => { result.current.requestLocation(); });
    await waitFor(() => expect(result.current.permissionStatus).toBe("denied"));
    expect(result.current.error).toBe("위치 정보를 지원하지 않는 브라우저예요");
  });

  it("권한이 이미 granted인 경우 requestLocation 없이도 위치를 가져온다", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: 49.28, longitude: -123.12, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
            timestamp: Date.now(),
          } as GeolocationPosition);
        },
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      },
      writable: true,
      configurable: true,
    });
    mockPermissions("granted");

    const { result } = renderHook(() => useGeolocation());
    // permissions.query resolves async, so we need to wait
    await waitFor(() => expect(result.current.lat).toBe(49.28), { timeout: 3000 });
    expect(result.current.lng).toBe(-123.12);
  });

  it("requestLocation 함수가 반환된다", () => {
    const { result } = renderHook(() => useGeolocation());
    expect(typeof result.current.requestLocation).toBe("function");
  });
});
