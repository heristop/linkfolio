"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SocialNetworkProps } from "../types";
import { safeUrl } from "../lib/sanitize";
import { buildLinkClickEvent, emitAnalyticsEvent } from "../lib/analytics";
import { observeReveal } from "../lib/revealObserver";
import { resolveDirection, resolveSpan } from "../lib/bento";

const SocialNetwork: React.FC<SocialNetworkProps> = ({
  config,
  delay = 0,
  priority = false,
  onLinkClick,
  titleLevel: Title = "h2",
}: Readonly<SocialNetworkProps>) => {
  const ref = useRef<HTMLDivElement>(null);

  // Unconditional by design: an unheard CustomEvent costs nothing, and
  // deciding whether anyone is listening is `<Analytics>`'s job, not the
  // card's. That separation is what keeps the card vendor-neutral.
  const report = () => {
    emitAnalyticsEvent(buildLinkClickEvent(config));
    onLinkClick?.(config);
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return observeReveal(element);
  }, []);

  return (
    <div
      ref={ref}
      data-group={config.group || "socialnetwork"}
      // Always emitted, read only under `.lf-bento`: resolving the tile here
      // keeps the fallback chain (link → group → default) in one place
      // instead of spreading it across CSS selectors.
      data-span={resolveSpan(config)}
      data-direction={resolveDirection(config)}
      className="network flex flex-col items-center p-2"
      // The resting delay. The reveal observer overwrites it per arriving
      // batch, but a card the observer has not reached yet still needs the
      // property to resolve — including the ones the safety-net sweep reveals,
      // which carry no batch position of their own.
      style={{ "--lf-stagger": `${delay}ms` } as React.CSSProperties}
    >
      <Link
        href={safeUrl(config.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="group w-full"
        // Attribution data on the anchor itself, so a tag manager or a
        // delegated listener can read it off the click target without the
        // library needing to know the tag manager exists.
        data-lf-link={config.title}
        data-lf-url={safeUrl(config.url)}
        data-lf-group={config.group || "socialnetwork"}
        onClick={report}
        // Middle-click opens the link in a background tab — a real
        // navigation that `click` never fires for, so it would otherwise go
        // unattributed.
        onAuxClick={(event) => {
          if (event.button === 1) report();
        }}
      >
        <div className="flex justify-center">
          <div className="lf-icon-container relative w-full max-w-xs mx-auto overflow-hidden rounded-lg">
            <Image
              src={config.iconSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 767px) 45vw, (max-width: 1200px) 33vw, 20vw"
              quality={90}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          </div>
        </div>

        <div className="lf-data px-2 py-4 text-center">
          <Title className="lf-title text-xl font-bold mb-2">
            {config.title}
          </Title>
          <p className="lf-description description text-sm truncate text-(--lf-description-color)">
            {config.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SocialNetwork;
