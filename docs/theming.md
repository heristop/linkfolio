# Theming

Presets, colour tokens and motion tokens for restyling the component.

## Theme presets

`themePreset` picks one of five bundled palettes — `teal`, `ocean`, `forest`, `sunset` and `mauve`. Each is generated from a single lightness recipe with a different hue, so they land at the same contrast instead of being tuned by eye, and each ships a light and a dark palette.

```ts
const userConfig: UserConfig = {
  themePreset: "sunset",
  // `theme` and `darkTheme` still win per key, so a preset can be
  // adopted and then adjusted rather than replaced wholesale.
  darkTheme: { "color-secondary": "oklch(0.78 0.05 30)" },
};
```

The presets are exported too, if you want to read their values or build a picker:

```ts
import { THEME_PRESETS, THEME_PRESET_KEYS } from "linkfolio";
```

## Theme tokens

Every colour, size and typeface the component uses is a CSS custom property.
Set them from the config, where they apply to the light and dark palettes
independently:

```ts
const userConfig: UserConfig = {
  theme: {
    "color-primary": "oklch(0.4 0.06 280)",
    "lf-card-bg": "oklch(0.99 0.005 280)",
    "lf-name-font-family": "Georgia, serif",
  },
  darkTheme: { "lf-card-bg": "oklch(0.22 0.01 280)" },
};
```

…or as plain CSS, which is the easier route when the value refers to something
the config cannot see, such as a `next/font` variable:

```css
@theme {
  --lf-name-font-family: var(--font-display), Georgia, serif;
  --lf-title-font-family: var(--font-display), Georgia, serif;
}
```

| Token group | Tokens                                                                                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette     | `color-primary`, `color-secondary`, `color-background-start`, `color-background-end`                                                                                                                       |
| Card        | `lf-card-bg`, `lf-card-radius`, `lf-card-shadow`, `lf-card-border`, `lf-card-padding-x`, `lf-card-padding-y`, `lf-card-min-height`, `lf-card-backdrop`                                                     |
| Profile     | `lf-name-color`, `lf-name-font-size`, `lf-name-font-weight`, `lf-name-font-family`, `lf-alias-color`, `lf-profile-margin-bottom`, `lf-accent-line-color`, `lf-accent-line-width`, `lf-accent-line-opacity` |
| Cards       | `lf-title-font-family`, `lf-description-color`, `lf-network-hover-bg`                                                                                                                                      |
| Layout      | `lf-links-gap-x`, `lf-links-gap-y`, `lf-links-padding-x`, `lf-bento-columns`, `lf-bento-row`, `lf-bento-tile-bg`, `lf-bento-tile-hover-bg`                                                                 |
| Motion      | `lf-motion-fast`, `lf-motion-base`, `lf-motion-slow`, `lf-motion-reveal`, `lf-ease-out`, `lf-ease-spring`, `lf-press-scale`, `lf-press-scale-sm`, `lf-hover-lift`, `lf-hover-scale`                        |
| Chrome      | `lf-button-opacity`, `lf-footer-opacity`                                                                                                                                                                   |

`lf-name-font-family` and `lf-title-font-family` default to `inherit`, so the
body face applies until you name another. They exist because a typeface was
the one thing the theme could not express — a display font previously required
writing CSS against `.lf-name` and `.lf-title` directly.

## Motion tokens

Motion is themeable the same way colour is. Every value below is a CSS custom
property the interaction styles consume, so you can retune the feel — or remove
it entirely — without forking the stylesheet. All of them are also typed on
`ThemeColors`, so they work through the `theme` and `darkTheme` config keys.

| Token                 | Default                          | Controls                    |
| --------------------- | -------------------------------- | --------------------------- |
| `--lf-motion-fast`    | `140ms`                          | Press-down feedback         |
| `--lf-motion-base`    | `220ms`                          | Hover, colour, opacity      |
| `--lf-motion-slow`    | `380ms`                          | Press release, settle       |
| `--lf-motion-reveal`  | `500ms`                          | Card entrance               |
| `--lf-ease-out`       | `cubic-bezier(0.32, 0.72, 0, 1)` | Standard deceleration       |
| `--lf-ease-spring`    | a sampled `linear()` spring      | Settle after a release      |
| `--lf-press-scale`    | `0.972`                          | Press depth on cards        |
| `--lf-press-scale-sm` | `0.94`                           | Press depth on icon buttons |
| `--lf-hover-lift`     | `-2px`                           | Card lift on hover          |
| `--lf-hover-scale`    | `1.08`                           | Icon button growth on hover |

Press-down is deliberately faster than release: the asymmetry is what makes the
interaction feel physical rather than scripted.

For a completely static build, flatten the amplitudes:

```css
@theme {
  --lf-hover-lift: 0px;
  --lf-hover-scale: 1;
  --lf-press-scale: 1;
  --lf-press-scale-sm: 1;
}
```

Visitors who set "reduce motion" in their OS already get a gentler treatment
automatically: transforms and entrance animations are dropped, while opacity
and colour transitions are kept short so a tap still visibly registers.

---

[← Back to the README](../README.md)
