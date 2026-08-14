import { test, expect } from "@playwright/test";

/* The rendered-output baseline for this card lives in tests/profile/, which
   builds without the showcase flag — see that file for why. */

test("demo page displays social network list", async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto("/demo");

  await expect(page.locator(".avatar")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".alias")).toBeVisible();
  const networks = await page.locator(".network").count();
  expect(networks).toBeGreaterThan(0);
  await expect(page.locator("footer")).toBeVisible();

  await page.close();
});
