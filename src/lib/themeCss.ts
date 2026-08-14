import type React from "react";
import type { ThemeColors, UserConfigType } from "../types";
import { isSafeCssIdentifier, isSafeCssValue } from "./sanitize";
import { THEME_PRESETS } from "../themes";

/** Theme variables that also apply to the page background, outside the card. */
const ROOT_SCOPED_VARS = new Set([
  "color-background-start",
  "color-background-end",
]);

/**
 * `themePreset` names one of the bundled palettes; `theme`/`darkTheme` still
 * win where set, so a preset can be adopted and then adjusted.
 *
 * Merged per key rather than per object: overriding one colour of a preset
 * should adjust that colour, not drop the rest of the palette back to the
 * stylesheet defaults.
 */
export function resolveTheme(config: UserConfigType): {
  theme?: ThemeColors;
  darkTheme?: ThemeColors;
} {
  const preset = config.themePreset
    ? THEME_PRESETS[config.themePreset]
    : undefined;

  return {
    theme: merge(preset?.theme, config.theme),
    darkTheme: merge(preset?.darkTheme, config.darkTheme),
  };
}

function merge(
  base: ThemeColors | undefined,
  overrides: ThemeColors | undefined,
): ThemeColors | undefined {
  if (!base) return overrides;
  if (!overrides) return base;

  return { ...base, ...overrides };
}

export function buildLightStyle(
  config: UserConfigType,
  theme?: ThemeColors,
): React.CSSProperties | undefined {
  const style: Record<string, string> = {};

  if (config.themeColor && isSafeCssValue(config.themeColor)) {
    style["--color-primary"] = config.themeColor;
  }

  if (theme) {
    for (const [key, value] of Object.entries(theme)) {
      if (isSafeCssIdentifier(key) && isSafeCssValue(value)) {
        style[`--${key}`] = value;
      }
    }
  }

  return Object.keys(style).length > 0
    ? (style as React.CSSProperties)
    : undefined;
}

/** Declarations for the variables the page background reads, not just the card. */
function rootDeclarations(theme: ThemeColors | undefined): string[] {
  if (!theme) return [];

  return Object.entries(theme)
    .filter(
      ([key, value]) =>
        ROOT_SCOPED_VARS.has(key) &&
        isSafeCssIdentifier(key) &&
        isSafeCssValue(value),
    )
    .map(([key, value]) => `--${key}: ${value};`);
}

export function buildThemeCss(
  theme?: ThemeColors,
  darkTheme?: ThemeColors,
): string {
  const rules: string[] = [];

  // Inline styles on the card cannot reach <html>, where the page gradient is
  // painted, so the background variables are emitted as real rules instead.
  const lightRoot = rootDeclarations(theme);
  if (lightRoot.length > 0) rules.push(`:root { ${lightRoot.join(" ")} }`);

  const cardDecls: string[] = [];

  for (const [key, value] of Object.entries(darkTheme ?? {})) {
    // These land in a raw <style> tag, where an unchecked value could close
    // the rule and inject arbitrary CSS.
    if (!isSafeCssIdentifier(key) || !isSafeCssValue(value)) continue;

    // The light palette is an inline style on the card, and no author rule
    // outranks one. Without `!important` here every variable a config sets in
    // both palettes — which is every variable a `themePreset` sets — keeps its
    // light value in dark mode, and the card stays light on a dark page. The
    // light values stay inline so two differently-themed cards on one page do
    // not overwrite each other.
    cardDecls.push(`--${key}: ${value} !important;`);
  }

  if (cardDecls.length > 0) {
    rules.push(`.dark .lf-card { ${cardDecls.join(" ")} }`);
  }

  const darkRoot = rootDeclarations(darkTheme);
  if (darkRoot.length > 0) rules.push(`.dark { ${darkRoot.join(" ")} }`);

  return rules.join(" ");
}
