import { test, expect } from "@playwright/test";

test("landing page has product schema and no person entity", async ({
  page,
}) => {
  await page.goto("/");

  const h1Count = await page.locator("h1").count();
  expect(h1Count).toBe(1);

  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const combined = scripts.join(" ");
  expect(combined).toContain("SoftwareApplication");
  expect(combined).not.toContain('"@type":"Person"');
  expect(combined).not.toContain('"@type":"ProfilePage"');

  await expect(page.locator(".lf-card").first()).toBeVisible();
});
