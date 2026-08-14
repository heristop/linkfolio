"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";
import type { AnalyticsConfig, AnalyticsEvent } from "../types";
import { LINKFOLIO_ANALYTICS_EVENT } from "../lib/analytics";
import {
  analyticsScriptsFor,
  resolveAnalyticsAdapter,
  sendAnalyticsEvent,
} from "../lib/analytics-adapters";

type AnalyticsProps = {
  /**
   * Omit it and this component renders nothing and listens to nothing, which
   * is the default for every Linkfolio install.
   */
  config?: AnalyticsConfig;
};

/**
 * Loads the configured provider's tag and forwards Linkfolio's own events to
 * it.
 *
 * This is the only place in the library that knows a vendor exists. The link
 * cards emit a plain `linkfolio:analytics` DOM event and never learn who — if
 * anyone — is listening, which is what lets a consumer skip this component
 * entirely and wire their own listener instead.
 */
const Analytics = ({ config }: AnalyticsProps) => {
  const scripts = analyticsScriptsFor(config);

  // Deliberately NOT `scripts.length > 0`. An adapter is allowed to return no
  // scripts — `AnalyticsScript` documents `[]` as "load nothing, the tag is
  // already present", and re-registering a built-in that way is exactly what
  // the README recommends for a consumer whose GTM container is installed by
  // their own layout. Gating on output volume would leave those adapters
  // permanently mute. What matters is whether an adapter exists to forward to.
  const canForward = Boolean(
    config?.provider && config.id && resolveAnalyticsAdapter(config.provider),
  );

  // `config` is a fresh object identity on every render for a consumer
  // writing `<Analytics config={{ provider: "ga", id: "…" }} />` inline. The
  // listener reads the latest config through this ref, so the effect below
  // depends on `canForward` alone rather than on object identity, and avoids
  // a remove/add cycle on every parent render.
  const configRef = useRef(config);

  // Assigned in an effect, not during render: `next.config.js` sets
  // `reactCompiler: true`, and a ref write during render is a Rules-of-React
  // violation that makes the compiler bail out of optimising this component
  // entirely.
  useEffect(() => {
    configRef.current = config;
  });

  useEffect(() => {
    if (!canForward) return;

    const forward = (event: Event) => {
      const detail = (event as CustomEvent<AnalyticsEvent>).detail;
      if (detail) sendAnalyticsEvent(detail, configRef.current);
    };

    document.addEventListener(LINKFOLIO_ANALYTICS_EVENT, forward);

    return () =>
      document.removeEventListener(LINKFOLIO_ANALYTICS_EVENT, forward);
  }, [canForward]);

  return (
    <>
      {scripts.map(({ id, src, inline, attrs }) => (
        <Script
          key={id}
          {...attrs}
          id={id}
          src={src}
          strategy="afterInteractive"
          {...(inline
            ? { dangerouslySetInnerHTML: { __html: inline } }
            : undefined)}
        />
      ))}
    </>
  );
};

export default Analytics;
