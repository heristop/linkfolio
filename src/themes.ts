import type { ThemeColors } from "./types";

export type ThemePresetKey = "teal" | "ocean" | "forest" | "sunset" | "mauve";

export type ThemePreset = {
  label: string;
  theme: ThemeColors;
  darkTheme: ThemeColors;
};

/**
 * Every preset is generated from one lightness recipe with a different hue, so
 * they all land at the same contrast rather than being tuned by eye: text near
 * L 0.40 on a card near L 0.98 in light mode, L 0.88 on L 0.225 in dark mode.
 *
 * Dark surfaces hold almost no chroma so none of the presets reads as a
 * coloured background; the hue separating one preset from another is carried
 * by the accents.
 *
 * `teal` follows the same recipe at the stylesheet's hue, so it is close to
 * the shipped default but not identical to it — the recipe carries slightly
 * more chroma in the backgrounds (0.02 against 0.01).
 */
function preset(label: string, hue: number, accentHue: number): ThemePreset {
  return {
    label,
    theme: {
      "color-primary": `oklch(0.4 0.06 ${hue})`,
      "color-secondary": `oklch(0.56 0.06 ${accentHue})`,
      "color-background-start": `oklch(0.9 0.02 ${hue})`,
      "color-background-end": `oklch(0.93 0.02 ${accentHue})`,
      "lf-card-bg": `oklch(0.98 0.005 ${hue})`,
      "lf-description-color": `oklch(0.44 0.02 ${hue})`,
    },
    darkTheme: {
      "color-primary": `oklch(0.88 0.022 ${hue})`,
      "color-secondary": `oklch(0.76 0.05 ${accentHue})`,
      "color-background-start": `oklch(0.165 0.006 ${hue})`,
      "color-background-end": `oklch(0.19 0.008 ${accentHue})`,
      "lf-card-bg": `oklch(0.225 0.008 ${hue})`,
      "lf-card-border": "1px solid oklch(1 0 0 / 0.08)",
      "lf-alias-color": `oklch(0.78 0.008 ${hue})`,
      "lf-description-color": `oklch(0.8 0.01 ${hue})`,
      "lf-network-hover-bg": "oklch(1 0 0 / 0.05)",
    },
  };
}

export const THEME_PRESETS: Record<ThemePresetKey, ThemePreset> = {
  teal: preset("Teal", 185, 170),
  ocean: preset("Ocean", 240, 250),
  forest: preset("Forest", 150, 140),
  sunset: preset("Sunset", 45, 25),
  mauve: preset("Mauve", 320, 340),
};

export const THEME_PRESET_KEYS = Object.keys(THEME_PRESETS) as ThemePresetKey[];
