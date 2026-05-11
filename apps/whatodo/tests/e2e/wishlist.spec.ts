import { test, expect } from "@playwright/test";

async function removeOverlay(page: any) {
  await page.evaluate(() => {
    document.querySelectorAll("[class*='fixed inset-0']").forEach((el) => el.remove());
  });
}

test.describe("Wishlist & Visited", () => {
  test("빈 위시리스트 상태를 보여준다", async ({ page }) => {
    await page.goto("/wishlist");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("wishlist-empty")).toBeVisible();
    await expect(page.getByTestId("wishlist-explore-link")).toBeVisible();
  });

  test("빈 방문 목록 상태를 보여준다", async ({ page }) => {
    await page.goto("/visited");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("visited-empty")).toBeVisible();
    await expect(page.getByTestId("visited-explore-link")).toBeVisible();
  });

  test("탐색 링크로 이동한다", async ({ page }) => {
    await page.goto("/wishlist");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await page.getByTestId("wishlist-explore-link").click();
    await expect(page).toHaveURL(/explore/);
  });
});
