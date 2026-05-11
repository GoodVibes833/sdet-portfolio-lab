import { test, expect } from "@playwright/test";

async function removeOverlay(page: any) {
  await page.evaluate(() => {
    document.querySelectorAll("[class*='fixed inset-0']").forEach((el) => el.remove());
  });
}

test.describe("Missions Page", () => {
  test("미션 페이지가 로드된다", async ({ page }) => {
    await page.goto("/missions");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("missions-heading")).toBeVisible();
  });

  test("미션 탭과 뱃지 탭이 전환된다", async ({ page }) => {
    await page.goto("/missions");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("missions-tab")).toBeVisible();
    await expect(page.getByTestId("badges-tab")).toBeVisible();
    await page.getByTestId("badges-tab").click();
    await expect(page.getByTestId("badges-tab")).toBeVisible();
  });
});
