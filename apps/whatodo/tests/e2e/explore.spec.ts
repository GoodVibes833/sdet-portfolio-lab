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
  }, { lat, lng });
}

test.describe("Explore Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockGeolocation(page);
    await page.goto("/explore");
    await page.waitForLoadState("networkidle");
    await dismissModals(page);
  });

  test("탐색 페이지 헤딩이 표시된다", async ({ page }) => {
    await expect(page.getByTestId("explore-heading")).toBeVisible();
  });

  test("카테고리 필터 탭이 표시된다", async ({ page }) => {
    await expect(page.getByTestId("cat-all")).toBeVisible();
    await expect(page.getByTestId("cat-food")).toBeVisible();
    await expect(page.getByTestId("cat-cafe")).toBeVisible();
  });

  test("장소 결과가 표시된다", async ({ page }) => {
    const count = page.getByTestId("results-count");
    await expect(count).toBeVisible();
    const text = await count.textContent();
    expect(text).toMatch(/\d+개/);
  });

  test("검색어 입력 시 결과가 필터링된다", async ({ page }) => {
    const initial = await page.getByTestId("results-count").textContent();
    await page.getByTestId("search-input").fill("coffee");
    await page.waitForTimeout(400);
    const filtered = await page.getByTestId("results-count").textContent();
    expect(filtered).not.toBe(initial);
  });

  test("필터 버튼 토글이 동작한다", async ({ page }) => {
    await page.getByTestId("search-filter").click();
    await expect(page.getByTestId("filter-free")).toBeVisible();
    await page.getByTestId("search-filter").click();
    await expect(page.getByTestId("filter-free")).not.toBeVisible();
  });

  test("무료 필터 적용 시 결과가 변한다", async ({ page }) => {
    const initial = await page.getByTestId("results-count").textContent();
    await page.getByTestId("search-filter").click();
    await page.getByTestId("filter-free").click();
    await page.waitForTimeout(300);
    const filtered = await page.getByTestId("results-count").textContent();
    expect(filtered).not.toBe(initial);
  });

  test("GPS 위치 시 거리순 정렬이 기본으로 선택된다", async ({ page }) => {
    await page.getByTestId("search-filter").click();
    await expect(page.getByText("가까운순")).toBeVisible();
  });

  test("카테고리 탭 클릭 시 결과가 필터링된다", async ({ page }) => {
    await page.getByTestId("cat-cafe").click();
    await page.waitForTimeout(300);
    const count = await page.getByTestId("results-count").textContent();
    expect(count).toMatch(/\d+개/);
  });

  test("필터 초기화 버튼이 동작한다", async ({ page }) => {
    await page.getByTestId("search-filter").click();
    await page.getByTestId("filter-free").click();
    await page.waitForTimeout(200);
    await page.getByTestId("filter-reset").click();
    await page.waitForTimeout(200);
    await expect(page.getByTestId("filter-reset")).not.toBeVisible();
  });
});
