"use client";
import React, { useId, useRef, useState } from "react";
import { useCopyToClipboard } from "./useCopyToClipboard";

/**
 * Code block with optional tabs.
 *
 * One tab renders as a plain block with a copy button; several render as an
 * ARIA tabs pattern (roving tabindex, Left/Right/Home/End, automatic
 * activation) per the WAI-ARIA APG.
 *
 * Every panel is always in the DOM — inactive ones only get `hidden` — so all
 * variants are in the server-rendered HTML rather than just the active one.
 */

export type CodeTab = {
  label: string;
  code: string;
};

export type CodeBlockProps = {
  tabs: CodeTab[];
  /** Names the tablist for screen readers, e.g. "Package manager". */
  label?: string;
  className?: string;
};

const TAB_CLASS =
  "relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-t-md px-4 text-sm transition-[color,background-color] duration-(--lf-motion-base) ease-(--lf-ease-out) focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary";

function CopyIcon({ done }: Readonly<{ done: boolean }>) {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {done ? (
        <path d="M20 6 9 17l-5-5" />
      ) : (
        <>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      )}
    </svg>
  );
}

export default function CodeBlock({
  tabs,
  label,
  className,
}: Readonly<CodeBlockProps>) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const { copied: copiedIndex, copy } = useCopyToClipboard<number>();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabId = (index: number) => `${uid}-tab-${index}`;
  const panelId = (index: number) => `${uid}-panel-${index}`;
  const hasTabs = tabs.length > 1;

  function focusTab(index: number) {
    setActive(index);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab((index + 1) % tabs.length);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab((index - 1 + tabs.length) % tabs.length);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(tabs.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-md border border-primary/15 bg-(--lf-card-bg) ${className ?? ""}`}
    >
      {hasTabs && (
        <div
          role="tablist"
          aria-label={label ?? "Variants"}
          className="flex gap-1 border-b border-primary/15 bg-gradient-background px-1 pt-1"
        >
          {tabs.map((tab, index) => {
            const isActive = index === active;
            return (
              <button
                key={tab.label}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={tabId(index)}
                aria-selected={isActive}
                aria-controls={panelId(index)}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`${TAB_CLASS} ${
                  isActive
                    ? "bg-(--lf-card-bg) font-semibold text-primary"
                    : "text-(--lf-description-color) hover:text-primary"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-secondary"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* The panel takes no `tabIndex`: it holds focusable content — the code
          box below and the copy button — which is the condition under which the
          tabs pattern asks for one. */}
      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          {...(hasTabs
            ? {
                role: "tabpanel",
                id: panelId(index),
                "aria-labelledby": tabId(index),
              }
            : {})}
          hidden={index !== active}
          className="flex items-center justify-between gap-3 p-4"
        >
          {/*
            A long command scrolls inside its own box rather than widening the
            page, and the mask fades the overflow edge instead of cutting the
            text off against a hard border.
          */}
          <pre
            className="min-w-0 flex-1 overflow-x-auto -webkit-mask-[linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] mask-[linear-gradient(to_right,black_calc(100%-1.5rem),transparent)]"
            // This is the element that scrolls, so this is the element that
            // has to be focusable — a command wider than the box is otherwise
            // unreachable with a keyboard (WCAG 2.1.1), tabs or no tabs, and
            // axe's `scrollable-region-focusable` requires exactly this.
            //
            // Both linters object to tabIndex on a non-interactive element,
            // and neither has an exception for scroll containers; the rule
            // they apply is right in general and wrong here, so it is
            // suppressed rather than worked around. aria-label names the
            // region a keyboard user lands in.
            aria-label={`${tab.label} code`}
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0} // NOSONAR S6845 - focusable scroll container, see above
          >
            <code className="font-mono text-sm leading-relaxed text-primary">
              {tab.code}
            </code>
          </pre>

          <button
            type="button"
            onClick={() => void copy(tab.code, index)}
            aria-label={`Copy ${tab.label} command`}
            className="lf-cta-ghost inline-flex min-h-11 min-w-11 shrink-0 items-center gap-1.5 rounded-md border border-primary/20 px-3 text-xs font-medium text-(--lf-description-color) hover:text-primary"
          >
            <CopyIcon done={copiedIndex === index} />
            {/*
              Both labels always occupy the same grid cell, so the button's
              width is the max of "Copy"/"Copied" at all times and only
              opacity animates on copy — no reflow of sibling elements.
              prefers-reduced-motion is covered by the global catch-all in
              globals.css, which caps opacity transitions at 120ms.
            */}
            <span className="grid [grid-template-areas:'label']">
              <span
                aria-hidden={copiedIndex === index}
                style={{ gridArea: "label" }}
                className={`transition-opacity duration-(--lf-motion-base) ease-(--lf-ease-out) ${
                  copiedIndex === index ? "opacity-0" : "opacity-100"
                }`}
              >
                Copy
              </span>
              <span
                aria-hidden={copiedIndex !== index}
                style={{ gridArea: "label" }}
                className={`transition-opacity duration-(--lf-motion-base) ease-(--lf-ease-out) ${
                  copiedIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                Copied
              </span>
            </span>
          </button>
        </div>
      ))}

      <output className="sr-only">
        {copiedIndex === null
          ? ""
          : `Copied ${tabs[copiedIndex].label} command`}
      </output>
    </div>
  );
}
