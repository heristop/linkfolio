import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isShowcase, pageMetadata } from "../lib/siteMeta";
import TweakPanel from "./TweakPanel";

const PAGE_TITLE = "Live demo — Linkfolio";
const PAGE_DESCRIPTION =
  "A live demo of Linkfolio, the open-source self-hosted link-in-bio page built with Next.js and Tailwind CSS. Change the palette, identity and link groups and watch the page re-render.";

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
      path: "/demo",
    })
  : { robots: { index: false, follow: false }, alternates: {} };

export default function DemoPage() {
  // A personal deployment has no business shipping the project's demo.
  if (!isShowcase) notFound();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-(--lf-card-bg) focus:px-4 focus:text-primary focus:shadow-(--lf-card-shadow)"
      >
        Skip to main content
      </a>

      <main
        id="main"
        // Top padding clears the floating Tweak trigger, which is pinned to the
        // viewport's top-right and would otherwise sit over the card's own
        // action row on narrow screens.
        className="mx-auto max-w-(--breakpoint-lg) px-[clamp(0.5rem,2vw,1.5rem)] pt-[4.5rem] pb-[clamp(1rem,1vw_+_0.5rem,2rem)] sm:pt-[clamp(1.5rem,1vw_+_1rem,2.5rem)]"
      >
        <TweakPanel />
      </main>
    </>
  );
}
