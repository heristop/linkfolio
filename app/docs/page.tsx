import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { escapeJsonLd } from "@/lib/sanitize";
import BackLink from "../lib/BackLink";
import CodeBlock from "../lib/CodeBlock";
import { appUrl, isShowcase, pageMetadata } from "../lib/siteMeta";
import OnThisPage from "./OnThisPage";

const PAGE_TITLE =
  "Documentation — Linkfolio, the open-source Linktree alternative";
const PAGE_DESCRIPTION =
  "How to deploy Linkfolio, a self-hosted link-in-bio page built with Next.js and Tailwind CSS. Deploy to Vercel or install the package into an existing project.";

/**
 * Gated like the page itself: in profile mode this route is a 404. Declared
 * noindex rather than left empty because metadata is inherited — an empty
 * object would let the root layout's `index, follow` and canonical "/" apply
 * to a page that no longer exists (same pattern as app/not-found.tsx).
 */
export const metadata: Metadata = isShowcase
  ? pageMetadata({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: "/docs",
    })
  : { robots: { index: false, follow: false }, alternates: {} };

const FAQ = [
  {
    q: "Is Linkfolio free?",
    a: "Yes. Linkfolio is open source under the MIT licence. You host it yourself, so there is no subscription and no usage limit.",
  },
  {
    q: "How is it different from Linktree?",
    a: "Linkfolio runs on your own domain and infrastructure. You have full access to the source, can inject your own React components, and no third party sits between you and your visitors.",
  },
  {
    q: "Do I need to know Next.js to use it?",
    a: "No. You can deploy the template to Vercel in one click and personalise it by editing a single configuration file. Knowing Next.js helps if you want to customise components.",
  },
  {
    q: "Can I add it to an existing Next.js project?",
    a: "Yes. Install the linkfolio package and render the LinkFolio component with your own config object.",
  },
  {
    q: "Can I use Google Analytics with Linkfolio?",
    a: 'Yes, and it is not the only option. Set analytics: { provider: "ga", id: "G-…" } in your config and Linkfolio loads the tag and reports which link each visitor clicked. Google Tag Manager, Plausible, Umami and Beam ship as built-in providers too, you can register your own, and every link card emits a linkfolio:analytics DOM event you can listen to without configuring any provider at all.',
  },
];

// Escaped because the result is embedded verbatim in a <script> element —
// matches how src/seo/jsonLd.ts hardens its own JSON-LD sink.
const faqJsonLd = escapeJsonLd(
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${appUrl}/docs#faq`,
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }),
);

const SECTIONS = [
  { id: "deploy", label: "Deploy the template" },
  { id: "integrate", label: "Add to an existing project" },
  { id: "analytics", label: "Analytics" },
  { id: "faq", label: "FAQ" },
];

const INSTALL_TABS = [
  { label: "npm", code: "npm install linkfolio" },
  { label: "pnpm", code: "pnpm add linkfolio" },
  { label: "yarn", code: "yarn add linkfolio" },
];

const HEADING_CLASS =
  "scroll-mt-8 mb-[clamp(0.75rem,0.6rem_+_0.5vw,1.125rem)] text-[length:clamp(1.25rem,1.1rem_+_0.7vw,1.625rem)] font-semibold";

const BODY_CLASS =
  "text-[length:clamp(1rem,0.95rem_+_0.2vw,1.0625rem)] leading-[1.7]";

const SECTION_CLASS = "mt-[clamp(2.5rem,2rem_+_2vw,4rem)]";

export default function DocsPage() {
  // A personal deployment has no business shipping the project's docs.
  if (!isShowcase) notFound();

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
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />

      <main
        id="main"
        className="mx-auto flex max-w-[1200px] flex-col px-[clamp(1rem,3vw,3rem)] py-[clamp(2rem,1.5rem_+_2vw,4rem)] text-primary lg:grid lg:grid-cols-[minmax(0,68ch)_16rem] lg:items-start lg:gap-x-16"
      >
        {/*
          `<article>` (and its `<h1>`) comes first in source order so a
          screen reader in read-from-top mode hears the page title before the
          section index — the index is a shortcut for sighted/pointer users,
          not the first thing the page has to say. `order` (not DOM order)
          is what puts the index above the content on narrow screens and
          beside it on wide ones: `order-1`/`order-2` on this flex column for
          small screens, then the grid's own explicit `col-start`/`row-start`
          placement takes over at `lg`, where order no longer matters.
        */}
        <article className="order-2 max-w-[68ch] lg:order-none lg:col-start-1 lg:row-start-1">
          {/*
            A visitor who lands on /docs from search has no other route back
            to the landing page — the only exit was "Back to the demo" at the
            very bottom. Shared `BackLink`, same ghost treatment as the
            back-home action on the status pages, so the one affordance
            looks the same everywhere it appears.
          */}
          <p className="mb-4">
            <BackLink href="/" label="Back to home" />
          </p>
          <h1
            className="fade-in text-[length:clamp(1.875rem,1.5rem_+_1.6vw,2.75rem)] font-bold"
            style={{ animationDelay: "0.05s" }}
          >
            Linkfolio documentation
          </h1>
          <div
            className="reveal-line mt-4 mb-6 h-0.5 w-(--lf-accent-line-width) origin-left bg-(--lf-accent-line-color) opacity-(--lf-accent-line-opacity)"
            style={{ animationDelay: "0.15s" }}
            role="presentation"
          />
          <p
            className={`mb-[clamp(0.75rem,0.65rem_+_0.3vw,1rem)] ${BODY_CLASS}`}
          >
            Linkfolio is a self-hosted, open-source link-in-bio page — a
            Linktree alternative built with Next.js and Tailwind CSS. It gives
            you one fast, accessible page linking every part of your online
            presence, on your own domain.
          </p>

          <section id="deploy" className={SECTION_CLASS}>
            <h2 className={HEADING_CLASS}>Deploy the template</h2>
            <p className={BODY_CLASS}>
              Clone the repository and deploy it to Vercel, then edit{" "}
              <code>config/user.config.ts</code> to set your name, avatar and
              links. The same file also takes a <code>theme</code> and{" "}
              <code>darkTheme</code> object for programmatic colour and motion
              overrides, and a <code>themeColor</code> string for the browser
              chrome colour.
            </p>
            <p className={BODY_CLASS}>
              Set <code>layout: &quot;bento&quot;</code> in the same file to
              swap the wrapping rows for a mosaic grid. Tile sizes come from the{" "}
              <code>group</code> each link already declares —{" "}
              <code>project</code> takes a large tile, <code>website</code> a
              wide one and everything else a small square, so no link needs
              annotating. Any link can override that with its own{" "}
              <code>span</code> — <code>&quot;2x2&quot;</code>,{" "}
              <code>&quot;1x2&quot;</code> and so on, read as columns x rows —
              and a <code>direction</code> of{" "}
              <code>&quot;horizontal&quot;</code> to set its image beside the
              text instead of above it. Try both on the{" "}
              <Link href="/demo">demo page</Link>.
            </p>
          </section>

          <section id="integrate" className={SECTION_CLASS}>
            <h2 className={HEADING_CLASS}>Add it to an existing project</h2>
            <p
              className={`mb-[clamp(0.75rem,0.65rem_+_0.3vw,1rem)] ${BODY_CLASS}`}
            >
              Install the package and render the component with your own config:
            </p>
            <CodeBlock
              tabs={INSTALL_TABS}
              label="Package manager"
              className="mb-[clamp(0.75rem,0.65rem_+_0.3vw,1rem)]"
            />
            {/* CodeBlock rather than a bare <pre>: a horizontally scrolling
                region needs to be reachable by keyboard, which the component's
                single-tab form already handles. */}
            <CodeBlock
              tabs={[
                {
                  label: "Usage",
                  code: `import { LinkFolio } from "linkfolio";

export default function Page() {
  return <LinkFolio userConfig={userConfig} />;
}`,
                },
              ]}
              className="mt-[clamp(0.75rem,0.65rem_+_0.3vw,1rem)]"
            />
            <p
              className={`mt-[clamp(0.75rem,0.65rem_+_0.3vw,1rem)] ${BODY_CLASS}`}
            >
              <code>LinkFolio</code> also accepts <code>renderJsonLd</code>,{" "}
              <code>renderChrome</code> and <code>headingLevel</code> props for
              embedding it on a page that already has its own heading or
              structured data, and server components can build the same metadata
              and JSON-LD by importing from <code>linkfolio/seo</code> instead
              of <code>linkfolio</code>. The full configuration reference lives
              in the{" "}
              <a
                className="underline underline-offset-2"
                href="https://github.com/heristop/linkfolio#readme"
              >
                project README
              </a>
              .
            </p>
          </section>

          <section id="analytics" className={SECTION_CLASS}>
            <h2 className={HEADING_CLASS}>Analytics</h2>
            <p
              className={`mb-[clamp(0.75rem,0.65rem_+_0.3vw,1rem)] ${BODY_CLASS}`}
            >
              Linkfolio loads no analytics by default. Name a provider and it
              loads that tag — <code>ga</code>, <code>gtm</code>,{" "}
              <code>plausible</code>, <code>umami</code> and <code>beam</code>{" "}
              ship built in, and <code>registerAnalyticsAdapter</code> takes any
              other. All but <code>beam</code> also report which link each
              visitor clicked; Beam&apos;s event API takes a path rather than a
              named event, so it records page views only.
            </p>
            <CodeBlock
              tabs={[
                {
                  label: "Config",
                  code: `analytics: {
  provider: "plausible",
  id: "example.com",
}`,
                },
              ]}
              className="mb-[clamp(0.75rem,0.65rem_+_0.3vw,1rem)]"
            />
            <p className={BODY_CLASS}>
              With no provider configured at all, each card still dispatches a{" "}
              <code>linkfolio:analytics</code> event on <code>document</code>{" "}
              carrying the link&apos;s title, URL and group — enough to wire up
              any tracker yourself. The full reference lives in the{" "}
              <a
                className="underline underline-offset-2"
                href="https://github.com/heristop/linkfolio#analytics"
              >
                project README
              </a>
              .
            </p>
          </section>

          <section id="faq" className={SECTION_CLASS}>
            <h2 className={HEADING_CLASS}>Frequently asked questions</h2>
            <dl className="divide-y divide-primary/10">
              {FAQ.map((item) => (
                <div key={item.q} className="py-4 first:pt-0">
                  <dt className={`mb-1 font-semibold ${BODY_CLASS}`}>
                    {item.q}
                  </dt>
                  <dd className={`text-(--lf-description-color) ${BODY_CLASS}`}>
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="mt-[clamp(2.5rem,2rem_+_2vw,4rem)]">
            <Link
              className="inline-flex min-h-11 items-center underline underline-offset-2"
              href="/demo"
            >
              Back to the demo
            </Link>
          </p>
        </article>

        {/* Second in source order per the note above; `order-1` lifts it
            above the article on narrow screens, and the grid places it in the
            right-hand column from `lg`, where it sticks as the reader scrolls. */}
        <OnThisPage
          sections={SECTIONS}
          className="order-1 mb-8 lg:order-none lg:col-start-2 lg:row-start-1 lg:sticky lg:top-[clamp(1.5rem,4vh,3rem)] lg:mb-0 lg:self-start"
        />
      </main>
    </>
  );
}
