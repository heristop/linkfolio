"use client";
import React from "react";
import { Raleway } from "next/font/google";
import "@/assets/globals.css";
import StatusPage, { ACTION_PRIMARY_CLASS } from "./lib/StatusPage";

/**
 * Replaces the root layout when the layout itself throws, so it has to supply
 * its own <html>, <body>, font and stylesheet. next-themes never mounts here,
 * which is why this one renders in the light palette regardless of preference.
 */
const font = Raleway({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function GlobalError({
  error,
  retry,
}: Readonly<{
  error: Error & { digest?: string };
  retry: () => void;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <StatusPage
          code="500"
          title="The site failed to load"
          actions={
            <button
              type="button"
              onClick={() => retry()}
              className={ACTION_PRIMARY_CLASS}
            >
              Reload the page
            </button>
          }
        >
          <p>
            An error escaped the root layout, so none of the usual page shell
            could be rendered. Reloading is worth a try before anything else.
          </p>
          {error.digest && (
            <p className="mt-4 text-sm">
              Reference code: <code>{error.digest}</code>
            </p>
          )}
        </StatusPage>
      </body>
    </html>
  );
}
