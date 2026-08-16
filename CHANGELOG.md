# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Entries before 3.0.0 were reconstructed from git history, so they summarise
> each release rather than list every change. Two caveats worth knowing when
> reading them: the `0.x` and `1.0.0` tags point into a history that was later
> rewritten and are no longer ancestors of `main`; and the tag names drifted
> from the versions actually published, so headings below follow the npm
> versions. See [Release tagging](#release-tagging).

## [3.1.1] - 2026-08-16

A rendering fix for `layout: "bento"`, scoped to cards carrying
`direction: "horizontal"`. Nothing else moves: stacked tiles and the classic
layout render identically, and no config change is required.

### Added

- **`--lf-bento-tile-bg` and `--lf-bento-tile-hover-bg`.** The surface behind a
  horizontal card, and the tint it takes on hover. Both are mixed from
  `--color-primary` rather than being a fixed grey, so they follow whichever
  palette is set in either mode, and both are settable from `theme`/`darkTheme`
  as well as from a stylesheet.

### Fixed

- **A horizontal card's picture no longer collapses.** The rules that give a
  social mark its stacked shape — a 16:9 box, the stacked `max-width`, and a
  wrapper that sizes to content — out-specified the horizontal ones, so beside
  text the picture rendered about 60px wide inside the 40% of the row it had
  been given. Those rules are now scoped to stacked cards explicitly instead of
  being out-specified in turn, which also stops the next horizontal rule from
  having to win a specificity race to be seen.
- **A horizontal caption stays inside its cell.** A bento cell is a fixed
  height and the caption is the one part of a card that can exceed it. On a
  phone a description wrapping to three lines measured 144px inside a 104px
  cell, and the overflow did not clip — it painted over the tiles above and
  below it. The row now hides its overflow, the description clamps to two lines
  with an ellipsis, and under 768px the title and description step down a size
  so both fit the shorter row.
- **A horizontal card reads as one link at rest.** 3.1.0 centred the picture
  and caption to close the gap between them; with a short caption the gap
  remained, and the only thing grouping the two halves was the hover tint,
  which is no help until the pointer is already on the card. The card now
  carries a resting surface and hover deepens that same tint rather than
  introducing it.

## [3.1.0] - 2026-08-15

No config change is required and nothing is removed. One visible difference
without any action on your part: cards now enter at a pace set by how many
of them there are, so a short list cascades where it used to appear at once.
A visual-regression suite that captures the reveal mid-flight will notice.

### Added

- **The card reveal paces itself to the number of cards.** The stagger between
  arriving cards is derived from how many arrived rather than fixed, so a group
  of four cascades as visibly as a group of twelve. A fixed step read as a ramp
  across a long list and as nothing at all across a short one: five cards at
  45ms finished inside 180ms, well within the 500ms each card spends fading, so
  they effectively appeared together. Clamped at both ends — a ceiling so a
  two-card group is not held apart, a floor so a long list does not crawl.
- **`--lf-name-font-family` and `--lf-title-font-family`.** The profile heading
  and the card titles were the only text in the component with no way to set a
  typeface, so every site wanting a display face reached past the theme and
  wrote CSS. Both default to `inherit`, so an existing deployment renders
  identically, and both are settable from `theme`/`darkTheme` as well as from a
  stylesheet. One family covers every card title: a site that wants a display
  face on project cards but not on the small uppercase social labels still
  needs a rule of its own.

### Fixed

- **The reveal failsafe cascades instead of dumping every card at once.** Two
  paths can reveal a card: the intersection observer, which assigns each one a
  delay, and a sweep that runs if the observer never fires. The sweep revealed
  without assigning anything, so every card it caught landed on the same frame
  with no stagger — the same page animating differently from one load to the
  next depending on which path won. Both now share one implementation.
- **`linkfolio/dist/assets` resolves again.** 3.0.0 introduced an `exports` map,
  and a package with one no longer does directory resolution: `./dist/*` maps
  paths literally, so `linkfolio/dist/assets` stopped finding
  `dist/assets/index.ts` and every template fork importing its icons failed to
  typecheck. The old path is mapped explicitly again, and `linkfolio/assets`
  and `linkfolio/assets/globals.css` are added as the names to prefer.
  (Carried from 3.0.1, which was prepared but never published.)
- **A horizontal bento tile centres its picture and caption** instead of
  pinning them to opposite edges of a cell wider than the pair needs, where the
  gap between them read as two unrelated things sharing a box.

## [3.0.0] - 2026-08-15

A major release: three changes below alter what the package accepts, so an
install that resolves `^2.x` will not pick this up on its own.

### Breaking changes

- **`next` peer range narrows to `^16.0.0`** (was `^15.0.0 || ^16.0.0`). Next 15
  is no longer supported; upgrade the host app first.
- **`engines` now requires Node `>=20.0.0`.** Node 18 is out — it is also past
  its own end of life, and Next 16 itself requires 20.9+.
- **The `beam` analytics provider is gone.** `provider: "beam"` no longer
  typechecks. See _Removed_ for why, and for how to restore it in your own app
  in three lines.

Rendered output changes too — the dark palette, the social tile aspect ratio and
the mobile column count all move. Nothing about that is a code change on your
side, but a visual-regression suite will notice. See _Changed_.

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
  overrides, shipping with a zen green dark palette (retuned in 3.0.0).
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

Tagging `3.0.0` on the release commit, with `package.json` matching, brings the
two back into step.

[3.1.1]: https://github.com/heristop/linkfolio/compare/3.1.0...3.1.1
[3.1.0]: https://github.com/heristop/linkfolio/compare/3.0.0...3.1.0
[3.0.0]: https://github.com/heristop/linkfolio/compare/2.2.3...3.0.0
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
