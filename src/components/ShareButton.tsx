"use client";
import { useEffect, useRef, useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  async function handleShare() {
    const shareData = {
      title: document.title,
      url: globalThis.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed silently
      }
      return;
    }

    // The clipboard fallback needs a secure context, which a self-hosted page
    // on plain http does not have — without the guard the button throws.
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);

      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Permission denied: degrade silently rather than throwing.
    }
  }

  return (
    <>
      {/* The copy result is conveyed only by an icon swap, which a screen
          reader has no way to report. */}
      <output className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </output>

      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this page"
        className="lf-icon-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {copied ? (
            <path d="M20 6 9 17l-5-5" />
          ) : (
            <>
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
