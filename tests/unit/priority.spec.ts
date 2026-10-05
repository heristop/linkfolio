import { test, expect } from "vitest";
import { eagerTileIndexes } from "../../src/lib/priority";
import type { SocialNetworkType } from "../../src/types";

function link(overrides: Partial<SocialNetworkType> = {}): SocialNetworkType {
  return { url: "#", iconSrc: "i", title: "t", description: "d", ...overrides };
}

const icons = (n: number) =>
  Array.from({ length: n }, () => link({ group: "socialnetwork" }));

test("the first four tiles stay eager", () => {
  expect([...eagerTileIndexes(icons(6))]).toEqual([0, 1, 2, 3]);
});

test("large tiles after the icons are eager too: one of them is the LCP", () => {
  const networks = [
    ...icons(5),
    link({ group: "website" }),
    link({ group: "project" }),
    link({ group: "project" }),
  ];

  expect([...eagerTileIndexes(networks)].toSorted((a, b) => a - b)).toEqual([
    0, 1, 2, 3, 5, 6,
  ]);
});

test("bento: an explicit span counts as large, an explicit 1x1 does not", () => {
  const networks = [
    ...icons(4),
    link({ group: "project", span: "1x1" }),
    link({ span: "2x1" }),
  ];

  const eager = eagerTileIndexes(networks, { bento: true });
  expect(eager.has(4)).toBe(false);
  expect(eager.has(5)).toBe(true);
});

test("large tiles already among the first four use up the large budget", () => {
  const networks = [
    link({ group: "project" }),
    link({ group: "project" }),
    ...icons(3),
    link({ group: "project" }),
  ];

  expect(eagerTileIndexes(networks).has(5)).toBe(false);
});

test("no tiles, nothing eager", () => {
  expect(eagerTileIndexes([]).size).toBe(0);
});

test("classic: a social icon given a bento span stays small", () => {
  // The real-world config that left the LCP banner lazy: GitHub carries
  // `span: "1x2"` for bento, which classic ignores.
  const networks = [
    link({ group: "socialnetwork", span: "1x2" }),
    ...icons(4),
    link({ group: "website" }),
    link({ group: "project" }),
  ];

  const eager = eagerTileIndexes(networks);
  expect(eager.has(5)).toBe(true);
  expect(eager.has(6)).toBe(true);
});
