import { isSafeCssIdentifier, isSafeCssValue } from "@/lib/sanitize";
import {
  THEME_PRESETS,
  THEME_PRESET_KEYS,
  type ThemePresetKey,
} from "@/themes";
import type { ThemeColors } from "@/types";

/**
 * The palette the tweak panel picks is a property of the visit, not of one
 * route: a visitor who chooses Sunset on /demo expects /docs and the status
 * pages to follow. `LinkFolio` themes its own card wherever it renders, which
 * covers /demo alone — these rules carry the same palette to the document, so
 * every page inherits it.
 */
export const PRESET_STORAGE_KEY = "linkfolio:preset";

export const PRESET_STYLE_ID = "lf-preset-css";

export const DEFAULT_PRESET: ThemePresetKey = "teal";

export function isThemePresetKey(value: unknown): value is ThemePresetKey {
  return (
    typeof value === "string" && (THEME_PRESET_KEYS as string[]).includes(value)
  );
}

/** Same sanitising the package applies before writing a raw <style> tag. */
function declarations(theme: ThemeColors): string {
  return Object.entries(theme)
    .filter(([key, value]) => isSafeCssIdentifier(key) && isSafeCssValue(value))
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");
}

/**
 * `.dark` comes second: it matches `:root` on specificity, so source order is
 * what decides, and both rules are unlayered — which is what lets them win
 * against the stylesheet's own `@layer base` defaults.
 */
export function presetCss(key: ThemePresetKey): string {
  const preset = THEME_PRESETS[key];

  return `:root { ${declarations(preset.theme)} } .dark { ${declarations(preset.darkTheme)} }`;
}

const PRESET_CSS = Object.fromEntries(
  THEME_PRESET_KEYS.map((key) => [key, presetCss(key)]),
) as Record<ThemePresetKey, string>;

export function applyPresetCss(key: ThemePresetKey): void {
  let element = document.querySelector<HTMLStyleElement>(`#${PRESET_STYLE_ID}`);

  if (!element) {
    element = document.createElement("style");
    element.id = PRESET_STYLE_ID;
    document.head.append(element);
  }

  element.textContent = presetCss(key);
}

/**
 * Runs before first paint, so a stored palette is already on the page rather
 * than swapping in after hydration. Every preset's CSS is inlined because the
 * script cannot import at that point; it is a few kB of static text.
 */
export const PRESET_BOOT_SCRIPT = `(function(){try{var k=localStorage.getItem(${JSON.stringify(
  PRESET_STORAGE_KEY,
)});var m=${JSON.stringify(PRESET_CSS)};if(k&&m[k]){var s=document.createElement("style");s.id=${JSON.stringify(
  PRESET_STYLE_ID,
)};s.textContent=m[k];document.head.appendChild(s);}}catch(e){}})();`;
