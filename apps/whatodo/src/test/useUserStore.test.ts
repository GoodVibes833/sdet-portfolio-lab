import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useUserStore } from "@/hooks/useUserStore";

describe("useUserStore", () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => { storage[key] = value; },
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("초기 상태는 빈 위시리스트와 방문 목록이다", async () => {
    const { result } = renderHook(() => useUserStore());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    expect(result.current.wishlist).toEqual([]);
    expect(result.current.visited).toEqual([]);
  });

  it("toggleWishlist가 장소를 위시리스트에 추가한다", async () => {
    const { result } = renderHook(() => useUserStore());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    act(() => result.current.toggleWishlist("place-1"));
    await waitFor(() => expect(result.current.wishlist).toContain("place-1"));
  });

  it("toggleWishlist가 이미 있는 장소를 제거한다", async () => {
    const { result } = renderHook(() => useUserStore());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    act(() => result.current.toggleWishlist("place-1"));
    await waitFor(() => expect(result.current.wishlist).toContain("place-1"));
    act(() => result.current.toggleWishlist("place-1"));
    await waitFor(() => expect(result.current.wishlist).not.toContain("place-1"));
  });

  it("toggleVisited가 장소를 방문 목록에 추가한다", async () => {
    const { result } = renderHook(() => useUserStore());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    act(() => result.current.toggleVisited("place-1"));
    await waitFor(() => expect(result.current.visited).toContain("place-1"));
  });

  it("toggleVisited가 이미 방문한 장소를 제거한다", async () => {
    const { result } = renderHook(() => useUserStore());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    act(() => result.current.toggleVisited("place-1"));
    await waitFor(() => expect(result.current.visited).toContain("place-1"));
    act(() => result.current.toggleVisited("place-1"));
    await waitFor(() => expect(result.current.visited).not.toContain("place-1"));
  });

  it("setNickname이 닉네임을 설정한다", async () => {
    const { result } = renderHook(() => useUserStore());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    act(() => result.current.setNickname("🙋 Alex"));
    await waitFor(() => expect(result.current.nickname).toBe("🙋 Alex"));
  });

  it("localStorage에 상태가 저장된다", async () => {
    const { result } = renderHook(() => useUserStore());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    act(() => result.current.toggleWishlist("place-1"));
    await waitFor(() => expect(result.current.wishlist).toContain("place-1"));
    expect(storage["cangaza_user"]).toContain("place-1");
  });

  it("미션 완료 시 포인트가 적립된다", async () => {
    const { result } = renderHook(() => useUserStore());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    const prevPoints = result.current.points;
    act(() => result.current.toggleVisited("place-1"));
    // first-visit 미션: 1개 방문 시 50점 추가
    expect(result.current.points).toBe(prevPoints + 50);
    expect(result.current.completedMissions).toContain("first-visit");
  });
});
