"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * "On this page" section index for the docs page.
 *
 * The server page (`app/docs/page.tsx`) owns the section list — id/label
 * pairs pulled from the same headings it renders — and hands it to this
 * client component as props. That keeps the links themselves, their order,
 * and their `href`s in the server-rendered HTML: a crawler or a browser with
 * JavaScript disabled sees a complete, working table of contents.
 *
 * The only thing that depends on the client is *which* link is marked
 * current — the IntersectionObserver below, and the rail marker that
 * tracks it. Unlike the reveal system in src/lib/revealObserver.ts, nothing
 * here is hidden by default and then unhidden by a class the observer adds.
 * If IntersectionObserver is unavailable, or the observer never fires, every
 * link stays exactly as visible and clickable as it is with JS running —
 * the page just keeps whichever item was active by default (the first).
 */

export type Section = { id: string; label: string };

export type OnThisPageProps = {
  sections: Section[];
  className?: string;
};

/**
 * The "reading band" sits from 15% to 30% down the viewport — where a
 * reader's eye actually is, not the very top or bottom edge. A heading only
 * counts as "current" while it sits inside that band, which is what lets a
 * long section keep its link highlighted for the whole time the reader is
 * inside it rather than just the instant the heading itself is on screen.
 */
const READING_BAND_MARGIN = "-15% 0px -70% 0px";

export default function OnThisPage({
  sections,
  className,
}: Readonly<OnThisPageProps>) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const inBand = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            inBand.add(entry.target.id);
          } else {
            inBand.delete(entry.target.id);
          }
        }

        // Several headings can be "in band" for one frame while scrolling
        // fast; the one that appears first in page order is the one the
        // reader has actually reached.
        const current = sections.find((section) => inBand.has(section.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: READING_BAND_MARGIN, threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [sections]);

  // Fallback for the last section: if it is short, the page can run out of
  // scroll room before its heading ever passes back out of the reading band
  // on its own, so the plain observer above has nothing left to fire. Once
  // the reader has scrolled to the literal bottom of the document, force the
  // last item active regardless of where its heading sits.
  useEffect(() => {
    const lastId = sections.at(-1)?.id;
    if (!lastId) return;

    function handleScroll() {
      // `scrollY > 0` is what makes this "the reader reached the bottom"
      // rather than "the page is shorter than the viewport". Without it, a
      // tall window — or a first paint before images and fonts settle — marks
      // the last section current while the reader is still at the top.
      const atBottom =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2;
      if (atBottom && lastId) setActiveId(lastId);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Slides the rail marker to the active link. `top` is measured (a layout
  // read) but only ever written as a CSS custom property that a transform
  // consumes — the marker itself never has a layout property transitioned,
  // just `transform`/`opacity`, per the house motion contract.
  useLayoutEffect(() => {
    function updateIndicator() {
      const link = linkRefs.current[activeId];
      const indicator = indicatorRef.current;
      if (!link || !indicator) return;

      indicator.style.setProperty("--rail-top", `${link.offsetTop}px`);
      indicator.style.height = `${link.offsetHeight}px`;
      indicator.style.opacity = "1";
    }

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeId]);

  return (
    <nav aria-label="On this page" className={className}>
      <span
        aria-hidden="true"
        className="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-primary uppercase"
      >
        On this page
      </span>

      <div className="relative">
        {/* Static rail: a hairline the marker travels along. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 hidden h-full w-px bg-primary/15 lg:block"
        />

        {/*
          Active marker. Resting position is driven by the `--rail-top`
          custom property so a `prefers-reduced-motion` visitor still lands
          in the right place: `top` alone (no animation) for them, versus a
          fixed `top-0` plus an animated `translate-y` transform for
          everyone else — never the same property animated both ways.
        */}
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-(--rail-top) hidden w-0.5 rounded-full bg-secondary opacity-0 transition-opacity duration-(--lf-motion-base) ease-(--lf-ease-out) motion-safe:top-0 motion-safe:translate-y-(--rail-top) motion-safe:transition-[transform,opacity] lg:block"
        />

        <ul className="flex flex-wrap gap-1 lg:flex-col lg:flex-nowrap lg:gap-y-1 lg:pl-4">
          {sections.map((section) => {
            const isActive = section.id === activeId;

            return (
              <li key={section.id}>
                <a
                  ref={(el) => {
                    linkRefs.current[section.id] = el;
                  }}
                  href={`#${section.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`lf-nudge flex min-h-11 items-center rounded-md px-2.5 text-[13px] leading-tight transition-colors duration-(--lf-motion-base) ease-(--lf-ease-out) hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "font-medium text-(--lf-description-color)"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
