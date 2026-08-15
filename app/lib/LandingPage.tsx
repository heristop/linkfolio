import Link from "next/link";
import { LinkFolio } from "@/index";
import userConfig from "~/user.config";
import { buildLandingJsonLd } from "./landingJsonLd";
import ComparisonTable from "./ComparisonTable";
import CodeBlock from "./CodeBlock";
import { appUrl } from "./siteMeta";

export const PAGE_TITLE =
  "Linkfolio — Open-source, self-hosted link-in-bio page";
// Kept under ~160 characters: past that Google truncates the snippet mid-word
// in results, and the tail of this one carried the differentiator.
export const PAGE_DESCRIPTION =
  "A free, open-source Linktree alternative built with Next.js and Tailwind CSS. Self-host your link-in-bio page on your own domain — no account, no subscription.";

// Escaped because the result is embedded verbatim in a <script> element —
// matches how src/seo/jsonLd.ts hardens its own JSON-LD sink.
const jsonLd = buildLandingJsonLd(appUrl);

const INSTALL_TABS = [
  { label: "npm", code: "npm install linkfolio" },
  { label: "pnpm", code: "pnpm add linkfolio" },
  { label: "yarn", code: "yarn add linkfolio" },
];

const DEPLOY_URL =
  "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheristop%2Flinkfolio&env=NEXT_APP_URL&envDescription=Your%20site%27s%20public%20URL&install-command=npm%20install%20%20--legacy-peer-deps";
const GITHUB_URL = "https://github.com/heristop/linkfolio";
const AUTHOR_URL = "https://heristop.github.io/about/";

// The hero card is a compact preview, not the full link list — a ~2000px
// card (17 links, including large banner tiles) would push the headline
// far down the page when the hero section vertically centres its columns.
// Keep only a small, representative set of social-network links.
const heroConfig = {
  ...userConfig,
  socialNetworks: (userConfig.socialNetworks ?? [])
    .filter(
      (n) => (n.group ?? "socialnetwork") === "socialnetwork" && !n.hidden,
    )
    .slice(0, 6),
};

// Every row below comes verbatim from README.md's "Why self-host instead of
// using Linktree?" table — already independently verified against the code.
const COMPARISON: { label: string; linkfolio: string; hosted: string }[] = [
  {
    label: "Cost",
    linkfolio: "Free, MIT licensed",
    hosted: "Free tier with paid upgrades",
  },
  {
    label: "Hosting",
    linkfolio: "Your own domain and infrastructure",
    hosted: "Their domain, their infrastructure",
  },
  {
    label: "Customisation",
    linkfolio: "Full source access; inject your own React components",
    hosted: "Limited to the options exposed",
  },
  {
    label: "Data",
    linkfolio: "No third-party analytics unless you add them",
    hosted: "Visitor data flows through their platform",
  },
  {
    label: "Performance",
    linkfolio: "Static Next.js page you control",
    hosted: "Depends on their platform",
  },
];

const FEATURES = [
  {
    title: "Built on Next.js",
    description:
      "App Router and React 19, deployed as a static page by default.",
  },
  {
    title: "Styled with Tailwind CSS",
    description:
      "Every colour and spacing token is a CSS variable — retheme without a rebuild.",
  },
  {
    title: "Customisable components",
    description:
      "Swap the profile, links or footer for your own React components.",
  },
  {
    title: "Accessible",
    description:
      "Semantic headings, visible focus rings, reduced-motion support, keyboard navigation.",
  },
  {
    title: "SEO-ready",
    description:
      "Structured data, a sitemap and generated Open Graph images out of the box.",
  },
];

// The hero card's social icons are fixed from here, not from src/, because
// src/components/{SocialLinks,SocialNetwork}.tsx and globals.css are the
// published package consumed by other projects — changing their layout or
// `object-cover` there would change every consumer's rendering. Instead we
// scope Tailwind arbitrary descendant overrides to this one card via
// LinkFolio's `className` prop.
//
// Three defects, three targeted overrides:
//  1. Orphan wrap — six `.network` tiles at `width: 16%` (globals.css) wrap
//     5-then-1 once cumulative gaps exceed the row. We give `.network` a
//     fixed width and cap `.lf-links`' own max-width so exactly 3 fit per
//     row and a 4th is mathematically forced to wrap — a balanced 3x2 for
//     six tiles, with no stranded single tile.
//  2. Cropped logos — `.lf-icon-container` is `h-24` (96px) inside a ~60px
//     wide column with `object-cover`: portrait crop, so wide wordmarks
//     (Facebook, LinkedIn) lose their sides. The source art is a ~16:9 wide
//     banner (900x506 for x/github/linkedin/instagram/snapchat, 900x540 for
//     facebook — a slightly wider ~5:3), so we match the container's aspect
//     ratio to the art with `aspect-video` (16/9) instead of guessing a
//     square, and keep `object-cover` so the banner fills the tile
//     edge-to-edge with no letterboxing. Facebook's 5:3 art loses ~6% off
//     its sides under `object-cover` at 16:9 — checked in the verification
//     screenshots and the wordmark stays fully readable.
//  3. Too small — six tiles competing for row width shrink the whole
//     preview. Fixed, larger tile sizes (with a matching sm+ bump) make it
//     read clearly at 1024–1500px without breaking narrower widths.
//
// `[data-group=socialnetwork]` is repeated in each selector that fights a
// package rule of the same shape (e.g. `[data-group="socialnetwork"]
// .network { width: 16% }`) so our override selector has one more compound
// than theirs and wins on specificity — no `!important` needed for those.
// Sizes were tuned against the built page at 375/768/1024/1440 (see the
// verification report).
const HERO_ICON_OVERRIDE_CLASS = [
  // Cap the row's own width so a 4th tile can never fit alongside 3.
  "[&_.lf-links]:max-w-[16rem]",
  "sm:[&_.lf-links]:max-w-[22rem]",
  // Comfortable, larger gaps now that tiles are bigger.
  "[&_.lf-group]:gap-x-3 [&_.lf-group]:gap-y-5",
  "sm:[&_.lf-group]:gap-x-4 sm:[&_.lf-group]:gap-y-6",
  // Fixed tile width drives the wrap point (beats the package's 16%/28%
  // width-percentage rules by selector specificity).
  "[&_[data-group=socialnetwork]_.network]:w-[4.75rem]",
  "sm:[&_[data-group=socialnetwork]_.network]:w-[5.75rem]",
  // 16:9 icon container matching the source banners (beats the package's
  // fixed `h-24`/`h-3rem` rules). Height is `h-auto` so `aspect-video`
  // derives it from the fixed width — no empty band above/below the art.
  "[&_[data-group=socialnetwork]_.lf-icon-container]:h-auto",
  "[&_[data-group=socialnetwork]_.lf-icon-container]:w-14",
  "[&_[data-group=socialnetwork]_.lf-icon-container]:aspect-video",
  "sm:[&_[data-group=socialnetwork]_.lf-icon-container]:w-[4.5rem]",
  // Full-bleed banner: no crop-free empty space, so no padding here.
  "[&_.lf-icon-container_img]:object-cover",
  // A touch larger label now that there's room for it.
  "sm:[&_[data-group=socialnetwork]_.lf-title]:text-sm",
].join(" ");

// Tracking and leading are size-specific, not one value for the whole page:
// letters read too far apart as type grows, so headings tighten on both while
// body copy below stays near 0 with generous leading.
const HEADING_CLASS =
  "mb-[clamp(0.75rem,0.6rem_+_0.5vw,1.125rem)] text-[length:clamp(1.25rem,1.1rem_+_0.7vw,1.625rem)] leading-[1.2] font-semibold tracking-[-0.01em]";
const BODY_CLASS =
  "text-[length:clamp(1rem,0.95rem_+_0.2vw,1.0625rem)] leading-[1.7]";
const SECTION_CLASS = "mt-[clamp(2.5rem,2rem_+_2vw,4rem)]";
const CTA_PRIMARY_CLASS =
  // hover:text-… restates the resting colour: the global `a:hover` rule in
  // globals.css outranks a plain text utility and repainted this label in the
  // same hue as its own background.
  // Motion lives in the .lf-cta class so every pressable surface on the site
  // shares one contract; only layout and colour stay as utilities here.
  "lf-cta inline-flex min-h-11 items-center rounded-md bg-primary px-6 text-background-start hover:text-background-start";
const CTA_SECONDARY_CLASS =
  "lf-cta-ghost inline-flex min-h-11 items-center rounded-md border border-primary/20 px-6 underline-offset-2 hover:underline";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      className="mt-1 shrink-0 text-secondary"
    >
      <path
        fill="currentColor"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L9 11.6l6.3-6.3a1 1 0 0 1 1.4 0Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="18"
      height="18"
      className="shrink-0"
    >
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-(--lf-card-bg) focus:px-4 focus:text-primary focus:shadow-(--lf-card-shadow)"
      >
        Skip to main content
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <main
        id="main"
        className="mx-auto max-w-[1200px] px-[clamp(1rem,3vw,3rem)] py-[clamp(2rem,1.5rem_+_2vw,4rem)] text-primary"
      >
        <section className="grid items-start gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-2">
          <div>
            <h1
              className="fade-in text-balance text-[length:clamp(2.25rem,1.7rem_+_2.4vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.022em]"
              style={{ animationDelay: "0.05s" }}
            >
              A self-hosted link-in-bio page you actually own
            </h1>
            <div
              className="reveal-line mt-4 mb-6 h-0.5 w-(--lf-accent-line-width) origin-left bg-(--lf-accent-line-color) opacity-(--lf-accent-line-opacity)"
              style={{ animationDelay: "0.15s" }}
              role="presentation"
            />
            <p
              className={`fade-in mb-8 max-w-prose ${BODY_CLASS}`}
              style={{ animationDelay: "0.2s" }}
            >
              Linkfolio is a free, open-source Linktree alternative built with
              Next.js and Tailwind CSS. Deploy it on your own domain, edit one
              config file, and keep full control of your links — no account, no
              subscription, no third party in between.
            </p>
            <div
              className="fade-in flex flex-wrap gap-4"
              style={{ animationDelay: "0.3s" }}
            >
              {/* Seeing the thing precedes deploying it: the hero sends a
                  first-time visitor to the demo, and "Get started" lower down
                  carries the Vercel deploy for someone already convinced. */}
              <Link href="/demo" className={CTA_PRIMARY_CLASS}>
                See the live demo
              </Link>
              <Link href="/docs" className={CTA_SECONDARY_CLASS}>
                Read the documentation
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 underline-offset-2 hover:underline"
              >
                <GitHubIcon />
                View source on GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <section
            aria-label="Live preview of a Linkfolio page"
            className="fade-in"
            style={{ animationDelay: "0.35s" }}
          >
            <LinkFolio
              userConfig={heroConfig}
              renderJsonLd={false}
              headingLevel="h2"
              // The package's own "Made by heristop" footer reads as clutter
              // inside a marketing hero and duplicates the byline the
              // landing page renders itself, below — see <footer> at the
              // bottom of this component.
              FooterComponent={() => null}
              className={HERO_ICON_OVERRIDE_CLASS}
            />
          </section>
        </section>

        <section className={SECTION_CLASS} aria-labelledby="why-self-host">
          <h2 id="why-self-host" className={HEADING_CLASS}>
            Why self-host instead of using Linktree?
          </h2>
          <ComparisonTable rows={COMPARISON} />
        </section>

        <section className={SECTION_CLASS} aria-labelledby="features">
          <h2 id="features" className={HEADING_CLASS}>
            Everything you need, nothing you don&apos;t
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex gap-3">
                <CheckIcon />
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className={`text-(--lf-description-color) ${BODY_CLASS}`}>
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={SECTION_CLASS} aria-labelledby="get-started">
          <h2 id="get-started" className={HEADING_CLASS}>
            Get started
          </h2>
          <p className={`mb-4 ${BODY_CLASS}`}>
            Deploy the template to Vercel in one click, or install the package
            into an existing Next.js project:
          </p>
          <CodeBlock
            tabs={INSTALL_TABS}
            label="Package manager"
            className="mb-6"
          />
          {/* One primary action, two subordinate ones — but all three share the
              button shape used in the hero, rather than the secondaries being
              bare underlined text with no target of their own. */}
          <div className="flex flex-wrap items-center gap-3">
            <a href={DEPLOY_URL} className={CTA_PRIMARY_CLASS}>
              Deploy to Vercel
            </a>
            <Link href="/docs" className={CTA_SECONDARY_CLASS}>
              Read the documentation
            </Link>
            <Link href="/demo" className={CTA_SECONDARY_CLASS}>
              See the live demo
            </Link>
          </div>
        </section>
      </main>

      <footer
        className={`mx-auto max-w-[1200px] px-[clamp(1rem,3vw,3rem)] pb-[clamp(2rem,1.5rem_+_2vw,4rem)] text-primary`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-primary/10 pt-6 text-sm text-(--lf-description-color)">
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center underline-offset-2 hover:underline"
          >
            Made by heristop
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 underline-offset-2 hover:underline"
          >
            <GitHubIcon />
            heristop/linkfolio on GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </>
  );
}
