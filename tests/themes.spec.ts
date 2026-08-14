import { test, expect } from "@playwright/test";
import { THEME_PRESETS, THEME_PRESET_KEYS } from "../src/themes";
import { isSafeCssIdentifier, isSafeCssValue } from "../src/lib/sanitize";

test("preset keys and the preset map agree", () => {
  expect(THEME_PRESET_KEYS).toEqual(
    Object.keys(THEME_PRESETS) as typeof THEME_PRESET_KEYS,
  );
  expect(THEME_PRESET_KEYS.length).toBeGreaterThan(0);
});

test("every preset ships a label and both palettes", () => {
  for (const key of THEME_PRESET_KEYS) {
    const preset = THEME_PRESETS[key];

    expect(preset.label.length, key).toBeGreaterThan(0);
    expect(Object.keys(preset.theme).length, key).toBeGreaterThan(0);
    expect(Object.keys(preset.darkTheme).length, key).toBeGreaterThan(0);
  }
});

/**
 * LinkFolio silently drops any variable that fails the CSS guards before it
 * reaches the <style> tag, so an unsafe value in a bundled preset would not
 * error — the palette would just quietly lose colours.
 */
test("every preset value survives the CSS sanitiser guards", () => {
  for (const key of THEME_PRESET_KEYS) {
    const { theme, darkTheme } = THEME_PRESETS[key];

    for (const [name, value] of [
      ...Object.entries(theme),
      ...Object.entries(darkTheme),
    ]) {
      expect(isSafeCssIdentifier(name), `${key}/${name}`).toBe(true);
      expect(isSafeCssValue(value), `${key}/${name}`).toBe(true);
    }
  }
});

test("both palettes drive the page background, not just the card", () => {
  for (const key of THEME_PRESET_KEYS) {
    const { theme, darkTheme } = THEME_PRESETS[key];

    // These are the only variables LinkFolio hoists to :root / .dark — a
    // preset missing them would restyle the card but leave the stylesheet's
    // default gradient behind it.
    for (const palette of [theme, darkTheme]) {
      expect(palette["color-background-start"], key).toBeTruthy();
      expect(palette["color-background-end"], key).toBeTruthy();
    }
  }
});

const hueOf = (value: string | undefined) =>
  value?.match(/oklch\([\d.]+ [\d.]+ ([\d.]+)\)/)?.[1];

test("light and dark palettes of a preset stay in the same hue family", () => {
  for (const key of THEME_PRESET_KEYS) {
    const { theme, darkTheme } = THEME_PRESETS[key];

    expect(hueOf(theme["color-primary"]), key).toBeDefined();
    expect(hueOf(darkTheme["color-primary"]), key).toBe(
      hueOf(theme["color-primary"]),
    );
  }
});
