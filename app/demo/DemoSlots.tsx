"use client";

import Link from "next/link";

/** Copy and icons for the demo page, kept out of the panel that renders them. */

export function Intro() {
  return (
    <div className="mb-8 text-center max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">
        A self-hosted link-in-bio page
      </h2>
      <p className="text-sm opacity-80">
        This is a live demo of Linkfolio, an open-source Linktree alternative
        built with Next.js and Tailwind CSS. Every link below is a placeholder —
        deploy your own copy and edit a single config file to make it yours.
      </p>
    </div>
  );
}

export function Outro() {
  return (
    <div className="mt-8 text-center max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Make it your own</h2>
      <p className="text-sm opacity-80">
        Deploy to Vercel in one click, or install the <code>linkfolio</code>{" "}
        package into an existing Next.js project. Read the{" "}
        <Link href="/docs" className="underline">
          documentation
        </Link>{" "}
        to get started.
      </p>
    </div>
  );
}

/** Replaces the default footer when the footer is switched off. */
export function NoFooter() {
  return null;
}

export function SlidersIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h11M21 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}
