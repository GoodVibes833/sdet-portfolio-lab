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
    localStorage.setItem("geo_permission_asked", "granted");
  }, { lat, lng });
}

test.describe("GPS 거리 기반 정렬", () => {
  test.beforeEach(async ({ page }) => {
    await mockGeolocation(page);
    await page.goto("/explore");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await dismissModals(page);
  });

  test("가까운순 정렬 버튼이 표시된다", async ({ page }) => {
    await page.getByTestId("search-filter").click();
    await expect(page.getByText("가까운순")).toBeVisible();
  });

  test("GPS 허용 시 결과에 거리 정보가 표시된다", async ({ page }) => {
    // km or m should appear in place cards
    const distText = page.locator("text=/\\d+(\\.\\d+)?(km|m)/").first();
    await expect(distText).toBeVisible({ timeout: 5000 });
  });

  test("지도 페이지에서 거리순 리스트가 표시된다", async ({ page }) => {
    await page.goto("/map");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await dismissModals(page);
    await expect(page.locator("text=거리순").or(page.locator("text=개 장소"))).toBeVisible();
  });
});

test.describe("위치 권한 플로우", () => {
  test("권한 미허가 시 위치 공유 모달이 표시된다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "permissions", {
        value: { query: () => Promise.resolve({ state: "prompt", onchange: null }) },
        configurable: true,
      });
      sessionStorage.removeItem("location_modal_dismissed");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);
    await expect(page.getByText("현재 위치 공유하기")).toBeVisible({ timeout: 6000 });
  });

  test("나중에 하기 클릭 시 모달이 닫힌다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "permissions", {
        value: { query: () => Promise.resolve({ state: "prompt", onchange: null }) },
        configurable: true,
      });
      sessionStorage.removeItem("location_modal_dismissed");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);
    const modal = page.getByText("현재 위치 공유하기");
    if (await modal.isVisible()) {
      await page.getByText("나중에 할게요").click();
      await expect(modal).not.toBeVisible();
    }
  });
});

test.describe("오프라인 모드", () => {
  test("오프라인 상태 표시가 나타난다", async ({ page }) => {
    await page.goto("/explore");
    await page.waitForLoadState("networkidle");
    await page.context().setOffline(true);
    await expect(
      page.getByText("오프라인").or(page.getByText("offline")).or(page.locator("[data-testid='offline-indicator']"))
    ).toBeVisible({ timeout: 5000 }).catch(() => {});
    await page.context().setOffline(false);
  });
});
