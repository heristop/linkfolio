import { test, expect } from "vitest";
import { version } from "../../package.json";
import { buildLandingJsonLd } from "../../app/lib/landingJsonLd";

const ORIGIN = "https://linkfolio-demo.vercel.app";

function graph() {
  return JSON.parse(buildLandingJsonLd(ORIGIN))["@graph"] as Record<
    string,
    unknown
  >[];
}

function node(type: string) {
  const found = graph().find((n) => n["@type"] === type);
  if (!found) throw new Error(`no ${type} in graph`);
  return found;
}

// The point of the whole entity-consolidation change: a search engine seeing
// this page must be able to tell that the repo and the package are the same
// project as the site. Without sameAs it has to guess, and there are several
// unrelated products sharing this name for it to guess wrong about.
test("the software links its repository and its package as the same entity", () => {
  const sameAs = node("SoftwareApplication").sameAs as string[];

  expect(sameAs).toContain("https://github.com/heristop/linkfolio");
  expect(sameAs).toContain("https://www.npmjs.com/package/linkfolio");
});

test("the website claims the same two corroborating URLs", () => {
  const sameAs = node("WebSite").sameAs as string[];

  expect(sameAs).toContain("https://github.com/heristop/linkfolio");
  expect(sameAs).toContain("https://www.npmjs.com/package/linkfolio");
});

test("the software describes itself as free and installable", () => {
  const app = node("SoftwareApplication");

  expect(app.isAccessibleForFree).toBe(true);
  expect(app.installUrl).toBe("https://www.npmjs.com/package/linkfolio");
  expect(app.downloadUrl).toBe("https://www.npmjs.com/package/linkfolio");
  expect(Array.isArray(app.featureList)).toBe(true);
  expect((app.featureList as string[]).length).toBeGreaterThan(3);
});

// Read from package.json rather than typed as a literal: a release that bumps
// the version must not be able to leave this claim stale.
test("the advertised version matches the package", () => {
  expect(node("SoftwareApplication").softwareVersion).toBe(version);
});

// Guarded explicitly because it is the tempting wrong move: a rating would
// light up a rich snippet, and we have no ratings to report.
test("no rating is claimed", () => {
  expect(buildLandingJsonLd(ORIGIN)).not.toContain("aggregateRating");
});

test("every absolute URL in the graph is origin-anchored or external", () => {
  expect(buildLandingJsonLd(ORIGIN)).not.toContain('"/');
});
