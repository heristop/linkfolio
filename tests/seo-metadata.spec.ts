import { test, expect } from "@playwright/test";
import { buildMetadata } from "../src/seo/metadata";
import type { UserConfigType } from "../src/types";

const config: UserConfigType = {
  fullName: "Ada Lovelace",
  metaTitle: "Ada Lovelace — Engineer",
  metaDescription: "Builds things",
  siteUrl: "https://example.com",
  keywords: ["ada", "engineer"],
};

test("sets canonical and metadataBase from siteUrl", () => {
  const m = buildMetadata(config);
  expect(m.alternates?.canonical).toBe("/");
  expect(m.metadataBase?.toString()).toBe("https://example.com/");
});

test("openGraph carries url, siteName and type", () => {
  const og = buildMetadata(config).openGraph as Record<string, unknown>;
  expect(og.url).toBe("https://example.com");
  expect(og.type).toBe("website");
  expect(og.siteName).toBe("Ada Lovelace");
});

test("defaults locale to en_US and allows override", () => {
  expect((buildMetadata(config).openGraph as { locale?: string }).locale).toBe(
    "en_US",
  );
  expect(
    (
      buildMetadata({ ...config, locale: "fr_FR" }).openGraph as {
        locale?: string;
      }
    ).locale,
  ).toBe("fr_FR");
});

test("sets robots index and follow", () => {
  const robots = buildMetadata(config).robots as {
    index?: boolean;
    follow?: boolean;
  };
  expect(robots.index).toBe(true);
  expect(robots.follow).toBe(true);
});

test("twitter card is summary_large_image", () => {
  expect((buildMetadata(config).twitter as { card?: string }).card).toBe(
    "summary_large_image",
  );
});

test("passes keywords through", () => {
  expect(buildMetadata(config).keywords).toEqual(["ada", "engineer"]);
});

test("options.siteUrl applies when config.siteUrl is absent", () => {
  const m = buildMetadata(
    { fullName: "Ada" },
    { siteUrl: "https://fallback.dev" },
  );
  expect(m.metadataBase?.toString()).toBe("https://fallback.dev/");
  expect((m.openGraph as { url?: string }).url).toBe("https://fallback.dev");
});

// A fork sets NEXT_APP_URL for its own domain but leaves the template's
// `siteUrl` in place; if the config won, every page would canonicalise onto
// the template's demo domain.
test("options.siteUrl outranks a siteUrl carried over in the config", () => {
  const m = buildMetadata(
    { fullName: "Ada", siteUrl: "https://template-demo.example" },
    { siteUrl: "https://alice.dev" },
  );
  expect(m.metadataBase?.toString()).toBe("https://alice.dev/");
  expect((m.openGraph as { url?: string }).url).toBe("https://alice.dev");
});

test("a siteUrl with no scheme is dropped rather than thrown on", () => {
  expect(() =>
    buildMetadata({ fullName: "Ada", siteUrl: "example.com" }),
  ).not.toThrow();
  expect(
    buildMetadata({ fullName: "Ada", siteUrl: "example.com" }).metadataBase,
  ).toBeUndefined();
});

test("does not throw and omits metadataBase/openGraph.url when no siteUrl is available at all", () => {
  expect(() => buildMetadata({ fullName: "Ada" })).not.toThrow();
  const m = buildMetadata({ fullName: "Ada" });
  expect(m.metadataBase).toBeUndefined();
  expect((m.openGraph as { url?: string }).url).toBeUndefined();
});

test("omits keywords when none are configured", () => {
  expect(
    buildMetadata({ fullName: "Ada" }, { siteUrl: "https://x.dev" }).keywords,
  ).toBeUndefined();
});

test("title falls back from metaTitle to fullName to 'Linkfolio'", () => {
  expect(buildMetadata(config).title).toBe("Ada Lovelace — Engineer");
  expect(buildMetadata({ fullName: "Ada" }).title).toBe("Ada");
  expect(buildMetadata({}).title).toBe("Linkfolio");
});

test("the resolved title also names the OG card, twitter card and web app", () => {
  const m = buildMetadata({ fullName: "Ada" });

  expect((m.openGraph as { title?: string }).title).toBe("Ada");
  expect((m.twitter as { title?: string }).title).toBe("Ada");
  expect((m.appleWebApp as { title?: string }).title).toBe("Ada");
});

test("omits description everywhere when none is configured", () => {
  const m = buildMetadata({ fullName: "Ada" });

  expect(m.description).toBeUndefined();
  expect((m.openGraph as { description?: string }).description).toBeUndefined();
  expect((m.twitter as { description?: string }).description).toBeUndefined();
});

test("omits openGraph.siteName when no fullName is configured", () => {
  const og = buildMetadata({ metaTitle: "T" }).openGraph as {
    siteName?: string;
  };

  expect(og.siteName).toBeUndefined();
});

test("a trailing slash on siteUrl is stripped from the OG url", () => {
  const m = buildMetadata({ ...config, siteUrl: "https://example.com/" });

  expect((m.openGraph as { url?: string }).url).toBe("https://example.com");
  expect(m.metadataBase?.toString()).toBe("https://example.com/");
});

test("themeColor surfaces as the msapplication tile color, and only then", () => {
  const withColor = buildMetadata({ ...config, themeColor: "#123456" });

  expect(withColor.other).toEqual({ "msapplication-TileColor": "#123456" });
  expect(buildMetadata(config).other).toBeUndefined();
});
