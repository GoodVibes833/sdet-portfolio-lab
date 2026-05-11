import { test, expect } from "@playwright/test";

async function removeOverlay(page: any) {
  await page.evaluate(() => {
    document.querySelectorAll("[class*='fixed inset-0']").forEach((el) => el.remove());
  });
}

test.describe("Map Page", () => {
  test("지도 페이지가 로드된다", async ({ page }) => {
    await page.goto("/map");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("map-heading")).toBeVisible();
  });

  test("카테고리 필터 버튼이 표시된다", async ({ page }) => {
    await page.goto("/map");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("map-cat-food")).toBeVisible();
    await expect(page.getByTestId("map-cat-cafe")).toBeVisible();
  });
});
