"use client";
import { useCallback, useEffect, useState } from "react";
import { useIsClient } from "./useIsClient";

/**
 * Types `aliasText` out one character at a time once the page is interactive,
 * then reports `done` after a short pause. Returns the visible text and whether
 * the animation has finished.
 */
export function useTypedAlias(
  aliasText: string | undefined,
  enabled: boolean | undefined,
) {
  const [typing, setTyping] = useState(false);
  const [alias, setAlias] = useState("");
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const isMounted = useIsClient();

  const typeAlias = useCallback(() => {
    if (!aliasText) return;

    if (typing && index < aliasText.length) {
      const timeoutId = setTimeout(() => {
        setAlias((prev) => prev + aliasText[index]);
        setIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeoutId);
    }

    if (typing && index >= aliasText.length && !done) {
      const timeoutId = setTimeout(() => setDone(true), 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [aliasText, typing, index, done]);

  // A new alias restarts the animation. Without this the counters only ever
  // grow, so shortening the alias leaves the visible text longer than the
  // value it is supposed to be spelling out — and `done` latches the second
  // branch off, so nothing recovers it. Reset while rendering, not in an
  // effect, so the stale text never paints.
  const [typedFor, setTypedFor] = useState(aliasText);
  if (typedFor !== aliasText) {
    setTypedFor(aliasText);
    setAlias("");
    setIndex(0);
    setDone(false);
  }

  useEffect(() => {
    if (!enabled) return;

    // `typeAlias` returns the clearTimeout for the step it scheduled;
    // dropping it leaves timers running against a stale index.
    return typeAlias();
  }, [enabled, typeAlias]);

  useEffect(() => {
    if (enabled && isMounted) {
      const timeoutId = setTimeout(() => setTyping(true), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isMounted, enabled]);

  return { alias, done };
}
