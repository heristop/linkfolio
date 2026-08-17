import { test, expect } from "vitest";
import {
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  FAQ,
  SOURCES,
  renderComparisonMarkdown,
  renderFaqMarkdown,
  renderContentPlainText,
} from "../../app/lib/projectContent";

test("every row supplies a cell for every column", () => {
  for (const row of COMPARISON_ROWS) {
    for (const column of COMPARISON_COLUMNS) {
      expect(
        row.cells[column.key],
        `row "${row.label}" is missing column "${column.key}"`,
      ).toBeTypeOf("string");
    }
  }
});

test("exactly one column is the featured one", () => {
  expect(COMPARISON_COLUMNS.filter((c) => c.featured)).toHaveLength(1);
  expect(COMPARISON_COLUMNS.find((c) => c.featured)?.key).toBe("linkfolio");
});

// Guards the rule that a claim about somebody else's product is only as good
// as the page it was read from. A column with no dated source is a claim we
// cannot defend.
test("every competitor column has a dated source", () => {
  for (const column of COMPARISON_COLUMNS) {
    if (column.featured) continue;

    const source = SOURCES.find((s) => s.product === column.label);

    expect(source, `no source recorded for ${column.label}`).toBeTruthy();
    expect(source?.url).toMatch(/^https:\/\//);
    expect(source?.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
});

// D0. The one failure mode that would actively hurt us: naming the unrelated
// products that share this project's name anywhere in published content.
test("no same-name product is named in any rendering", () => {
  const published = [
    renderComparisonMarkdown(),
    renderFaqMarkdown(),
    renderContentPlainText(),
  ].join("\n");

  expect(published).not.toMatch(/linkfolio\.(ai|io|net|cv|live|me|online)/i);
  expect(published).not.toMatch(/link-folio\.com/i);
});

test("the markdown table has a header, a separator and one row each", () => {
  const lines = renderComparisonMarkdown().trim().split("\n");

  // Columns are padded to their widest cell (oxfmt's table convention, which
  // the generator now matches — see renderComparisonMarkdown's doc comment),
  // so the header row is no longer "| Linkfolio |" exactly; it still names
  // every column and stays pipe-delimited.
  expect(lines[0]).toMatch(/^\|.*\bLinkfolio\b.*\|$/);
  for (const column of COMPARISON_COLUMNS) {
    expect(lines[0]).toContain(column.label);
  }
  expect(lines[1]).toMatch(/^\|[\s|:-]+\|$/);
  expect(lines).toHaveLength(2 + COMPARISON_ROWS.length);
});

test("the FAQ markdown renders one heading per entry", () => {
  const markdown = renderFaqMarkdown();

  for (const entry of FAQ) {
    expect(markdown).toContain(`### ${entry.q}`);
    expect(markdown).toContain(entry.a);
  }
});

test("the plain-text rendering carries both the table and the FAQ", () => {
  const text = renderContentPlainText();

  expect(text).toContain(COMPARISON_ROWS[0].label);
  expect(text).toContain(FAQ[0].q);
});

test("the FAQ keeps the answers it already had", () => {
  const questions = FAQ.map((f) => f.q);

  expect(questions).toContain("Is Linkfolio free?");
  expect(questions).toContain("How is it different from Linktree?");
  expect(questions).toContain("Do I need to know Next.js to use it?");
  expect(questions).toContain("Can I add it to an existing Next.js project?");
  expect(questions).toContain("Can I use Google Analytics with Linkfolio?");
});
