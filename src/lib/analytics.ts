import type { AnalyticsEvent, SocialNetworkType } from "../types";
import { safeUrl } from "./sanitize";

/**
 * The one thing every integration path goes through. Namespaced so it cannot
 * collide with a host application's own events.
 */
export const LINKFOLIO_ANALYTICS_EVENT = "linkfolio:analytics";

/** The event name emitted when a link card is clicked. */
export const LINK_CLICK_EVENT = "link_click";

/** Matches the card markup, which falls back to the same group slug. */
const DEFAULT_GROUP = "socialnetwork";

/**
 * Describe a click on `link`.
 *
 * The URL is passed through `safeUrl` for the same reason the anchor is:
 * a rejected URL renders as `"#"`, and reporting the raw config value would
 * attribute the click to a destination the visitor never reached.
 */
export function buildLinkClickEvent(link: SocialNetworkType): AnalyticsEvent {
  return {
    name: LINK_CLICK_EVENT,
    params: {
      link_title: link.title ?? "",
      link_url: safeUrl(link.url),
      link_group: link.group || DEFAULT_GROUP,
    },
  };
}

/**
 * Dispatch `event` on `document` for anyone listening.
 *
 * Unconditional by design: this is the provider-agnostic half of the system,
 * and an unheard `CustomEvent` costs nothing. Whether an event reaches a
 * vendor is decided by `<Analytics>`, not here — which is what lets the core
 * stay free of any provider knowledge.
 *
 * Returns whether it was dispatched, so callers can tell "no document"
 * (server render) from "delivered".
 */
export function emitAnalyticsEvent(event: AnalyticsEvent): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  document.dispatchEvent(
    new CustomEvent<AnalyticsEvent>(LINKFOLIO_ANALYTICS_EVENT, {
      detail: event,
    }),
  );

  return true;
}
