"use client";
import React, { useRef } from "react";
import { useRevealChildren } from "./useRevealChildren";

/**
 * Shared shell for the status routes (404, 400, 500). Every value comes from
 * the theme tokens in `src/assets/globals.css`, so a fork that reskins the
 * card reskins these pages too, without touching them.
 *
 * The entrance runs through the same intersection observer the link cards use,
 * rather than fixed animation delays: the observer sequences whatever is on
 * screen and leaves the content visible when scripting or motion is off.
 */

const CODE_CLASS =
  "lf-reveal text-[length:clamp(3rem,2.2rem_+_3.5vw,5rem)] font-bold leading-none text-secondary";
const TITLE_CLASS =
  "lf-reveal mt-2 text-balance text-[length:clamp(1.5rem,1.3rem_+_1vw,2.125rem)] font-semibold";
const BODY_CLASS =
  "lf-reveal max-w-prose text-[length:clamp(1rem,0.95rem_+_0.2vw,1.0625rem)] leading-[1.7] text-(--lf-description-color)";

/**
 * `hover:text-…` repeats the resting colour on purpose. The stylesheet has a
 * global `a:hover { color: var(--color-secondary) }`, which outranks a plain
 * text utility and repainted this label in the same hue as its own background
 * — the text vanished on hover. Restating it at class+pseudo specificity wins.
 */
export const ACTION_PRIMARY_CLASS =
  "lf-cta inline-flex min-h-11 items-center rounded-md bg-primary px-6 text-background-start hover:text-background-start";
export const ACTION_SECONDARY_CLASS =
  "lf-cta-ghost inline-flex min-h-11 items-center rounded-md border border-primary/20 px-6 underline-offset-2 hover:underline";

export type StatusPageProps = {
  code: string;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
};

export default function StatusPage({
  code,
  title,
  children,
  actions,
}: Readonly<StatusPageProps>) {
  const ref = useRef<HTMLElement>(null);

  useRevealChildren(ref);

  return (
    <main
      ref={ref}
      className="mx-auto flex min-h-[60vh] max-w-[720px] flex-col justify-center px-[clamp(1rem,3vw,3rem)] py-[clamp(2rem,1.5rem_+_2vw,4rem)] text-primary"
      style={{ paddingTop: "max(2rem, env(safe-area-inset-top))" }}
    >
      <p className={CODE_CLASS}>{code}</p>

      <h1 className={TITLE_CLASS}>{title}</h1>

      {/* The line keeps its own opacity token, so the reveal drives a wrapper
          rather than fighting it for the same property. */}
      <div className="lf-reveal mt-4 mb-6">
        <div
          className="h-0.5 w-(--lf-accent-line-width) bg-(--lf-accent-line-color) opacity-(--lf-accent-line-opacity)"
          role="presentation"
        />
      </div>

      <div className={BODY_CLASS}>{children}</div>

      <div className="lf-reveal mt-8 flex flex-wrap gap-4">{actions}</div>
    </main>
  );
}
