import type { UserConfigType, SocialNetworkType } from "../types";
import { escapeJsonLd, isPublicUrl } from "../lib/sanitize";

const IDENTITY_GROUP = "socialnetwork";

/**
 * A link is publishable if it is visible and points at a real http(s) target
 * (not an in-page anchor, and not a `javascript:` URL from an unchecked config).
 */
function isPublishable(link: SocialNetworkType): boolean {
  return !link.hidden && typeof link.url === "string" && isPublicUrl(link.url);
}

/** Resolves a possibly-relative path against the site origin. Returns undefined when unresolvable. */
function absolute(value: unknown, siteUrl?: string): string | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  if (/^https?:\/\//.test(value)) return value;
  if (!siteUrl) return undefined;
  return `${siteUrl.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
}

/**
 * Builds a graph-local `@id`. With an origin, it's an absolute, dereferenceable
 * URL fragment. Without one, it falls back to the bare fragment ("#person")
 * instead of interpolating an empty origin (which would produce a meaningless
 * "/#person") — the fragment stays stable and the cross-references between
 * nodes below still resolve to each other, they just aren't resolvable to a
 * real page.
 */
function nodeId(origin: string, fragment: string): string {
  return origin ? `${origin}/${fragment}` : fragment;
}

export function buildJsonLd(config: UserConfigType, siteUrl?: string): string {
  // Same precedence as `buildMetadata`: an explicitly passed origin is the
  // deployment's, and outranks whatever origin the config was shipped with.
  const origin = (siteUrl ?? config.siteUrl ?? "").replace(/\/$/, "");
  const links = (config.socialNetworks ?? []).filter(isPublishable);

  const sameAs = links
    .filter((l) => (l.group ?? IDENTITY_GROUP) === IDENTITY_GROUP)
    .map((l) => l.url);
  const works = links.filter(
    (l) => (l.group ?? IDENTITY_GROUP) !== IDENTITY_GROUP,
  );
  const image = absolute(config.avatarSrc, origin);

  const personId = nodeId(origin, "#person");
  const projectsId = nodeId(origin, "#projects");

  const person = {
    "@type": "Person",
    "@id": personId,
    name: config.fullName,
    ...(config.alias && { alternateName: config.alias }),
    ...(origin && { url: origin }),
    ...(image && { image }),
    ...(config.jobTitle && { jobTitle: config.jobTitle }),
    ...(config.worksFor && {
      worksFor: { "@type": "Organization", name: config.worksFor },
    }),
    ...(config.metaDescription && { description: config.metaDescription }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(works.length > 0 && { subjectOf: { "@id": projectsId } }),
  };

  const graph: Record<string, unknown>[] = [
    {
      "@type": "ProfilePage",
      "@id": nodeId(origin, "#profilepage"),
      ...(origin && { url: origin }),
      mainEntity: { "@id": person["@id"] },
    },
    person,
  ];

  if (works.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": projectsId,
      itemListElement: works.map((l, i) => {
        const item: Record<string, unknown> = {
          "@type": "CreativeWork",
          position: i + 1,
          name: l.title,
          url: l.url,
        };

        if (l.description) item.description = l.description;

        return item;
      }),
    });
  }

  graph.push({
    "@type": "WebSite",
    "@id": nodeId(origin, "#website"),
    ...(origin && { url: origin }),
    ...(config.metaTitle && { name: config.metaTitle }),
    publisher: { "@id": person["@id"] },
  });

  // Escaped because the result is embedded verbatim in a <script> element.
  return escapeJsonLd(
    JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
  );
}
