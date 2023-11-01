import { test, expect } from "@playwright/test";

test("displays social network list", async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto("/");
  await expect(page).toHaveScreenshot();

  await expect(page.locator(".avatar")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".alias")).toBeVisible();
  const networks = await page.locator(".network").count();
  expect(networks).toBeGreaterThan(0);
  await expect(page.locator("footer")).toBeVisible();

  await page.close();
});
