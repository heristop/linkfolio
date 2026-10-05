"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { ThemePresetKey } from "@/themes";
import {
  applyPresetCss,
  DEFAULT_PRESET,
  isThemePresetKey,
  PRESET_STORAGE_KEY,
} from "./themePreset";

type ThemePresetValue = {
  preset: ThemePresetKey;
  setPreset: (key: ThemePresetKey) => void;
};

const ThemePresetContext = createContext<ThemePresetValue | undefined>(
  undefined,
);

function readStoredPreset(): ThemePresetKey {
  try {
    const stored = globalThis.localStorage.getItem(PRESET_STORAGE_KEY);
    return isThemePresetKey(stored) ? stored : DEFAULT_PRESET;
  } catch {
    // Storage can be unavailable (privacy settings); fall back to the default.
    return DEFAULT_PRESET;
  }
}

// Another tab picking a palette updates this one too.
function subscribeToStorage(onChange: () => void) {
  globalThis.addEventListener("storage", onChange);
  return () => globalThis.removeEventListener("storage", onChange);
}

export function ThemePresetProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The server snapshot is the default, so hydration renders the same markup
  // the server sent; the client snapshot then reads storage. The page is
  // already showing the stored palette by then: the boot script applied it
  // before first paint, so this only catches React up.
  const stored = useSyncExternalStore(
    subscribeToStorage,
    readStoredPreset,
    () => DEFAULT_PRESET,
  );
  const [chosen, setChosen] = useState<ThemePresetKey | null>(null);
  const preset = chosen ?? stored;

  const setPreset = useCallback((key: ThemePresetKey) => {
    setChosen(key);
    applyPresetCss(key);

    try {
      globalThis.localStorage.setItem(PRESET_STORAGE_KEY, key);
    } catch {
      // Private browsing and full quotas both throw here. The palette still
      // applies for this page view; only carrying it to the next one is lost.
    }
  }, []);

  const value = useMemo(() => ({ preset, setPreset }), [preset, setPreset]);

  return <ThemePresetContext value={value}>{children}</ThemePresetContext>;
}

export function useThemePreset(): ThemePresetValue {
  const value = useContext(ThemePresetContext);

  if (!value) {
    throw new Error("useThemePreset must be used within a ThemePresetProvider");
  }

  return value;
}
