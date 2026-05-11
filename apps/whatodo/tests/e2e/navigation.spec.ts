import { test, expect } from "@playwright/test";

async function removeOverlay(page: any) {
  await page.evaluate(() => {
    document.querySelectorAll("[class*='fixed inset-0']").forEach((el) => el.remove());
  });
}

test.describe("Navigation", () => {
  test("홈페이지가 로드된다", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page).toHaveTitle(/오늘 뭐하지/);
  });

  test("네비게이션 링크가 표시된다", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await expect(page.getByTestId("nav-map")).toBeVisible();
    await expect(page.getByTestId("nav-explore")).toBeVisible();
    await expect(page.getByTestId("nav-wishlist")).toBeVisible();
    await expect(page.getByTestId("nav-visited")).toBeVisible();
  });

  test("탐색 페이지로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await page.getByTestId("nav-explore").click();
    await page.waitForURL(/explore/);
    await expect(page).toHaveURL(/explore/);
  });

  test("가고싶다 페이지로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await page.getByTestId("nav-wishlist").click();
    await page.waitForURL(/wishlist/);
    await expect(page).toHaveURL(/wishlist/);
  });

  test("다녀왔어요 페이지로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await removeOverlay(page);
    await page.getByTestId("nav-visited").click();
    await page.waitForURL(/visited/);
    await expect(page).toHaveURL(/visited/);
  });
});
