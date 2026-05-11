import { test, expect } from "@playwright/test";

async function removeOverlay(page: any) {
  await page.evaluate(() => {
    document.querySelectorAll("[class*='fixed inset-0']").forEach((el) => el.remove());
  });
}

test.describe("Place Detail Page", () => {
  test("CN 타워 상세 페이지가 로드된다", async ({ page }) => {
    await page.goto("/place/cn-tower");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("place-heading")).toBeVisible();
  });

  test("장소 정보 카드가 표시된다", async ({ page }) => {
    await page.goto("/place/cn-tower");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("place-heading")).toBeVisible();
  });
});
