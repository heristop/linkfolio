"use client";

import React, { useRef } from "react";
import { useRevealChildren } from "./useRevealChildren";
import {
  SOURCES_CHECKED,
  type ComparisonColumn,
  type ComparisonRow,
} from "./projectContent";

export type { ComparisonColumn, ComparisonRow };

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

/** The em dash used for an unpublished fact — never rendered with DashIcon,
 * whose absence-of-feature meaning would turn "the vendor doesn't say" into
 * the false claim "the vendor doesn't do this". */
const UNPUBLISHED = "—";

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
 * The columns are not equal claims, so they are not styled as equals: the
 * Linkfolio column carries a tint, a heavier weight and a check, the
 * competitor columns stay muted. An unpublished ("—") cell gets neither icon:
 * it is not a claim about the product at all, just an admission that nobody
 * could verify one, so it renders as plain muted text rather than the
 * DashIcon treatment that would read as "this product doesn't do that".
 */
export default function ComparisonTable({
  columns,
  rows,
}: Readonly<{ columns: ComparisonColumn[]; rows: ComparisonRow[] }>) {
  const ref = useRef<HTMLDivElement>(null);

  useRevealChildren(ref);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-(--lf-card-radius) border border-primary/15 bg-(--lf-card-bg)"
    >
      {/*
        No min-width and no horizontal scroll below `sm`: the table drops to
        blocks so each row becomes a stacked card, which is why every cell
        carries its own label for that layout. Above `sm`, four columns won't
        fit a phone width, so the table itself scrolls within this wrapper
        rather than the page body scrolling sideways.
      */}
      <div
        className="overflow-x-auto overflow-y-hidden"
        // This is the element that scrolls, so this is the element that has
        // to be focusable — a table wider than the viewport is otherwise
        // unreachable with a keyboard (WCAG 2.1.1), and axe's
        // `scrollable-region-focusable` requires exactly this (see
        // CodeBlock.tsx's `<pre>` for the same pattern).
        aria-label="Comparison table"
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0} // NOSONAR S6845 - focusable scroll container, see above
      >
        <table className="w-full border-collapse text-left max-sm:block">
          <caption className="sr-only">
            Linkfolio compared with{" "}
            {columns
              .filter((c) => !c.featured)
              .map((c) => c.label)
              .join(", ")}
          </caption>

          {/* `sr-only` rather than `hidden` below `sm`: the header text stays
              in the DOM and the accessibility tree instead of being removed
              with `display:none`, which is strictly better even though we
              can't confirm it restores true per-cell column association at
              this breakpoint — the table's own `max-sm:block` already moves
              rows/cells off native table display, and that's independently
              known to affect table semantics in some browsers. Confirming
              the actual screen-reader experience here needs manual
              verification (VoiceOver on Mobile Safari, TalkBack on Mobile
              Chrome), not axe or Playwright. */}
          <thead className="max-sm:sr-only">
            <tr className="border-b border-primary/10">
              <th scope="col" className="p-4">
                <span className="sr-only">Aspect</span>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`p-4 font-semibold ${
                    column.featured
                      ? `text-primary ${FEATURED_COLUMN_CLASS}`
                      : "font-medium text-(--lf-description-color)"
                  }`}
                >
                  {column.label}
                </th>
              ))}
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

                {columns.map((column, index) => {
                  const value = row.cells[column.key];
                  const unpublished = value === UNPUBLISHED;
                  // Only the last stacked cell drops its bottom padding —
                  // the card's own `p-4` already closes the gap there, while
                  // earlier cells keep it to stay visually separated.
                  const isLastColumn = index === columns.length - 1;

                  return (
                    <td
                      key={column.key}
                      className={`${CELL_CLASS} ${
                        column.featured
                          ? `${FEATURED_COLUMN_CLASS} max-sm:rounded-md`
                          : "text-(--lf-description-color)"
                      } max-sm:block max-sm:p-3 ${isLastColumn ? "max-sm:pb-0" : ""}`}
                    >
                      {/* Trailing colon (not just a repeat of column.label)
                          keeps this from being a second, hidden element with
                          the exact same text as the column header — the kind
                          of duplicate that a strict-mode accessible-name
                          query would otherwise trip over. */}
                      <MobileLabel>{`${column.label}:`}</MobileLabel>
                      <span
                        className={`flex gap-2 ${column.featured ? "font-medium text-primary" : ""}`}
                      >
                        {!unpublished &&
                          (column.featured ? <CheckIcon /> : <DashIcon />)}
                        {value}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-primary/10 p-4 text-xs text-(--lf-description-color)">
        “—” means the vendor does not publish that information. Competitor
        details checked {SOURCES_CHECKED}.
      </p>
    </div>
  );
}
