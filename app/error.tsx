"use client";
import React, { useEffect } from "react";
import BackLink from "./lib/BackLink";
import StatusPage, { ACTION_PRIMARY_CLASS } from "./lib/StatusPage";

export default function Error({
  error,
  retry,
}: Readonly<{
  error: Error & { digest?: string };
  /**
   * `retry` re-fetches and re-renders the boundary's children, which is what
   * the copy below promises. `reset`, its predecessor, only clears the error
   * state and re-renders — stale data comes straight back.
   */
  retry: () => void;
}>) {
  useEffect(() => {
    // The digest is the only handle on the server-side stack, which Next
    // withholds from the browser in production.
    console.error("Unhandled error", error.digest ?? error.message);
  }, [error]);

  return (
    <StatusPage
      code="500"
      title="Something went wrong on our side"
      actions={
        <>
          <button
            type="button"
            onClick={() => retry()}
            className={ACTION_PRIMARY_CLASS}
          >
            Try again
          </button>
          <BackLink href="/" label="Back to the home page" />
        </>
      }
    >
      <p>
        This page failed to render. Retrying often clears it; if it keeps
        happening the problem is on the server rather than with your browser.
      </p>
      {error.digest && (
        <p className="mt-4 text-sm">
          Reference code: <code>{error.digest}</code>
        </p>
      )}
    </StatusPage>
  );
}
