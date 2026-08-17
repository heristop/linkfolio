/**
 * Rewrites the generated blocks in README.md from app/lib/projectContent.ts.
 *
 * Run with plain `node` — Node strips the types natively, which is why the
 * content module imports nothing and uses no path aliases. Only the regions
 * between the markers are touched, so the README stays a hand-written
 * document that happens to contain two generated tables.
 *
 * Run: pnpm gen:readme
 */
import { readFileSync, writeFileSync } from "node:fs";
import {
  renderComparisonMarkdown,
  renderFaqMarkdown,
} from "../app/lib/projectContent.ts";

const path = new URL("../README.md", import.meta.url);

function replaceBlock(source: string, name: string, body: string): string {
  const pattern = new RegExp(
    `(<!-- generated:${name} -->\\n)[\\s\\S]*?(<!-- /generated:${name} -->)`,
  );

  if (!pattern.test(source)) {
    throw new Error(`README.md has no generated:${name} block`);
  }

  // A function replacer, not a template string: body can contain literal
  // "$1"-shaped substrings (e.g. LinkStack's "$1/mo"), which String.replace
  // would otherwise reinterpret as a capture-group reference and corrupt.
  //
  // A blank line surrounds the body on both sides: oxfmt (which also owns
  // README.md via lint-staged) wants a blank line after an opening HTML
  // comment and before a closing one, so this matches its canonical form
  // instead of leaving the next commit to re-fight the formatting.
  // readme-sync.spec.ts trims each extracted block before comparing, so
  // this extra whitespace doesn't affect the sync check.
  return source.replace(
    pattern,
    (_match, open, close) => `${open}\n${body}\n\n${close}`,
  );
}

let readme = readFileSync(path, "utf8");
readme = replaceBlock(readme, "comparison", renderComparisonMarkdown());
readme = replaceBlock(readme, "faq", renderFaqMarkdown());
writeFileSync(path, readme);

console.log("README.md regenerated");
