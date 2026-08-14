"use client";

import { useEffect, useRef, useState } from "react";

const CONFIRMATION_MS = 2000;

/**
 * Copies text, and reports it as copied for a moment afterwards.
 *
 * Two things go wrong when this is written per button. `navigator.clipboard`
 * is undefined outside a secure context — a self-hosted page on plain http is
 * the ordinary case here — so an unguarded call throws from inside a click
 * handler and the button goes dead with nothing on screen to explain it. And a
 * confirmation timer that is not cleared before re-arming lets the first
 * copy's timer cancel the second copy's confirmation.
 *
 * `copied` holds the key of the last successful copy, so one hook can drive a
 * group of buttons.
 */
export function useCopyToClipboard<K = boolean>() {
  const [copied, setCopied] = useState<K | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy(text: string, key: K): Promise<void> {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), CONFIRMATION_MS);
    } catch {
      // Permission denied: degrade silently. The text is on screen either way.
    }
  }

  return { copied, copy };
}
