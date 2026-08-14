import { escapeJsonLd } from "@/lib/sanitize";

/**
 * Structured data for the marketing landing page at `/`.
 *
 * Deliberately app-local rather than in `src/`: this describes the site,
 * not the package. It emits `SoftwareApplication` + `WebSite` only — no
 * `Person`, no `ProfilePage`. Those entities are only honest on `/demo`,
 * which genuinely is a demo of a person's link hub; `/` is marketing copy
 * about the open-source project, and a `Person` node here would be a
 * fabricated entity claim.
 */
export function buildLandingJsonLd(siteUrl: string): string {
  const origin = siteUrl.replace(/\/$/, "");

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
        },
        {
          "@type": "WebSite",
          "@id": `${origin}/#website`,
          url: origin,
          name: "Linkfolio",
        },
      ],
    }),
  );
}
