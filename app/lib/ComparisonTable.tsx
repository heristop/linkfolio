"use client";

import React, { useRef } from "react";
import { useRevealChildren } from "./useRevealChildren";

export type ComparisonRow = {
  label: string;
  linkfolio: string;
  hosted: string;
};

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="16"
      height="16"
      className="mt-1 shrink-0 text-secondary"
    >
      <path
        fill="currentColor"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L9 11.6l6.3-6.3a1 1 0 0 1 1.4 0Z"
      />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="16"
      height="16"
      className="mt-1 shrink-0 text-(--lf-description-color) opacity-50"
    >
      <rect x="5" y="9" width="10" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

const CELL_CLASS = "p-4 align-top text-[0.95rem] leading-[1.6]";
/** Repeated on the header and every body cell so the column reads as a band. */
const FEATURED_COLUMN_CLASS = "bg-primary/5";

/** Shown instead of the column header once the table reflows into cards. */
function MobileLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span
      aria-hidden="true"
      className="mb-1 block text-xs font-medium tracking-wide text-(--lf-description-color) uppercase sm:hidden"
    >
      {children}
    </span>
  );
}

/**
 * The two columns are not equal claims, so they are not styled as equals: the
 * Linkfolio column carries a tint, a heavier weight and a check, the hosted
 * column stays muted with a neutral dash. The icons carry the difference as
 * well as the tint, so it survives for anyone who cannot separate the hues.
 */
export default function ComparisonTable({
  rows,
}: Readonly<{ rows: ComparisonRow[] }>) {
  const ref = useRef<HTMLDivElement>(null);

  useRevealChildren(ref);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-(--lf-card-radius) border border-primary/15 bg-(--lf-card-bg)"
    >
      {/*
        No min-width and no horizontal scroll: under `sm` the table drops to
        blocks so each row becomes a stacked card, which is why every cell
        carries its own label for that layout.
      */}
      <table className="w-full border-collapse text-left max-sm:block">
        <caption className="sr-only">
          Linkfolio compared with hosted link-in-bio services
        </caption>

        <thead className="max-sm:hidden">
          <tr className="border-b border-primary/10">
            <th scope="col" className="p-4">
              <span className="sr-only">Aspect</span>
            </th>
            <th
              scope="col"
              className={`p-4 font-semibold text-primary ${FEATURED_COLUMN_CLASS}`}
            >
              Linkfolio
            </th>
            <th
              scope="col"
              className="p-4 font-medium text-(--lf-description-color)"
            >
              Hosted link-in-bio services
            </th>
          </tr>
        </thead>

        <tbody className="max-sm:block">
          {rows.map((row) => (
            <tr
              key={row.label}
              className="lf-reveal border-b border-primary/10 transition-colors duration-(--lf-motion-base) last:border-0 hover:bg-primary/2 max-sm:block max-sm:p-4"
            >
              <th
                scope="row"
                className={`font-semibold text-primary ${CELL_CLASS} max-sm:block max-sm:p-0 max-sm:pb-3`}
              >
                {row.label}
              </th>

              <td
                className={`${CELL_CLASS} ${FEATURED_COLUMN_CLASS} max-sm:block max-sm:rounded-md max-sm:p-3`}
              >
                <MobileLabel>Linkfolio</MobileLabel>
                <span className="flex gap-2 font-medium text-primary">
                  <CheckIcon />
                  {row.linkfolio}
                </span>
              </td>

              <td
                className={`${CELL_CLASS} text-(--lf-description-color) max-sm:block max-sm:p-3 max-sm:pb-0`}
              >
                <MobileLabel>Hosted services</MobileLabel>
                <span className="flex gap-2">
                  <DashIcon />
                  {row.hosted}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
