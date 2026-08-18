import { test, expect } from "@playwright/test";
import { COMPARISON_ROWS } from "../app/lib/projectContent";

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

  // Not a header-label assertion: below `sm` the <thead> is `max-sm:sr-only`,
  // and `toBeVisible()` passes for a 1×1 clipped sr-only element, so a
  // header-only check is vacuous on the two mobile projects. A comparison
  // cell's value only exists in the table body, so it means something at
  // every viewport.
  const costRow = COMPARISON_ROWS.find((row) => row.label === "Cost");

  if (!costRow) throw new Error('no "Cost" row in COMPARISON_ROWS');

  await expect(
    table.getByText(costRow.cells.linktree, { exact: true }),
  ).toBeVisible();
  await expect(
    table.getByText(costRow.cells.linkstack, { exact: true }),
  ).toBeVisible();
  await expect(
    table.getByText(costRow.cells.biolink, { exact: true }),
  ).toBeVisible();
});

test("/llms-full.txt is published on the showcase build", async ({
  request,
}) => {
  const response = await request.get("/llms-full.txt");

  expect(response.ok()).toBe(true);

  const body = await response.text();
  const costRow = COMPARISON_ROWS.find((row) => row.label === "Cost");

  if (!costRow) throw new Error('no "Cost" row in COMPARISON_ROWS');

  expect(body).toContain(costRow.label);
});
