import { expect, test, type Page } from "@playwright/test";
import { join } from "node:path";

const axePath = join(process.cwd(), "node_modules/axe-core/axe.min.js");

/**
 * `layout: "bento"` is a config option, and the demo panel is the only place
 * it can be switched on at runtime — so the panel is how these tests reach it.
 * Escape closes the panel afterwards: it overlays the card's top-right corner,
 * and every measurement below is taken on the card underneath.
 */
async function selectLayout(page: Page, layout: "classic" | "bento") {
  await page.getByRole("button", { name: "Tweak" }).click();
  // The panel unfurls over ~220ms; clicking a control mid-animation is a race
  // that only shows up under parallel load.
  await expect(page.locator("#tweak-panel")).toHaveCSS("opacity", "1");

  const option = page.locator(`input[name="layout"][value="${layout}"]`);
  await page
    .locator(`label:has(input[name="layout"][value="${layout}"])`)
    .click();
  await expect(option).toBeChecked();

  await page.keyboard.press("Escape");
}

/** Bounding box of the first tile of a given span, failing loudly if absent. */
async function tileBox(page: Page, span: string) {
  const box = await page
    .locator(`.network[data-span="${span}"]`)
    .first()
    .boundingBox();

  // A throw rather than expect(...).not.toBeNull(): the assertion does not
  // narrow the type, so the caller would still be handling `null`.
  if (!box) throw new Error(`no tile rendered for span "${span}"`);

  return box;
}

test.describe("bento layout", () => {
  test("classic stays the default arrangement", async ({ page }) => {
    await page.goto("/demo");

    const links = page.locator(".lf-links");
    await expect(links).toHaveAttribute("data-layout", "classic");

    // One section per group, laid out by the flex rules — untouched by bento.
    expect(await page.locator(".lf-group").count()).toBeGreaterThan(1);
    await expect(page.locator(".lf-group").first()).toHaveCSS(
      "display",
      "flex",
    );
  });

  test("bento merges every group into one four-column grid", async ({
    page,
  }) => {
    // Four columns is the desktop arrangement; the phone case collapses to two
    // and has its own test below. Pin the width so this asserts what it names
    // whichever project runs it.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/demo");
    await selectLayout(page, "bento");

    await expect(page.locator(".lf-links")).toHaveAttribute(
      "data-layout",
      "bento",
    );

    // A mosaic needs the sizes to share one grid: merged, not one grid per
    // group. Group dividers have nothing left to sit between.
    await expect(page.locator(".lf-group")).toHaveCount(1);

    const grid = page.locator(".lf-group");
    await expect(grid).toHaveCSS("display", "grid");

    const columns = await grid.evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(" ").length,
    );
    expect(columns).toBe(4);
  });

  test("every span renders the footprint its name states", async ({ page }) => {
    await page.goto("/demo");
    await selectLayout(page, "bento");

    const small = await tileBox(page, "1x1");
    const wide = await tileBox(page, "2x1");
    const tall = await tileBox(page, "1x2");
    const large = await tileBox(page, "2x2");

    // Two columns plus the gap between them, so a shade over 2x — never 1x
    // (span ignored) and never 3x (span applied twice).
    for (const tile of [wide, large]) {
      expect(tile.width / small.width).toBeGreaterThan(1.8);
      expect(tile.width / small.width).toBeLessThan(2.3);
    }

    expect(tall.width).toBeCloseTo(small.width, 0);
    expect(wide.height).toBeCloseTo(small.height, 0);

    for (const tile of [tall, large]) {
      expect(tile.height / small.height).toBeGreaterThan(1.8);
      expect(tile.height / small.height).toBeLessThan(2.3);
    }
  });

  test("a link's own span overrides its group's default", async ({ page }) => {
    await page.goto("/demo");
    await selectLayout(page, "bento");

    // GitHub is a socialnetwork link — 1x1 by default — carrying span "1x2"
    // in the demo config, so the group default must lose.
    const github = page.locator('.network:has(:text-is("GitHub"))');
    await expect(github).toHaveAttribute("data-span", "1x2");

    const small = await tileBox(page, "1x1");
    const box = await github.boundingBox();
    if (!box) throw new Error("GitHub tile not rendered");

    expect(box.height / small.height).toBeGreaterThan(1.8);
  });

  test("a horizontal card sets its image beside the text", async ({ page }) => {
    await page.goto("/demo");
    await selectLayout(page, "bento");

    const card = page.locator('.network[data-direction="horizontal"]').first();
    await expect(card).toHaveCount(1);

    // row-reverse, not `row`: the title stays first in the DOM for a screen
    // reader while the picture is painted on the right.
    await expect(card.locator("a").first()).toHaveCSS(
      "flex-direction",
      "row-reverse",
    );

    const media = await card.locator(".lf-icon-container").boundingBox();
    const text = await card.locator(".lf-data").boundingBox();
    if (!media || !text) throw new Error("horizontal card is missing a half");

    // Side by side, not stacked.
    expect(text.x).toBeLessThan(media.x);
    expect(Math.abs(text.y - media.y)).toBeLessThan(text.height);
  });

  test("sizes alternate rather than rendering group by group", async ({
    page,
  }) => {
    await page.goto("/demo");
    await selectLayout(page, "bento");

    // The config lists twelve social links before any website or project. If
    // that order reached the grid the first tiles would all be 1x1 — bands,
    // not a mosaic.
    const spans = await page
      .locator(".lf-bento > .network")
      .evaluateAll((tiles) =>
        tiles.slice(0, 6).map((tile) => (tile as HTMLElement).dataset.span),
      );

    expect(new Set(spans).size).toBeGreaterThan(1);
  });

  test("the grid collapses to two columns on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 780 });
    // `domcontentloaded`, not the default `load`: this is the only test that
    // asks for a 375px-wide page, so every image is requested at a width the
    // optimiser has not produced before. Waiting for all of them to arrive
    // makes a layout assertion hostage to image work it never looks at, and
    // on a single-worker runner that has timed out the navigation.
    await page.goto("/demo", { waitUntil: "domcontentloaded" });
    await selectLayout(page, "bento");

    const columns = await page
      .locator(".lf-group")
      .evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(2);

    // Wide and large tiles take the full row rather than shrinking a small
    // tile below a tappable size.
    const small = await tileBox(page, "1x1");
    const large = await tileBox(page, "2x2");
    expect(large.width / small.width).toBeGreaterThan(1.8);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("bento has no axe violations", async ({ page }) => {
    await page.goto("/demo");
    await selectLayout(page, "bento");
    // Cards fade in; a half-faded colour blends with the background and
    // reports contrast failures that do not exist once the page settles.
    await page.waitForTimeout(2500);
    await page.addScriptTag({ path: axePath });

    const violations = await page.evaluate(async () => {
      const axe = (
        globalThis as unknown as {
          axe: {
            run: (context: Document) => Promise<{
              violations: {
                id: string;
                impact: string | null;
                help: string;
                nodes: { html: string }[];
              }[];
            }>;
          };
        }
      ).axe;
      const result = await axe.run(document);

      return result.violations;
    });

    const summary = violations.map(
      (violation) =>
        `[${violation.impact}] ${violation.id}: ${violation.help} — ${violation.nodes[0]?.html.slice(0, 120)}`,
    );

    expect(summary, summary.join("\n")).toEqual([]);
  });
});
