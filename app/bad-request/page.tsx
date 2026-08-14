import Link from "next/link";
import type { Metadata } from "next";
import BackLink from "../lib/BackLink";
import { isShowcase } from "../lib/siteMeta";
import StatusPage, { ACTION_SECONDARY_CLASS } from "../lib/StatusPage";

/**
 * The App Router has file conventions for 404 (not-found), 401 (unauthorized)
 * and 403 (forbidden), but none for 400 — a page cannot set its own status
 * code. This route is the themed destination to redirect to from middleware or
 * a route handler that has already answered 400 to the failing request.
 */
export const metadata: Metadata = {
  title: "Bad request — Linkfolio",
  robots: { index: false, follow: false },
  // Cleared rather than inherited: the layout canonicalises to "/", which
  // this page is not.
  alternates: {},
};

export default function BadRequest() {
  return (
    <StatusPage
      code="400"
      title="That request could not be read"
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
        Something in the address or its parameters was malformed, so the server
        stopped before doing anything with it. Retyping the address usually
        clears it up.
      </p>
    </StatusPage>
  );
}
