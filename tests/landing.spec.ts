import { test, expect } from "@playwright/test";

async function graphOf(page: import("@playwright/test").Page) {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();

  return scripts.flatMap((raw) => {
    const parsed = JSON.parse(raw);

    return (parsed["@graph"] ?? [parsed]) as Record<string, unknown>[];
  });
}

test("landing page describes the product, not a profile", async ({ page }) => {
  await page.goto("/");

  const h1Count = await page.locator("h1").count();
  expect(h1Count).toBe(1);

  const graph = await graphOf(page);
  const types = graph.map((node) => node["@type"]);

  expect(types).toContain("SoftwareApplication");

  // The demo profile is a fixture — links pointing at "#1".."#17" — so no
  // node may claim it as an entity. A ProfilePage is that claim by definition.
  expect(types).not.toContain("ProfilePage");

  await expect(page.locator(".lf-card").first()).toBeVisible();
});

test("the only Person on the landing page is the real author", async ({
  page,
}) => {
  await page.goto("/");

  const graph = await graphOf(page);
  const people = graph.filter((node) => node["@type"] === "Person");

  // One Person, and it is the author of the project rather than the demo
  // profile the hero card happens to render.
  expect(people).toHaveLength(1);
  expect(people[0].sameAs).toContain("https://github.com/heristop");
  expect(people[0].name).not.toBe("Linkfolio");
});

test("the comparison table names the products it compares against", async ({
  page,
}) => {
  await page.goto("/");

  const table = page.getByRole("table");

  await expect(table.getByText("Linktree", { exact: true })).toBeVisible();
  await expect(table.getByText("LinkStack", { exact: true })).toBeVisible();
  await expect(table.getByText("Bio.link", { exact: true })).toBeVisible();
});
