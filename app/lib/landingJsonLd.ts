import { escapeJsonLd } from "@/lib/sanitize";
import { version } from "../../package.json";

const REPO_URL = "https://github.com/heristop/linkfolio";
const PACKAGE_URL = "https://www.npmjs.com/package/linkfolio";

/**
 * The two URLs that corroborate this site's identity.
 *
 * Several unrelated commercial products share the name "Linkfolio", so a
 * search engine reading this page cannot infer which entity it describes.
 * `sameAs` is the structured claim that binds site, repository and package
 * into one — the same corroboration pattern `off-page-seo-checklist.md`
 * applies to the author, applied here to the project.
 */
const SAME_AS = [REPO_URL, PACKAGE_URL];

/**
 * Capabilities, not marketing copy: `featureList` is read by answer engines
 * summarising what the software does, so each entry states one capability
 * plainly enough to be quoted on its own.
 */
const FEATURE_LIST = [
  "Self-hosted on your own domain and infrastructure",
  "No account, subscription or usage limit",
  "Two layouts: a classic list and a bento mosaic",
  "Five theme presets with a genuine dark mode",
  "Accessible by default (keyboard, screen reader, reduced motion)",
  "Pluggable analytics, or none at all",
  "Open source under the MIT licence",
];

/**
 * Structured data for the marketing landing page at `/`.
 *
 * Deliberately app-local rather than in `src/`: this describes the site, not
 * the package. It emits `SoftwareApplication` + `WebSite`, plus one `Person`
 * for the project's author — never a `ProfilePage`, and never a `Person`
 * standing in for the demo profile. The demo profile is a fixture whose links
 * all point at `#1`..`#17`, so claiming it as an entity would be a claim about
 * someone who does not exist; `/demo` publishes no graph at all for that
 * reason. The author below is a real person, which is what makes it safe to
 * assert here.
 */
export function buildLandingJsonLd(siteUrl: string): string {
  const origin = siteUrl.replace(/\/$/, "");

  // The one real person in this graph: the project's author. Unlike a Person
  // describing the demo profile, this entity is a true claim, and it gives the
  // software and the site an author and publisher to hang authority on
  // instead of standing unattributed.
  const authorId = `${origin}/#author`;

  return escapeJsonLd(
    JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": `${origin}/#software`,
          name: "Linkfolio",
          description:
            "Open-source, self-hosted link-in-bio page built with Next.js and Tailwind CSS.",
          applicationCategory: "WebApplication",
          operatingSystem: "Any",
          license: "https://opensource.org/licenses/MIT",
          codeRepository: "https://github.com/heristop/linkfolio",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@id": authorId },
          sameAs: SAME_AS,
          softwareVersion: version,
          applicationSubCategory: "Link in bio page",
          isAccessibleForFree: true,
          installUrl: PACKAGE_URL,
          downloadUrl: PACKAGE_URL,
          screenshot: `${origin}/opengraph-image`,
          featureList: FEATURE_LIST,
        },
        {
          "@type": "Person",
          "@id": authorId,
          name: "Alexandre Mogère",
          alternateName: "heristop",
          url: "https://heristop.github.io/about/",
          sameAs: ["https://github.com/heristop"],
        },
        {
          "@type": "WebSite",
          "@id": `${origin}/#website`,
          url: origin,
          name: "Linkfolio",
          publisher: { "@id": authorId },
          sameAs: SAME_AS,
        },
      ],
    }),
  );
}
