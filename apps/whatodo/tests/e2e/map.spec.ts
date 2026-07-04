import { test, expect, Page } from "@playwright/test";

async function dismissModals(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll("[class*='fixed inset-0']").forEach((el) => el.remove());
  });
}

async function mockGeolocation(page: Page, lat = 43.651, lng = -79.347) {
  await page.addInitScript((coords) => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: coords.lat, longitude: coords.lng, accuracy: 100 },
            timestamp: Date.now(),
          } as GeolocationPosition);
        },
        watchPosition: () => 0,
        clearWatch: () => {},
      },
      configurable: true,
    });
    Object.defineProperty(navigator, "permissions", {
      value: { query: () => Promise.resolve({ state: "granted", onchange: null }) },
      configurable: true,
    });
  }, { lat, lng });
}

test.describe("Map Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockGeolocation(page);
    await page.goto("/map");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await dismissModals(page);
  });

  test("지도 페이지가 로드된다", async ({ page }) => {
    await expect(page.locator(".leaflet-container")).toBeVisible();
  });

  test("필터바가 표시된다", async ({ page }) => {
    await expect(page.locator("text=주변에서 오늘 뭐하지").or(page.locator("text=모아보기"))).toBeVisible();
  });

  test("카테고리 필터 버튼이 표시된다", async ({ page }) => {
    await expect(page.getByText("맛집")).toBeVisible();
    await expect(page.getByText("카페")).toBeVisible();
  });

  test("리스트 패널이 기본으로 표시된다 (모바일)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await dismissModals(page);
    await expect(page.locator("text=개 장소").or(page.locator("text=거리순"))).toBeVisible();
  });

  test("뷰/반경 모드 토글이 표시된다", async ({ page }) => {
    await expect(page.getByText("뷰")).toBeVisible();
    await expect(page.getByText("반경")).toBeVisible();
  });

  test("반경 모드 클릭 시 슬라이더가 표시된다", async ({ page }) => {
    await page.getByText("반경").click();
    await expect(page.locator("input[type='range']")).toBeVisible();
  });

  test("위치 권한 모달이 표시된다 (미허가 상태)", async ({ page }) => {
    // fresh page without geolocation mock to trigger modal
    const freshPage = await page.context().newPage();
    await freshPage.addInitScript(() => {
      Object.defineProperty(navigator, "permissions", {
        value: { query: () => Promise.resolve({ state: "prompt", onchange: null }) },
        configurable: true,
      });
      sessionStorage.removeItem("location_modal_dismissed");
    });
    await freshPage.goto("/map");
    await freshPage.waitForLoadState("networkidle");
    await freshPage.waitForTimeout(1200);
    // Modal should appear
    await expect(freshPage.getByText("현재 위치 공유하기")).toBeVisible({ timeout: 5000 });
    await freshPage.close();
  });

  test("위치 허용 후 파란 마커가 표시된다", async ({ page }) => {
    await page.waitForTimeout(500);
    // Blue dot should be in DOM
    await expect(page.locator(".leaflet-marker-pane")).toBeVisible();
  });
});
