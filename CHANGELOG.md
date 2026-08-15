# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Entries before 2.4.0 were reconstructed from git history, so they summarise
> each release rather than list every change. Two caveats worth knowing when
> reading them: the `0.x` and `1.0.0` tags point into a history that was later
> rewritten and are no longer ancestors of `main`; and the tag names drifted
> from the versions actually published, so headings below follow the npm
> versions. See [Release tagging](#release-tagging).

## [2.4.0] - unreleased

Rendered output changes (see _Changed_), and one provider is gone (see
_Removed_) — together with the narrowed `next` peer range and the `engines`
floor, that makes this release breaking for some consumers despite the minor
version. See [Release tagging](#release-tagging).

### Added

- **Subpath exports.** The package now declares an `exports` map with
  `linkfolio` (components), `linkfolio/seo` (`buildMetadata`, `buildJsonLd`) and
  `linkfolio/themes`. Server components can build metadata and JSON-LD without
  pulling in the client bundle. `./dist/*` stays reachable for anything not yet
  promoted to a named entry.
- **Bento layout.** `layout: "bento"` merges every group into one mosaic grid,
  sizing each tile from the `group` a link already declares. A link can override
  with `span` (`"1x1"` … `"2x3"`, read as columns × rows) and `direction`
  (`"vertical" | "horizontal"`). New types: `LayoutMode`, `BentoSpan`,
  `BentoDirection`.
- **Theme presets.** `themePreset` selects one of five bundled palettes — teal,
  ocean, forest, sunset, mauve — generated from a single lightness recipe so
  they share contrast rather than being tuned by eye. Exported as
  `THEME_PRESETS` / `THEME_PRESET_KEYS` with `ThemePreset` / `ThemePresetKey`.
  `theme` and `darkTheme` still win per key, so a preset can be adopted and then
  adjusted.
- **Analytics.** An `analytics` config block with pluggable providers, plus
  `registerAnalyticsAdapter`, `resolveAnalyticsAdapter`, `emitAnalyticsEvent`,
  `buildLinkClickEvent`, and the `LINKFOLIO_ANALYTICS_EVENT` /
  `LINK_CLICK_EVENT` constants. Link clicks can be tracked through
  `trackLinkClicks`, `linkClickEvent` and `onLinkClick`. Types:
  `AnalyticsAdapter`, `AnalyticsConfig`, `AnalyticsEvent`,
  `AnalyticsProviderName`, `AnalyticsScript`.
- **Motion as configuration.** The interaction styles read their timing from
  custom properties a config can set: `lf-motion-fast` / `-base` / `-slow` /
  `-reveal`, `lf-ease-out`, `lf-ease-spring`, `lf-press-scale`,
  `lf-press-scale-sm`, `lf-hover-lift`, `lf-hover-scale`. For a fully static
  build, set `lf-hover-lift` to `"0px"` and both press scales to `"1"`.
- **Embedding props.** `headingLevel`, `renderChrome` and `renderJsonLd` let
  `LinkFolio` sit on a page that already owns its heading or structured data.
- **SEO configuration.** `siteUrl`, `keywords`, `lang`, `locale`, `jobTitle` and
  `worksFor` feed the generated metadata and JSON-LD.
- **Public config types.** `UserConfigType` and `SocialNetworkType` are exported,
  so a consumer can type its own config file against the package.

### Changed

- **Dark mode is near-neutral.** Dark surfaces previously carried enough chroma
  to read as a colour; they now sit at or below 0.008 chroma — tinted charcoal
  rather than a wash — and accents stay muted at ~0.05. Surface and accent hues
  are kept in one family instead of ~100° apart. This applies to the stylesheet
  default and to every preset. Text/background contrast only improved.
- **Social tiles take the artwork's ratio.** The logo tile is now 16:9, matching
  the shipped brand assets, so the picture fills it edge to edge with neither
  cropping nor letterboxing at any column width. Website and project tiles are
  banners and still fill their card.
- **The classic layout uses two columns on phones** (was three), matching the
  bento grid at the same widths — three 16:9 tiles across a phone left each too
  narrow for a wordmark to stay readable.
- **One motion contract for pressable surfaces.** `.lf-cta` / `.lf-cta-ghost`
  own hover lift, press scale, easing and cursor, replacing per-element
  definitions that had drifted to three different press scales and two hover
  idioms.
- **The card gutter is enforced by `max-width`** rather than a margin, so
  centring can no longer cancel it.

### Removed

- **The `beam` analytics provider.** Beam's only browser event API takes a path
  rather than a named event with parameters, so it could never report which
  link a visitor clicked — it recorded page views and nothing else, while
  sitting in the provider union as though it were equivalent to the others.
  `registerAnalyticsAdapter("beam", …)` still works if you want it back.

### Fixed

- Wordmark logos (Facebook, Mastodon, WhatsApp) were cropped at the sides in
  both layouts: 16:9 artwork was being `cover`-fitted into a near-square tile.
- The card's horizontal gutter collapsed from 36.5px to 20.5px at exactly the
  `lg` breakpoint, because `lg:mx-auto` replaced the horizontal half of
  `sm:m-4`. Most visible at 1024×1366 (iPad Pro portrait).
- The streaming placeholder reused `.lf-links`, the real nav's class, so any
  stylesheet rule or test selector for it matched two elements — one of them a
  stand-in.
- In bento, a link with an explicit `span` larger than `1x1` now fills its cell
  instead of leaving a void, and every caption stays attached to its picture
  rather than drifting to the cell's bottom edge.
- Keyboard users could not reach the horizontally scrolling code block in the
  documentation (`scrollable-region-focusable`).

## [2.3.0] – [2.3.2] - 2026-04-03

- Added `theme` and `darkTheme` config objects for programmatic colour
  overrides, shipping with a zen green dark palette (retuned in 2.4.0).
- Made the button opacity and the accent line colour configurable for the dark
  theme.

## [2.2.0] – [2.2.2] - 2026-04-03

- Added dark mode, transitioned with the View Transition API.
- Added a share button and a QR code modal.
- Added dynamic Open Graph image generation, using the avatar and theme colours.
- Migrated the styles to a Tailwind-first approach built on `oklch` colours.
- Fixed two rounds of accessibility problems: contrast ratios on the footer and
  card, and `aria-label` accuracy.

## [2.1.0] - 2026-04-03

Published between 2.0.0 and 2.2.0. The commits in this range are folded into the
neighbouring entries; no separate tag records its contents.

## [2.0.0] - 2026-04-03

- Reworked the styling API around CSS custom properties, `data-group`
  attributes and grouped link sections — the basis every later theming feature
  builds on.
- Added `project` and `website` groups to the default config template, with
  banner images for each.
- Refined the CSS variables, animations and hover effects.
- Stopped shipping sourcemaps and started copying `.webp` assets into the
  package.
- Added package-asset assertions to the test suite.

## [1.1.1] - 2026-04-02

- Improved accessibility and design, UI animations and transitions, and SEO
  metadata.
- Migrated the build from `tsup` to `tsdown`.
- Upgraded to Next 16 and patched RSC CVEs.

## [1.0.0] - 2025-10-11

- Upgraded to Next 15 and Tailwind 4.
- Added more component-level customization and updated the default style.
- Added link filtering to the config.

## [0.6.0] - 2024-05-15

- Updated the bundled logos.

## [0.5.0] - 2024-05-15

- Enhanced the social network animation and updated the theme font.

## [0.4.0] - 2024-05-03

- Added the typing (typewriter) config option.

## [0.3.0] - 2024-04-13

- Upgraded to Next 14.
- Added analytics to the layout and fixed the SEO icon links.
- Renamed the user config file and started shipping all assets in the package.
- Added snapshot testing.

## [0.2.9] - 2023-10-30

First tagged release: the link-in-bio page, packaged with `tsup`, with a
typewriter profile effect, hover animations and Playwright running in CI.

## Release tagging

Two inconsistencies exist in the published history, recorded here so the table
above can be trusted:

- **Tags drifted from `package.json`.** Tag `1.1.1` holds version `1.1.0`, tag
  `2.2.2` holds `2.2.0`, and tag `2.2.3` holds `2.3.2`. The headings above
  follow the versions published to npm — `1.1.1`, `2.0.0`, `2.1.0`, `2.2.0`,
  `2.2.1`, `2.2.2`, `2.3.0`, `2.3.1`, `2.3.2` — not the tag names.
- **Five releases were never tagged**: `2.1.0`, `2.2.1`, `2.3.0`, `2.3.1` and
  `2.3.2`.
- **The `0.x` and `1.0.0` tags predate a history rewrite** and are not ancestors
  of `main`. Their contents are summarised above from the pre-rewrite chain.

Tagging `2.4.0` on the release commit, with `package.json` matching, brings the
two back into step.

[2.4.0]: https://github.com/heristop/linkfolio/compare/2.2.3...HEAD
[2.3.0]: https://github.com/heristop/linkfolio/compare/2.2.2...2.2.3
[2.3.2]: https://github.com/heristop/linkfolio/releases/tag/2.2.3
[2.2.0]: https://github.com/heristop/linkfolio/compare/2.0.0...2.2.2
[2.2.2]: https://github.com/heristop/linkfolio/releases/tag/2.2.2
[2.1.0]: https://github.com/heristop/linkfolio/compare/2.0.0...2.2.2
[2.0.0]: https://github.com/heristop/linkfolio/compare/1.1.1...2.0.0
[1.1.1]: https://github.com/heristop/linkfolio/releases/tag/1.1.1
[1.0.0]: https://github.com/heristop/linkfolio/releases/tag/1.0.0
[0.6.0]: https://github.com/heristop/linkfolio/releases/tag/0.6.0
[0.5.0]: https://github.com/heristop/linkfolio/releases/tag/0.5.0
[0.4.0]: https://github.com/heristop/linkfolio/releases/tag/0.4.0
[0.3.0]: https://github.com/heristop/linkfolio/releases/tag/0.3.0
[0.2.9]: https://github.com/heristop/linkfolio/releases/tag/0.2.9
