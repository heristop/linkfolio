import { test, expect } from "vitest";
import {
  arrangeBento,
  resolveDirection,
  resolveSpan,
} from "../../src/lib/bento";
import type { SocialNetworkType } from "../../src/types";

function link(overrides: Partial<SocialNetworkType> = {}): SocialNetworkType {
  return { url: "#", iconSrc: "i", title: "t", description: "d", ...overrides };
}

test("resolveSpan: an explicit span wins over the group default", () => {
  expect(resolveSpan(link({ group: "project", span: "1x2" }))).toBe("1x2");
});

test("resolveSpan: groups carry their own tile size", () => {
  expect(resolveSpan(link({ group: "project" }))).toBe("2x2");
  expect(resolveSpan(link({ group: "website" }))).toBe("2x1");
  expect(resolveSpan(link({ group: "socialnetwork" }))).toBe("1x1");
});

test("resolveSpan: no group or an unknown group falls back to 1x1", () => {
  expect(resolveSpan(link())).toBe("1x1");
  expect(resolveSpan(link({ group: "podcast" }))).toBe("1x1");
});

test("resolveDirection: an explicit direction wins even on a wide tile", () => {
  expect(resolveDirection(link({ span: "2x1", direction: "vertical" }))).toBe(
    "vertical",
  );
});

test("resolveDirection: only the one-row wide tile lays out horizontally", () => {
  expect(resolveDirection(link({ span: "2x1" }))).toBe("horizontal");
  // The group default feeds the same rule, not just an explicit span.
  expect(resolveDirection(link({ group: "website" }))).toBe("horizontal");

  expect(resolveDirection(link({ span: "1x1" }))).toBe("vertical");
  expect(resolveDirection(link({ span: "2x2" }))).toBe("vertical");
  expect(resolveDirection(link({ span: "1x2" }))).toBe("vertical");
  expect(resolveDirection(link())).toBe("vertical");
});

test("arrangeBento: keeps every link, none duplicated or dropped", () => {
  const links = [
    link({ title: "p1", group: "project" }),
    link({ title: "w1", group: "website" }),
    link({ title: "s1" }),
    link({ title: "s2" }),
    link({ title: "p2", group: "project" }),
    link({ title: "s3" }),
  ];

  const out = arrangeBento(links);

  expect(out).toHaveLength(links.length);
  expect(new Set(out)).toEqual(new Set(links));
});

test("arrangeBento: an all-small list keeps its config order", () => {
  const links = [
    link({ title: "a" }),
    link({ title: "b" }),
    link({ title: "c" }),
  ];

  expect(arrangeBento(links).map((l) => l.title)).toEqual(["a", "b", "c"]);
});

test("arrangeBento: an empty list stays empty", () => {
  expect(arrangeBento([])).toEqual([]);
});

test("arrangeBento: big and medium anchors alternate instead of banding", () => {
  const links = [
    link({ title: "p1", group: "project" }),
    link({ title: "p2", group: "project" }),
    link({ title: "w1", group: "website" }),
    link({ title: "w2", group: "website" }),
  ];

  expect(arrangeBento(links).map((l) => l.title)).toEqual([
    "p1",
    "w1",
    "p2",
    "w2",
  ]);
});

test("arrangeBento: smalls are spread evenly between the anchors", () => {
  const links = [
    link({ title: "p1", group: "project" }),
    link({ title: "p2", group: "project" }),
    link({ title: "s1" }),
    link({ title: "s2" }),
    link({ title: "s3" }),
    link({ title: "s4" }),
  ];

  // run = ceil(4 smalls / 2 anchors) = 2 smalls after each anchor.
  expect(arrangeBento(links).map((l) => l.title)).toEqual([
    "p1",
    "s1",
    "s2",
    "p2",
    "s3",
    "s4",
  ]);
});

test("arrangeBento: leftover smalls trail after the last anchor", () => {
  const links = [
    link({ title: "s1" }),
    link({ title: "s2" }),
    link({ title: "s3" }),
    link({ title: "p1", group: "project" }),
    link({ title: "p2", group: "project" }),
  ];

  // run = ceil(3 / 2) = 2, so the second anchor only gets one small.
  expect(arrangeBento(links).map((l) => l.title)).toEqual([
    "p1",
    "s1",
    "s2",
    "p2",
    "s3",
  ]);
});

test("arrangeBento: relative order within one size class is preserved", () => {
  const links = [
    link({ title: "s1" }),
    link({ title: "p1", group: "project" }),
    link({ title: "s2" }),
    link({ title: "w1", group: "website" }),
    link({ title: "s3" }),
    link({ title: "p2", group: "project" }),
    link({ title: "w2", group: "website" }),
  ];

  const titles = arrangeBento(links).map((l) => l.title);
  const orderOf = (subset: string[]) =>
    titles.filter((t) => subset.includes(t));

  expect(orderOf(["p1", "p2"])).toEqual(["p1", "p2"]);
  expect(orderOf(["w1", "w2"])).toEqual(["w1", "w2"]);
  expect(orderOf(["s1", "s2", "s3"])).toEqual(["s1", "s2", "s3"]);
});

test("arrangeBento: a custom span reclassifies a link, not its group", () => {
  const links = [
    // A socialnetwork link promoted to a big tile anchors the grid.
    link({ title: "hero", span: "2x3" }),
    link({ title: "s1" }),
    link({ title: "s2" }),
  ];

  expect(arrangeBento(links).map((l) => l.title)).toEqual(["hero", "s1", "s2"]);
});
