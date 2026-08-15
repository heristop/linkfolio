import { appUrl, isShowcase } from "../lib/siteMeta";

/* GET route handlers stopped being cached by default in recent Next.js;
   this document is build-time constant, so prerender it. */
export const dynamic = "force-static";

/**
 * Project documentation for LLM crawlers. It describes Linkfolio the project
 * — features, install, links to /demo and /docs — so it only exists on the
 * showcase deployment. A personal deployment answers 404; whoever wants an
 * llms.txt about themselves can add their own.
 *
 * A route handler rather than a public/ file so the Links section can name
 * this deployment's real origin instead of a hardcoded one.
 */
const body = `# Linkfolio

> A minimalist, open-source landing page that connects your audience to all of your online presences. Built with Next.js and Tailwind CSS.

Linkfolio is a customizable link-in-bio page (similar to Linktree) that can be deployed as a standalone template or integrated as a package into an existing Next.js project. It is designed for performance, accessibility, and SEO.

## Key Features

- Built with Next.js (App Router) and Tailwind CSS v4
- Fully responsive design for all devices
- Customizable components (profile, social links, footer)
- Typewriter effect on alias text (optional)
- Animated card entrance with intersection observer
- Accessible (WCAG AA): keyboard navigation, screen reader support, reduced motion support
- SEO: Open Graph, Twitter Cards, schema.org @graph structured data (ProfilePage, Person, ItemList, WebSite), canonical URLs, dynamic sitemap
- Deployable to Vercel with one click
- Public configuration API at /api/config

## Getting Started

Clone the template and deploy directly to Vercel, or fork the repository.

## Usage

\`\`\`jsx
import { LinkFolio } from "@/index";

const userConfig = {
  avatarSrc: "/assets/avatar.webp",
  avatarAlt: "Avatar",
  fullName: "Your Name",
  alias: "@your_alias",
  metaTitle: "My Links",
  metaDescription: "All my online links in one place",
  socialNetworks: [
    {
      url: "https://github.com/username",
      iconSrc: githubIcon,
      title: "GitHub",
      description: "Open-source contributions",
    },
  ],
};

function MyPage() {
  return <LinkFolio userConfig={userConfig} />;
}
\`\`\`

## Configuration Options

- \`avatarSrc\`: Path or import for profile image
- \`avatarAlt\`: Alt text for profile image
- \`fullName\`: Display name
- \`alias\`: Username or tagline
- \`metaTitle\`: Page title for SEO
- \`metaDescription\`: Page description for SEO
- \`themeColor\`: Theme color for browser chrome
- \`enableTypingAlias\`: Enable typewriter animation on alias (boolean)
- \`socialNetworks\`: Array of social link objects with url, iconSrc, title, description, hidden, and group fields
- \`siteUrl\`: Canonical origin. Anchors \`metadataBase\`, the canonical URL, \`og:url\`, and every structured-data \`@id\` (Person, ProfilePage, ItemList, WebSite). Omitting it degrades the entity graph — image and url fields are dropped and \`@id\`s fall back to bare fragments instead of resolvable URLs.
- \`jobTitle\`: Person job title in structured data
- \`worksFor\`: Person employer name in structured data
- \`lang\`: HTML lang attribute (default "en")
- \`locale\`: Open Graph locale (default "en_US")
- \`keywords\`: Array of meta keywords

## Customization

Custom components can be injected via props: \`UserProfileComponent\`, \`BeforeSocialLinksComponent\`, \`SocialLinksComponent\`, \`AfterSocialLinksComponent\`, \`FooterComponent\`.

\`LinkFolio\` also accepts behavioural props for embedding it inside a page that already has its own document structure:

- \`renderJsonLd\` (boolean, default true): renders the component's own \`ProfilePage\` + \`Person\` JSON-LD. Set false to avoid a duplicate \`Person\` entity when the host page already publishes structured data.
- \`renderChrome\` (boolean, default true): renders the QrCodeButton/ShareButton/ThemeToggle row. Set false when the host page has its own theme toggle.
- \`headingLevel\` ("h1" | "h2", default "h1"): heading level for the full name. Set "h2" when the host page already has its own \`<h1>\`.

Theme colors are customizable via CSS variables in globals.css:

- \`--color-primary\`
- \`--color-secondary\`
- \`--color-background-start\`
- \`--color-background-end\`

Full theming (colors and motion tokens) can also be set programmatically via the \`theme\` and \`darkTheme\` config keys, each a \`ThemeColors\` object of the same CSS custom properties.

## SEO helpers (\`linkfolio/seo\`)

\`buildMetadata(config, options?)\` and \`buildJsonLd(config, siteUrl?)\` build the same Next.js \`Metadata\` object and JSON-LD graph that \`<LinkFolio />\` generates internally. Import them from the \`linkfolio/seo\` subpath, not from \`linkfolio\`: the root \`linkfolio\` entry is a \`"use client"\` module, so importing these from \`linkfolio\` and calling them in a server component (e.g. \`generateMetadata\`) throws. \`linkfolio/seo\` has no client-side dependencies.

\`\`\`javascript
import { buildMetadata, buildJsonLd } from "linkfolio/seo";
\`\`\`

## Links

- Source code: https://github.com/heristop/linkfolio
- Landing page: ${appUrl}
- Demo: ${appUrl}/demo
- Documentation: ${appUrl}/docs
- Example implementation: https://github.com/heristop/my-linkfolio
- License: MIT
`;

export function GET(): Response {
  if (!isShowcase) {
    return new Response(null, { status: 404 });
  }

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
