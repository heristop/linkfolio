import { expect, test } from "@playwright/test";
import { join } from "node:path";

const axePath = join(process.cwd(), "node_modules/axe-core/axe.min.js");

/**
 * Cards fade in as they are revealed, and a half-faded colour blends with the
 * background. Auditing mid-transition reports contrast failures that do not
 * exist once the page settles, so wait the entrance out before scanning.
 */
const SETTLE_MS = 2500;

type Violation = {
  id: string;
  impact: string | null;
  help: string;
  nodes: { html: string }[];
};

const ROUTES = [
  "/",
  "/demo",
  "/docs",
  "/bad-request",
  // Any unmatched path renders app/not-found.tsx.
  "/no-such-page",
];

for (const route of ROUTES) {
  test(`${route} has no axe violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForTimeout(SETTLE_MS);
    await page.addScriptTag({ path: axePath });

    const violations = await page.evaluate(async () => {
      const axe = (
        globalThis as unknown as {
          axe: { run: (c: Document) => Promise<{ violations: Violation[] }> };
        }
      ).axe;
      const result = await axe.run(document);

      return result.violations;
    });

    const summary = violations.map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.help} — ${v.nodes[0]?.html.slice(0, 120)}`,
    );

    expect(summary, summary.join("\n")).toEqual([]);
  });
}
