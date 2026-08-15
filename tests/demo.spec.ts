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

test("demo page publishes no structured data for its fixture profile", async ({
  page,
}) => {
  await page.goto("/demo");

  // The profile here is a fixture whose links all point at "#1".."#17".
  // Emitting a Person for it would assert to search engines that someone
  // exists who does not, so this page carries no graph at all.
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );

  // Its own page metadata is unaffected by that.
  await expect(page).toHaveTitle(/Live demo/);
});
