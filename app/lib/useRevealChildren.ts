"use client";

import { useEffect, type RefObject } from "react";
import { observeReveal } from "@/lib/revealObserver";

/**
 * Hands every `.lf-reveal` inside `ref` to the shared reveal observer.
 *
 * The class only sets the hidden state; something has to reveal it. Marking an
 * element `.lf-reveal` without observing it leaves it invisible, so the pairing
 * lives here rather than being re-implemented per component.
 *
 * A mount-time `querySelectorAll` would only hold while the subtree is static:
 * anything rendered later — a row added by a filter, a block behind a
 * condition — would never be observed and would stay at `opacity: 0` for good,
 * silently, while still taking up space and remaining focusable. The mutation
 * observer keeps the pairing true for whatever the subtree becomes.
 */
export function useRevealChildren(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const stops = new Map<Element, () => void>();

    const track = (scope: ParentNode) => {
      for (const element of scope.querySelectorAll(".lf-reveal")) {
        if (!stops.has(element)) stops.set(element, observeReveal(element));
      }
    };

    track(root);

    const mutations =
      typeof MutationObserver === "undefined"
        ? undefined
        : new MutationObserver((records) => {
            for (const record of records) {
              for (const node of record.addedNodes) {
                if (!(node instanceof Element)) continue;

                // The node itself can carry the class; querySelectorAll below
                // only reaches its descendants.
                if (node.classList.contains("lf-reveal") && !stops.has(node)) {
                  stops.set(node, observeReveal(node));
                }

                track(node);
              }
            }
          });

    mutations?.observe(root, { childList: true, subtree: true });

    return () => {
      mutations?.disconnect();
      for (const stop of stops.values()) stop();
    };
  }, [ref]);
}
