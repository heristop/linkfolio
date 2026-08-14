import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import BackLink from "./lib/BackLink";
import { isShowcase } from "./lib/siteMeta";
import StatusPage, { ACTION_SECONDARY_CLASS } from "./lib/StatusPage";

/**
 * Declared because metadata is inherited: without this the root layout's
 * `robots: { index: true, follow: true }` and `alternates.canonical: "/"`
 * apply, so every mistyped address invites indexing and claims to be the
 * home page.
 */
export const metadata: Metadata = {
  title: "Page not found — Linkfolio",
  robots: { index: false, follow: false },
  alternates: {},
};

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="This page does not exist"
      actions={
        <>
          <BackLink href="/" label="Back to the home page" variant="primary" />
          {/* A personal deployment 404s /docs — no point advertising it. */}
          {isShowcase && (
            <Link href="/docs" className={ACTION_SECONDARY_CLASS}>
              Read the documentation
            </Link>
          )}
        </>
      }
    >
      <p>
        The address you followed does not match any route on this site. It may
        have moved, or the link that brought you here may be out of date.
      </p>
    </StatusPage>
  );
}
