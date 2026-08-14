import { test, expect } from "@playwright/test";
import { buildJsonLd } from "../src/seo/jsonLd";
import type { UserConfigType } from "../src/types";

const config: UserConfigType = {
  fullName: "Ada Lovelace",
  alias: "@ada",
  avatarSrc: "/assets/avatar.webp",
  jobTitle: "Engineer",
  metaDescription: "Builds things",
  siteUrl: "https://example.com",
  socialNetworks: [
    {
      url: "https://github.com/ada",
      iconSrc: "i",
      title: "GitHub",
      description: "d",
      group: "socialnetwork",
    },
    {
      url: "https://ada.dev",
      iconSrc: "i",
      title: "Site",
      description: "d",
      group: "website",
    },
    {
      url: "https://proj.app",
      iconSrc: "i",
      title: "Proj",
      description: "d",
      group: "project",
    },
    {
      url: "https://hidden.example",
      iconSrc: "i",
      title: "Hidden",
      description: "d",
      group: "socialnetwork",
      hidden: true,
    },
  ],
};

function graphOf(raw: string) {
  const parsed = JSON.parse(raw);
  const byType = (t: string) =>
    parsed["@graph"].find((n: { "@type": string }) => n["@type"] === t);
  return {
    parsed,
    person: byType("Person"),
    list: byType("ItemList"),
    site: byType("WebSite"),
    profile: byType("ProfilePage"),
  };
}

test("sameAs carries only socialnetwork-group profiles", () => {
  const { person } = graphOf(buildJsonLd(config, "https://example.com"));
  expect(person.sameAs).toEqual(["https://github.com/ada"]);
});

test("website and project links go to an ItemList, not sameAs", () => {
  const { list } = graphOf(buildJsonLd(config, "https://example.com"));
  const urls = list.itemListElement.map((i: { url: string }) => i.url);
  expect(urls).toEqual(["https://ada.dev", "https://proj.app"]);
});

test("hidden links are excluded entirely", () => {
  const raw = buildJsonLd(config, "https://example.com");
  expect(raw).not.toContain("hidden.example");
});

test("a hidden website/project link is excluded from the ItemList too", () => {
  const demo: UserConfigType = {
    fullName: "Demo",
    siteUrl: "https://example.com",
    socialNetworks: [
      {
        url: "https://ada.dev",
        iconSrc: "i",
        title: "Site",
        description: "d",
        group: "website",
      },
      {
        url: "https://hidden-project.example",
        iconSrc: "i",
        title: "Hidden Project",
        description: "d",
        group: "project",
        hidden: true,
      },
    ],
  };
  const raw = buildJsonLd(demo, "https://example.com");
  const { list } = graphOf(raw);
  const urls = list.itemListElement.map((i: { url: string }) => i.url);
  expect(urls).toEqual(["https://ada.dev"]);
  expect(raw).not.toContain("hidden-project.example");
});

test("relative avatar path is resolved to an absolute URL", () => {
  const { person } = graphOf(buildJsonLd(config, "https://example.com"));
  expect(person.image).toBe("https://example.com/assets/avatar.webp");
});

test("absolute avatar URLs are left untouched", () => {
  const { person } = graphOf(
    buildJsonLd(
      { ...config, avatarSrc: "https://cdn.example/a.png" },
      "https://example.com",
    ),
  );
  expect(person.image).toBe("https://cdn.example/a.png");
});

test("emits a graph with the four expected nodes", () => {
  const { parsed, profile, person, site } = graphOf(
    buildJsonLd(config, "https://example.com"),
  );
  expect(parsed["@graph"]).toHaveLength(4);
  expect(profile.mainEntity["@id"]).toBe(person["@id"]);
  expect(site.publisher["@id"]).toBe(person["@id"]);
});

test("omits empty values rather than emitting blanks", () => {
  const raw = buildJsonLd({ fullName: "Ada" }, "https://example.com");
  const { person, list } = graphOf(raw);
  expect(person.sameAs).toBeUndefined();
  expect(person.jobTitle).toBeUndefined();
  expect(list).toBeUndefined();
});

test("anchor-only placeholder URLs never reach sameAs", () => {
  const demo: UserConfigType = {
    fullName: "Demo",
    socialNetworks: [
      {
        url: "#1",
        iconSrc: "i",
        title: "X",
        description: "d",
        group: "socialnetwork",
      },
    ],
  };
  const { person } = graphOf(buildJsonLd(demo, "https://example.com"));
  expect(person.sameAs).toBeUndefined();
});

test("omits url on ProfilePage and WebSite when no origin is resolvable", () => {
  const { profile, site } = graphOf(buildJsonLd({ fullName: "Ada" }));
  expect(profile.url).toBeUndefined();
  expect(site.url).toBeUndefined();
});

test("structured data lists only dereferenceable http(s) URLs, unlike rendered links", () => {
  const demo: UserConfigType = {
    fullName: "Demo",
    siteUrl: "https://example.com",
    socialNetworks: [
      {
        url: "mailto:ada@example.com",
        iconSrc: "i",
        title: "Email",
        description: "d",
        group: "socialnetwork",
      },
      {
        url: "tel:+15551234567",
        iconSrc: "i",
        title: "Phone",
        description: "d",
        group: "socialnetwork",
      },
      {
        url: "/blog",
        iconSrc: "i",
        title: "Blog",
        description: "d",
        group: "website",
      },
    ],
  };
  const { person, list } = graphOf(buildJsonLd(demo, "https://example.com"));
  expect(person.sameAs).toBeUndefined();
  expect(list).toBeUndefined();
});

test("@id is an absolute, dereferenceable URL when an origin is set", () => {
  const { person } = graphOf(buildJsonLd(config, "https://example.com"));
  expect(person["@id"]).toBe("https://example.com/#person");
});

test("no-origin path produces a coherent graph with no dangling cross-references", () => {
  const demo: UserConfigType = {
    fullName: "Ada",
    socialNetworks: [
      {
        url: "https://ada.dev",
        iconSrc: "i",
        title: "Site",
        description: "d",
        group: "website",
      },
    ],
  };
  const { parsed, profile, person, list, site } = graphOf(buildJsonLd(demo));

  // No origin to interpolate, so @id falls back to the bare fragment rather
  // than a meaningless "/#person" — but every cross-reference must still
  // resolve to a node that actually exists in the graph.
  expect(person["@id"]).toBe("#person");
  expect(profile["@id"]).toBe("#profilepage");
  expect(list["@id"]).toBe("#projects");
  expect(site["@id"]).toBe("#website");

  const ids = new Set(
    parsed["@graph"].map((node: { "@id": string }) => node["@id"]),
  );

  expect(profile.mainEntity["@id"]).toBe(person["@id"]);
  expect(ids.has(profile.mainEntity["@id"])).toBe(true);

  expect(person.subjectOf["@id"]).toBe(list["@id"]);
  expect(ids.has(person.subjectOf["@id"])).toBe(true);

  expect(site.publisher["@id"]).toBe(person["@id"]);
  expect(ids.has(site.publisher["@id"])).toBe(true);
});

test("trailing-slash siteUrl normalises identically to no-slash", () => {
  const trailing = { ...config, siteUrl: "https://example.com/" };
  const bare = { ...config, siteUrl: "https://example.com" };

  expect(buildJsonLd(trailing)).toBe(buildJsonLd(bare));

  const { person } = graphOf(buildJsonLd(trailing));
  expect(person["@id"]).toBe("https://example.com/#person");
});

test("escapes </script> so a malicious value cannot break out of the JSON-LD sink", () => {
  const payload = "</script><img src=x onerror=alert(1)>";
  const raw = buildJsonLd(
    { fullName: "Ada", metaDescription: payload },
    "https://example.com",
  );
  expect(raw).not.toContain("</script>");
  const { person } = graphOf(raw);
  expect(person.description).toBe(payload);
});
