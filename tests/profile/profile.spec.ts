import { test, expect } from "@playwright/test";

/**
 * Runs under playwright.profile.config.ts against a build made WITHOUT
 * LINKFOLIO_SHOWCASE — the deployment a fork gets by default. Everything
 * asserted here is the mirror image of tests/landing.spec.ts.
 */

test("the root is the personal profile, not the landing page", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator(".lf-card")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);

  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const jsonLd = scripts.join("");

  expect(jsonLd).toContain('"@type":"ProfilePage"');
  expect(jsonLd).toContain('"@type":"Person"');
  expect(jsonLd).not.toContain("SoftwareApplication");
});

test("the marketing routes render the 404 page", async ({ page }) => {
  for (const path of ["/docs", "/demo"]) {
    await page.goto(path);

    // Statically prerendered pages that threw notFound() stream a 200 with
    // the not-found content — a soft 404. Per Next's not-found docs, the
    // `noindex` robots meta is what keeps these out of search results, so
    // that (not the status code) is the contract asserted here.
    await expect(
      page.getByText("This page does not exist"),
      path,
    ).toBeVisible();
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]').first(),
      path,
    ).toHaveCount(1);
    // The route's own marketing metadata must not sneak an index directive
    // in beside the not-found boundary's noindex.
    await expect(
      page.locator('meta[name="robots"][content*="index, follow"]'),
      path,
    ).toHaveCount(0);
  }
});

test("the sitemap lists only the root", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  const xml = await response.text();

  expect(response.ok()).toBe(true);
  expect(xml.match(/<loc>/g)).toHaveLength(1);
});

test("the project llms.txt and llms-full.txt are not published", async ({
  request,
}) => {
  for (const path of ["/llms.txt", "/llms-full.txt"]) {
    const response = await request.get(path);

    expect(response.status(), path).toBe(404);
  }
});

test("the 404 page stops advertising the documentation", async ({ page }) => {
  await page.goto("/no-such-page");

  await expect(
    page.getByRole("link", { name: "Read the documentation" }),
  ).toHaveCount(0);
  // The way home survives.
  await expect(
    page.getByRole("link", { name: "Back to the home page" }),
  ).toBeVisible();
});
