import { test, expect } from "vitest";
import {
  buildSitemapEntries,
  resolveAppUrl,
  resolveShowcase,
} from "../../app/lib/deployMode";

test("showcase mode requires the exact value '1'", () => {
  expect(resolveShowcase({ LINKFOLIO_SHOWCASE: "1" })).toBe(true);
  expect(resolveShowcase({})).toBe(false);
  expect(resolveShowcase({ LINKFOLIO_SHOWCASE: "0" })).toBe(false);
  expect(resolveShowcase({ LINKFOLIO_SHOWCASE: "true" })).toBe(false);
});

test("NEXT_APP_URL wins in both modes, trailing slash stripped", () => {
  const env = { NEXT_APP_URL: "https://alice.dev/" };

  expect(resolveAppUrl(env, false)).toBe("https://alice.dev");
  expect(resolveAppUrl(env, true)).toBe("https://alice.dev");
});

test("showcase mode falls back to the project's own domain", () => {
  expect(resolveAppUrl({}, true)).toBe("https://linkfolio-demo.vercel.app");
});

test("a personal deployment on Vercel falls back to the production hostname", () => {
  const env = { VERCEL_PROJECT_PRODUCTION_URL: "alice.vercel.app" };

  expect(resolveAppUrl(env, false)).toBe("https://alice.vercel.app");
});

// The one wrong answer here would be the old behavior: a fork without
// NEXT_APP_URL canonicalising onto linkfolio-demo.vercel.app.
test("a personal deployment never inherits the demo domain", () => {
  expect(resolveAppUrl({}, false)).toBe("");
});

test("the sitemap advertises marketing routes only in showcase mode", () => {
  const showcase = buildSitemapEntries("https://x.dev", true);
  const profile = buildSitemapEntries("https://x.dev", false);

  expect(showcase.map((e) => e.url)).toEqual([
    "https://x.dev",
    "https://x.dev/demo",
    "https://x.dev/docs",
    "https://x.dev/llms.txt",
    "https://x.dev/llms-full.txt",
  ]);
  expect(profile.map((e) => e.url)).toEqual(["https://x.dev"]);
});

test("the root entry outranks the marketing pages", () => {
  const [root, ...rest] = buildSitemapEntries("https://x.dev", true);

  expect(root.priority).toBe(1);
  for (const entry of rest) expect(entry.priority).toBeLessThan(1);
});
