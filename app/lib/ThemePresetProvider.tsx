"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

export function ThemePresetProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Starts at the default on both sides of hydration — reading storage during
  // the first render would render different markup on the client than the
  // server sent. The page is already showing the stored palette by then: the
  // boot script applied it before first paint, so this only catches React up.
  const [preset, setPresetState] = useState<ThemePresetKey>(DEFAULT_PRESET);

  useEffect(() => {
    const stored = globalThis.localStorage.getItem(PRESET_STORAGE_KEY);

    if (isThemePresetKey(stored)) setPresetState(stored);
  }, []);

  const setPreset = useCallback((key: ThemePresetKey) => {
    setPresetState(key);
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
