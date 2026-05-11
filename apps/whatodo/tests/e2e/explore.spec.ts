import { test, expect } from "@playwright/test";

async function removeOverlay(page: any) {
  await page.evaluate(() => {
    document.querySelectorAll("[class*='fixed inset-0']").forEach((el) => el.remove());
  });
}

test.describe("Explore Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/explore");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
  });

  test("도시 탭이 표시된다", async ({ page }) => {
    await expect(page.getByTestId("city-tab-toronto")).toBeVisible();
    await expect(page.getByTestId("city-tab-vancouver")).toBeVisible();
  });

  test("카테고리 필터가 표시된다", async ({ page }) => {
    await expect(page.getByTestId("cat-food")).toBeVisible();
    await expect(page.getByTestId("cat-cafe")).toBeVisible();
    await expect(page.getByTestId("cat-sight")).toBeVisible();
  });

  test("검색어 입력 시 필터링된다", async ({ page }) => {
    await page.getByTestId("search-input").fill("cafe");
    await page.waitForTimeout(300);
    await expect(page.getByTestId("results-count")).toBeVisible();
  });

  test("필터 버튼 토글이 동작한다", async ({ page }) => {
    await page.getByTestId("search-filter").click();
    await expect(page.getByTestId("filter-free")).toBeVisible();
    await page.getByTestId("search-filter").click();
    await expect(page.getByTestId("filter-free")).not.toBeVisible();
  });

  test("무료 필터 적용 시 결과가 줄어든다", async ({ page }) => {
    const initialCount = await page.getByTestId("results-count").textContent();
    await page.getByTestId("search-filter").click();
    await page.getByTestId("filter-free").click();
    const filteredCount = await page.getByTestId("results-count").textContent();
    expect(filteredCount).not.toBe(initialCount);
  });

  test("필터 초기화 버튼이 동작한다", async ({ page }) => {
    await page.getByTestId("search-filter").click();
    await page.getByTestId("filter-free").click();
    await page.getByTestId("filter-reset").click();
    await expect(page.getByTestId("filter-reset")).not.toBeVisible();
  });
});
