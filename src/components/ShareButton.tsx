"use client";
import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

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

    await navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share this page"
      className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer opacity-60 transition-[opacity,transform] duration-250 ease-[var(--ease-out-expo)] hover:opacity-100 hover:scale-115 active:scale-92 [&_svg]:w-[20px] [&_svg]:h-[20px] sm:[&_svg]:w-[18px] sm:[&_svg]:h-[18px]"
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
  );
}
