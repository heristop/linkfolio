import { test, expect } from "@playwright/test";
import {
  escapeJsonLd,
  isPublicUrl,
  isSafeCssIdentifier,
  isSafeCssValue,
  safeUrl,
} from "../src/lib/sanitize";
import { buildJsonLd } from "../src/seo/jsonLd";
import type { UserConfigType } from "../src/types";

test("escapeJsonLd neutralises a closing script tag", () => {
  const payload = JSON.stringify({
    name: "</script><script>alert(1)</script>",
  });

  expect(escapeJsonLd(payload)).not.toContain("</script>");
  expect(escapeJsonLd(payload)).toContain("\\u003c");
});

test("escapeJsonLd keeps the JSON parseable and lossless", () => {
  const name = "Ada </script> & <b>Lovelace</b>";
  const parsed: unknown = JSON.parse(escapeJsonLd(JSON.stringify({ name })));

  expect(parsed).toEqual({ name });
});

test("buildJsonLd escapes hostile config before it reaches the page", () => {
  const config: UserConfigType = {
    fullName: "</script><script>alert(1)</script>",
    siteUrl: "https://example.com",
  };

  const raw = buildJsonLd(config);

  expect(raw).not.toContain("</script>");
  expect(JSON.parse(raw)["@graph"][1].name).toBe(config.fullName);
});

test("buildJsonLd drops javascript: links from sameAs", () => {
  const config: UserConfigType = {
    fullName: "Ada",
    siteUrl: "https://example.com",
    socialNetworks: [
      {
        url: "javascript:alert(1)",
        iconSrc: "i",
        title: "Bad",
        description: "d",
        group: "socialnetwork",
      },
      {
        url: "https://github.com/ada",
        iconSrc: "i",
        title: "GitHub",
        description: "d",
        group: "socialnetwork",
      },
    ],
  };

  expect(buildJsonLd(config)).not.toContain("javascript:");
});

test("safeUrl rejects script URLs, including obfuscated ones", () => {
  expect(safeUrl("javascript:alert(1)")).toBe("#");
  expect(safeUrl("  JaVaScRiPt:alert(1)")).toBe("#");
  expect(safeUrl("java\tscript:alert(1)")).toBe("#");
  expect(safeUrl("data:text/html,<script>alert(1)</script>")).toBe("#");
  expect(safeUrl("vbscript:msgbox(1)")).toBe("#");
});

test("safeUrl passes through the schemes a link page needs", () => {
  expect(safeUrl("https://example.com/ada")).toBe("https://example.com/ada");
  expect(safeUrl("http://example.com")).toBe("http://example.com");
  expect(safeUrl("mailto:ada@example.com")).toBe("mailto:ada@example.com");
  expect(safeUrl("tel:+33123456789")).toBe("tel:+33123456789");
  expect(safeUrl("#")).toBe("#");
  expect(safeUrl("/about")).toBe("/about");
});

test("safeUrl rejects protocol-relative URLs that only look like paths", () => {
  expect(safeUrl("//evil.example/phish")).toBe("#");
  expect(safeUrl("  //evil.example")).toBe("#");
  expect(safeUrl("/\\evil.example")).toBe("#");
  expect(safeUrl("\\\\evil.example")).toBe("#");
});

test("safeUrl degrades instead of throwing on a missing url", () => {
  const missing = ({} as { url?: string }).url as string | undefined;

  expect(safeUrl(missing)).toBe("#");
  expect(safeUrl("")).toBe("#");
  expect(safeUrl("   ")).toBe("#");
});

test("isPublicUrl accepts only absolute http(s) URLs", () => {
  expect(isPublicUrl("https://example.com")).toBe(true);
  expect(isPublicUrl("http://example.com")).toBe(true);
  expect(isPublicUrl("#")).toBe(false);
  expect(isPublicUrl("/about")).toBe(false);
  expect(isPublicUrl("mailto:ada@example.com")).toBe(false);
  expect(isPublicUrl("javascript:alert(1)")).toBe(false);
});

test("CSS guards reject values that would break out of the declaration", () => {
  expect(isSafeCssValue("oklch(1 0 0 / 0.08)")).toBe(true);
  expect(isSafeCssValue("1px solid #fff")).toBe(true);
  expect(isSafeCssValue("red; } body { display: none } .x {")).toBe(false);
  expect(isSafeCssValue("red } @import url(evil.css)")).toBe(false);
  expect(isSafeCssValue("")).toBe(false);
});

test("CSS guards reject custom property names that are not identifiers", () => {
  expect(isSafeCssIdentifier("lf-card-bg")).toBe(true);
  expect(isSafeCssIdentifier("color-primary")).toBe(true);
  expect(isSafeCssIdentifier("x: red; } body {")).toBe(false);
  expect(isSafeCssIdentifier("-evil")).toBe(false);
});
