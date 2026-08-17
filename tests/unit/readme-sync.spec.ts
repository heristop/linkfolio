import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  renderComparisonMarkdown,
  renderFaqMarkdown,
} from "../../app/lib/projectContent";

const README = readFileSync(
  new URL("../../README.md", import.meta.url),
  "utf8",
);

function block(name: string) {
  const match = README.match(
    new RegExp(
      `<!-- generated:${name} -->\\n([\\s\\S]*?)<!-- /generated:${name} -->`,
    ),
  );
  if (!match) throw new Error(`no generated:${name} block in README.md`);
  return match[1].trim();
}

// The README is the npm package page, so a drifted README is a drifted
// product page. Regenerating is one command; this test is what makes
// forgetting it a failure rather than a silent regression.
test("the README comparison matches the content module", () => {
  expect(block("comparison")).toBe(renderComparisonMarkdown().trim());
});

test("the README FAQ matches the content module", () => {
  expect(block("faq")).toBe(renderFaqMarkdown().trim());
});
