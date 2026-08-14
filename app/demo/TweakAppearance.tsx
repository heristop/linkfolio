"use client";

import { FIELD_LEGEND_CLASS, OPTION_ROW_CLASS, ringStyle } from "./tweakStyles";
import {
  FONT_KEYS,
  FONTS,
  PALETTES,
  PALETTE_KEYS,
  swatchOf,
  type FontKey,
  type PaletteKey,
} from "./useTweakState";

type Props = {
  palette: PaletteKey;
  setPalette: (key: PaletteKey) => void;
  font: FontKey;
  setFont: (key: FontKey) => void;
};

/**
 * Palette and font share one control pattern, so they share one file: a
 * column of identical rows where selection moves a ring on the preview glyph
 * and the label's weight, never the row itself. Five palettes never divide
 * evenly into a grid without stranding one, and a list has no orphan to
 * strand.
 */
export default function TweakAppearance({
  palette,
  setPalette,
  font,
  setFont,
}: Readonly<Props>) {
  return (
    <>
      <fieldset>
        <legend className={FIELD_LEGEND_CLASS}>Palette</legend>
        <div className="flex flex-col gap-1.5">
          {PALETTE_KEYS.map((key) => {
            const isSelected = palette === key;
            const swatch = swatchOf(key);

            return (
              <label key={key} className={OPTION_ROW_CLASS}>
                <input
                  type="radio"
                  name="palette"
                  value={key}
                  checked={isSelected}
                  onChange={() => setPalette(key)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="relative h-6 w-6 shrink-0 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${swatch.from}, ${swatch.to})`,
                    boxShadow: ringStyle(isSelected),
                  }}
                >
                  <span
                    className="absolute inset-[30%] rounded-full"
                    style={{ background: swatch.dot }}
                  />
                </span>
                <span
                  className={
                    isSelected ? "font-semibold text-primary" : undefined
                  }
                >
                  {PALETTES[key].label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={FIELD_LEGEND_CLASS}>Font</legend>
        {/* Each glyph renders in the font it switches to. System stacks only —
            no font file ships in the package, and the change is scoped to the
            card preview below, never the page. */}
        <div className="flex flex-col gap-1.5">
          {FONT_KEYS.map((key) => {
            const isSelected = font === key;

            return (
              <label key={key} className={OPTION_ROW_CLASS}>
                <input
                  type="radio"
                  name="font"
                  value={key}
                  checked={isSelected}
                  onChange={() => setFont(key)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/20 text-xs"
                  style={{
                    fontFamily: FONTS[key].stack,
                    boxShadow: ringStyle(isSelected),
                  }}
                >
                  Aa
                </span>
                <span
                  className={
                    isSelected ? "font-semibold text-primary" : undefined
                  }
                >
                  {FONTS[key].label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </>
  );
}
