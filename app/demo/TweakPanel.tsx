"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  Intro,
  NoFooter,
  Outro,
  SlidersIcon,
} from "./DemoSlots";
import { LinkFolio } from "@/index";
import { useCopyToClipboard } from "../lib/useCopyToClipboard";
import TweakAppearance from "./TweakAppearance";
import {
  BACK_LINK_CLASS,
  BUTTON_CLASS,
  CLUSTER_LABEL_CLASS,
  CONTROL_INPUT_CLASS,
  CONTROL_LABEL_CLASS,
  FIELD_LEGEND_CLASS,
  GHOST_BUTTON_CLASS,
  SEGMENT_LABEL_CLASS,
  SEGMENT_TEXT_CLASS,
  TEXT_INPUT_CLASS,
  TRIGGER_CLASS,
} from "./tweakStyles";
import {
  AVATAR_SIZES,
  FONTS,
  GROUPS,
  GROUP_LABELS,
  LAYOUTS,
  LAYOUT_LABELS,
  PALETTES,
  useTweakState,
} from "./useTweakState";

export default function TweakPanel() {
  const tweak = useTweakState();
  const { copied, copy } = useCopyToClipboard();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Escape closes the panel and hands focus back to the control that opened it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Outside pointer-down closes the panel. `pointerdown`, not `click`: a
  // drag starting inside the panel and releasing outside must not dismiss
  // it, and only `pointerdown` fires early enough to tell. "Outside" is
  // strict — panel and trigger are the only exclusions, the card is not —
  // so a click on the card the panel is editing closes it too. Trigger is
  // excluded so its own `onClick` toggle is the only thing that fires on a
  // trigger press: without this, pointerdown would close the panel first
  // and the click would immediately reopen it.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;

      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <>
      {/* Panel material. The surface is fully solid — no `backdrop-filter`
          alpha — because a dense, text-heavy control panel needs crisp
          edges every one of its rows can rely on, not a blurred material.
          The fill is anchored on `--lf-card-bg` (the elevated-surface
          token the demo card itself uses), not on the page background:
          every earlier pass mixed dark `--color-primary` ink INTO the
          page colour, which can only ever make the panel darker than the
          page — and on a light theme a surface darker than the page reads
          as heavy no matter how far the mix is dialled down (20%, 15%,
          and 10% were each rejected as "too dark" in turn). Elevation on
          a light page reads *lighter*, so the panel now sits between the
          page and its own controls in lightness: page (L≈0.90) < panel
          (≈0.93) < inputs/rows on `--lf-card-bg` (0.98) — a coherent
          three-step material hierarchy in which the controls still read
          as distinct pieces sitting on the panel. The 8% primary mix
          keeps a tint identity so the panel is not just "more card";
          separation from the page is carried by the lightness step plus
          the hairline and shadow, not by fill darkness.
          The border is ONE treatment on all four sides. The previous
          pass kept `.lf-glass`'s bright white top edge (a "light catching
          the glass" highlight) next to darker primary-tinted sides, and
          the owner flagged the mismatch — correctly: that highlight
          convention exists for *translucent* chrome, and a solid, opaque
          panel wearing a fake glass glint reads as a bug. Unified to a
          single primary-tinted hairline (shorthand `border`, so it also
          overrides `.lf-glass`'s per-side `border-top-color`).
          The elevation shadow lives here rather than inline so it can
          theme: the old inline `0 28px 80px -16px oklch(0 0 0 / 0.4)`
          halo — 3.3x the alpha of the light theme's own
          `--lf-card-shadow` — wrapped the panel in a broad dark fog that
          fused with the fill in screenshots and was a major contributor
          to "too dark" that four fill-only iterations never touched. In
          light mode it is now a soft 0.14-alpha lift; dark mode keeps a
          deeper halo (matching `--lf-card-shadow`'s own 0.12→0.4
          light→dark scaling), where a dark halo on a dark page adds
          depth, not murk.
          Contrast, measured by rasterizing the rendered colours through a
          canvas to real sRGB (not oklch L, which does not track WCAG):
          panel vs `--color-primary` text 7.37:1 light / 8.32:1 dark;
          panel vs `--lf-description-color` 7.54:1 light / 7.63:1 dark —
          comfortably above the 4.5:1 body-text floor in both themes.
          Panel vs `--color-background-start`: 1.10:1 lighter-than-page
          light / 1.31:1 lighter-than-page dark; the light-mode ratio is
          modest because both surfaces are pale by design — the hairline
          and shadow, not raw lightness, make the edge legible, same as
          the demo card.
          `--tweak-panel-tint` is declared once here and read by both this
          rule and `.tweak-panel-chrome` (the sticky header) below, so the
          whole panel — header included — is one continuous material
          rather than two different tints stacked on top of each other.
          Unlayered, so it beats the `@layer utilities` rules it overrides
          (`.lf-glass`, `.lf-glass-lg`) regardless of source order. */}
      <style>{`
        .tweak-panel-surface {
          --tweak-panel-tint: color-mix(in oklch, var(--lf-card-bg) 92%, var(--color-primary) 8%);
          background: var(--tweak-panel-tint);
          border: 1px solid color-mix(in oklch, var(--color-primary) 22%, transparent);
          box-shadow: var(--lf-card-shadow), 0 16px 44px -12px oklch(0 0 0 / 0.14);
        }
        .dark .tweak-panel-surface {
          box-shadow: var(--lf-card-shadow), 0 20px 56px -14px oklch(0 0 0 / 0.45);
        }
        .tweak-panel-chrome {
          background: var(--tweak-panel-tint);
        }
        @media (prefers-reduced-transparency: reduce) {
          .tweak-panel-surface, .tweak-panel-chrome { background: var(--tweak-panel-tint); backdrop-filter: none; -webkit-backdrop-filter: none; }
        }
        @media (prefers-contrast: more) {
          .tweak-panel-surface { background: var(--tweak-panel-tint); border: 1px solid currentColor; }
          .tweak-panel-chrome { background: var(--tweak-panel-tint); }
        }

        /*
         * Background/blur/resting-border for the two floating chip controls
         * (Tweak trigger, Back-to-home) — not .lf-glass: that class also
         * sets a bright border-top-color highlight, right on a large
         * surface like this panel but wrong on a 44px chip (see the comment
         * on TRIGGER_CLASS in tweakStyles.ts). Declared inside
         * @layer utilities, unlike .tweak-panel-surface above, which is
         * deliberately unlayered: an unlayered rule beats every layered rule
         * regardless of specificity, which would re-block
         * .lf-cta-ghost:hover's own border-color rule (also in
         * @layer utilities, in globals.css) — exactly the bug an earlier
         * inline-style attempt at this same fix caused. Layered here,
         * ordinary specificity applies: this single-class rule (0,1,0)
         * always loses to the hover rule's compound selector (0,2,0), so
         * hover keeps working. Values match .lf-glass (the chip-scaled
         * blur, not .lf-glass-lg's panel-scaled one) so these chips read
         * as the same material family as the panel, minus its highlight.
         */
        @layer utilities {
          .tweak-chip-glass {
            background: color-mix(in oklch, var(--lf-card-bg) 72%, transparent);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid color-mix(in oklch, var(--color-primary) 12%, transparent);
          }
          @media (prefers-reduced-transparency: reduce) {
            .tweak-chip-glass {
              background: var(--lf-card-bg);
              backdrop-filter: none;
            }
          }
          @media (prefers-contrast: more) {
            .tweak-chip-glass {
              background: var(--lf-card-bg);
              backdrop-filter: none;
              border-color: currentColor;
            }
          }
        }
      `}</style>

      {/* Opposite corner from the Tweak trigger, and always present — a
          visitor who lands on /demo (or follows "See the live demo" from /)
          has no other route back to the landing page. A text link rather
          than a pill: this is navigation, not the panel's primary action. */}
      <Link
        href="/"
        className={`fixed left-[clamp(0.75rem,2vw,1.5rem)] z-40 ${BACK_LINK_CLASS}`}
        style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <ArrowLeftIcon />
        Back to home
      </Link>

      {/* The wrapper spans the closed panel's footprint, which sits over the
          card's own action row — so it must not take pointer events itself;
          only the trigger and the open panel do. */}
      <div
        className="pointer-events-none fixed right-[clamp(0.75rem,2vw,1.5rem)] z-40 flex flex-col items-end gap-2"
        style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          aria-controls="tweak-panel"
          className={`pointer-events-auto ${TRIGGER_CLASS}`}
        >
          <SlidersIcon />
          {open ? "Close" : "Tweak"}
        </button>

        {/* grid-template-rows, never `height`, for the accordion reveal;
            the section's own opacity/scale fade is anchored at the
            trigger's corner so both read as one unfurl. Exit runs at 75%
            of enter (165ms of 220ms), same curve, no overshoot — a click
            carries no momentum for a bounce to answer. */}
        <div
          className={`grid w-[min(26rem,calc(100vw-1.5rem))] transition-[grid-template-rows] ease-(--lf-ease-out) ${
            open
              ? "grid-rows-[1fr] duration-(--lf-motion-base)"
              : "grid-rows-[0fr] duration-(--lf-motion-fast)"
          }`}
        >
          {/* Rounded to match the section it wraps. This wrapper's
              `overflow-hidden` exists only to collapse height for the
              accordion, but any non-`visible` overflow also clips a
              child's box-shadow at this element's own box — and without a
              matching radius that clip is a square, so the section's
              shadow got chopped into a flat band across every rounded
              corner (measured: this wrapper's rect was pixel-identical to
              the section's, confirming it was the clip boundary, not the
              section's own border-radius, which was already correct). */}
          <div className="min-h-0 overflow-hidden rounded-(--lf-card-radius)">
            {/* `inert` takes the panel out of focus order and the a11y tree
                while closed, which `hidden` would do at the cost of the
                animation. */}
            <section
              ref={panelRef}
              id="tweak-panel"
              aria-labelledby="tweak-panel-heading"
              inert={!open}
              // Elevation shadow lives in `.tweak-panel-surface` (see the
              // `<style>` block above), not inline: an inline shadow cannot
              // follow the theme, so a fixed dark halo would sit over the
              // light palette as heavily as over the dark one.
              className={`lf-glass lf-glass-lg tweak-panel-surface w-full max-h-[min(78vh,29rem)] origin-top-right overflow-y-auto rounded-(--lf-card-radius) transition-[opacity,transform,backdrop-filter] ease-(--lf-ease-out) ${
                open
                  ? "pointer-events-auto scale-100 opacity-100 duration-(--lf-motion-base)"
                  : "scale-95 opacity-0 backdrop-blur-none duration-(--lf-motion-fast)"
              }`}
            >
              {/* Sticky so Copy/Reset stay reachable once controls overflow.
                  Flush to the section's edges — no padding on the section,
                  no negative margins here — because a fixed `-mx-4` bleed
                  technique breaks the moment the section's own padding
                  changes, which is what produced the nested-card inset a
                  reviewer flagged earlier.
                  Double border, confirmed by measurement: this element
                  carried `.lf-glass` (background, blur, and a 1px border
                  on every edge) plus the `border-0` utility meant to zero
                  that border out — but a computed-style check showed
                  border-top/right/bottom/left all still 1px. `globals.css`
                  puts `@import "tailwindcss"` at the top of the file and
                  defines `.lf-glass` further down, still inside
                  `@layer utilities`; Tailwind's generated utilities
                  (`border-0` included) land at the import point, so
                  `.lf-glass`'s hand-written rule sits later in the same
                  layer and wins the same-specificity tie regardless of
                  which class appears last in `className`. `src/` is off
                  limits, so the fix has to happen here: an inline style,
                  which outranks any non-`!important` rule in any layer.
                  Background moved off `.lf-glass` too, onto
                  `.tweak-panel-chrome` (declared above), so this header is
                  the same material as the body rather than a second,
                  untinted glass layer riding on top of it. What remains
                  as the panel's one hairline is the section's own top
                  edge (`tweak-panel-surface`'s `border-top`); the gradient
                  fade below is the scroll-edge treatment this project
                  prefers over a second hard divider.
                  `will-change-transform` guards against a WebKit bug where
                  `position: sticky` misbehaves under a `border-radius`
                  scroll ancestor — unverified here (Chromium only), cheap
                  either way. `--lf-card-bg` has no alpha in any preset, and
                  z-20 stacks cleanly above sibling content in every check
                  run, so transparency and z-index were ruled out as causes
                  in this engine. */}
              <div
                className="tweak-panel-chrome sticky top-0 z-20 flex items-center justify-between gap-3 rounded-t-(--lf-card-radius) px-4 py-3 will-change-transform"
                style={{ border: "none" }}
              >
                <h2
                  id="tweak-panel-heading"
                  className="truncate text-sm font-semibold text-primary"
                >
                  Tweak this page
                </h2>

                <div className="flex shrink-0 items-center gap-1">
                  {/* Both labels always occupy the same grid cell, stacked
                      and cross-faded by opacity, so the button's width is
                      always the wider of the two — "Copied!" cannot shrink
                      the button and shove Reset sideways when it appears,
                      or shove it back when the timeout reverts it. */}
                  <button
                    type="button"
                    onClick={() => void copy(tweak.snippet, true)}
                    aria-label={copied ? "Copied!" : "Copy config"}
                    className={BUTTON_CLASS}
                  >
                    <span aria-hidden="true" className="grid">
                      <span
                        style={{ gridArea: "1/1" }}
                        className={copied ? "opacity-0" : "opacity-100"}
                      >
                        Copy config
                      </span>
                      <span
                        style={{ gridArea: "1/1" }}
                        className={copied ? "opacity-100" : "opacity-0"}
                      >
                        Copied!
                      </span>
                    </span>
                  </button>
                  {/* Ghost, not outlined like Copy config: Reset is
                      destructive-ish and secondary to the common path, so it
                      is visually subordinate rather than a peer button. */}
                  <button
                    type="button"
                    onClick={tweak.reset}
                    className={GHOST_BUTTON_CLASS}
                  >
                    Reset
                  </button>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -bottom-3 h-3"
                  style={{
                    background:
                      "linear-gradient(to bottom, color-mix(in oklch, var(--lf-card-bg) 55%, transparent), transparent)",
                  }}
                />
              </div>

              {/* Three clusters, not seven flat fieldsets in source order.
                  The controls used to read Identity → Palette → Font →
                  Avatar → Layout → Link groups → Sections — Avatar is a
                  profile-identity setting, but three appearance/content
                  fieldsets separated it from Identity, so proximity was
                  telling the wrong story about what belongs together.
                  Grouped by what the control actually governs: who you are
                  (Profile), how it looks (Appearance), what shows (Content).
                  A flat list, one `gap-5` throughout — `CLUSTER_LABEL_CLASS`
                  carries its own `mt-2`, so a new cluster gets a touch more
                  air than a fieldset following one in the same cluster,
                  without a second nested grid to get there. Each cluster's
                  `<h3>` nests under this panel's own `<h2>` ("Tweak this
                  page"), giving sighted and assistive-tech readers the same
                  three-tier structure (cluster → fieldset → control). */}
              <div className="grid gap-5 px-4 pt-3 pb-4">
                <h3 className={CLUSTER_LABEL_CLASS}>Profile</h3>

                <fieldset>
                  <legend className={FIELD_LEGEND_CLASS}>Identity</legend>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm text-(--lf-description-color)">
                      <span className="mb-1 block">Full name</span>
                      <input
                        type="text"
                        value={tweak.fullName}
                        onChange={(event) =>
                          tweak.setFullName(event.target.value)
                        }
                        className={TEXT_INPUT_CLASS}
                      />
                    </label>
                    <label className="text-sm text-(--lf-description-color)">
                      <span className="mb-1 block">Alias</span>
                      <input
                        type="text"
                        value={tweak.alias}
                        onChange={(event) => tweak.setAlias(event.target.value)}
                        className={TEXT_INPUT_CLASS}
                      />
                    </label>
                  </div>

                  {/* Belongs to the alias, not the avatar: a fieldset's
                      legend is announced as the group name for every control
                      inside it, so under "Avatar" this reads as a setting for
                      the image. */}
                  <label className={`${CONTROL_LABEL_CLASS} mt-1`}>
                    <input
                      type="checkbox"
                      checked={tweak.typingAlias}
                      onChange={(event) =>
                        tweak.setTypingAlias(event.target.checked)
                      }
                      className={CONTROL_INPUT_CLASS}
                    />
                    Typing alias
                  </label>
                </fieldset>

                <fieldset>
                  <legend className={FIELD_LEGEND_CLASS}>Avatar</legend>
                  {/* Segmented control: three mutually exclusive sizes read
                      faster side by side than as a stacked radio list. */}
                  <div className="flex rounded-md border border-primary/20 p-0.5">
                    {AVATAR_SIZES.map((size) => (
                      <label key={size} className={SEGMENT_LABEL_CLASS}>
                        <input
                          type="radio"
                          name="avatar-size"
                          value={size}
                          checked={tweak.avatarSize === size}
                          onChange={() => tweak.setAvatarSize(size)}
                          className="peer sr-only"
                        />
                        <span
                          className={SEGMENT_TEXT_CLASS}
                        >{`${size}px`}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <h3 className={CLUSTER_LABEL_CLASS}>Appearance</h3>

                <TweakAppearance
                  palette={tweak.palette}
                  setPalette={tweak.setPalette}
                  font={tweak.font}
                  setFont={tweak.setFont}
                />

                <h3 className={CLUSTER_LABEL_CLASS}>Content</h3>

                <fieldset>
                  <legend className={FIELD_LEGEND_CLASS}>Layout</legend>
                  {/* Segmented, like Avatar: two mutually exclusive
                      arrangements of the same links. Sits directly above
                      Link groups because in bento a link's group is also
                      what sizes its tile. */}
                  <div className="flex rounded-md border border-primary/20 p-0.5">
                    {LAYOUTS.map((layout) => (
                      <label key={layout} className={SEGMENT_LABEL_CLASS}>
                        <input
                          type="radio"
                          name="layout"
                          value={layout}
                          checked={tweak.layout === layout}
                          onChange={() => tweak.setLayout(layout)}
                          className="peer sr-only"
                        />
                        <span className={SEGMENT_TEXT_CLASS}>
                          {LAYOUT_LABELS[layout]}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className={FIELD_LEGEND_CLASS}>Link groups</legend>
                  <div className="flex flex-col gap-1">
                    {GROUPS.map((group) => (
                      <label key={group} className={CONTROL_LABEL_CLASS}>
                        <input
                          type="checkbox"
                          checked={tweak.visibleGroups.has(group)}
                          onChange={() => tweak.toggleGroup(group)}
                          className={CONTROL_INPUT_CLASS}
                        />
                        {GROUP_LABELS[group]}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className={FIELD_LEGEND_CLASS}>Sections</legend>
                  <div className="flex flex-col gap-1">
                    <label className={CONTROL_LABEL_CLASS}>
                      <input
                        type="checkbox"
                        checked={tweak.showText}
                        onChange={(event) =>
                          tweak.setShowText(event.target.checked)
                        }
                        className={CONTROL_INPUT_CLASS}
                      />
                      Text sections
                    </label>
                    <label className={CONTROL_LABEL_CLASS}>
                      <input
                        type="checkbox"
                        checked={tweak.showFooter}
                        onChange={(event) =>
                          tweak.setShowFooter(event.target.checked)
                        }
                        className={CONTROL_INPUT_CLASS}
                      />
                      Footer
                    </label>
                  </div>
                </fieldset>
              </div>

              <output className="sr-only">
                {copied ? "Config snippet copied to clipboard" : ""}
              </output>
            </section>
          </div>
        </div>
      </div>

      {/*
        When the palette changes the card re-themes over the shared motion
        tokens instead of snapping, so the control's effect reads as
        cause-and-effect rather than a repaint.
      */}
      <div
        className="lf-retheme"
        style={{ fontFamily: FONTS[tweak.font].stack }}
      >
        <p aria-live="polite" className="sr-only">
          {`Palette: ${PALETTES[tweak.palette].label}. Layout: ${LAYOUT_LABELS[tweak.layout]}.`}
        </p>
        {/* No headingLevel override: this page has no heading of its own, so
            the profile name is its h1. */}
        {/*
          Structured data off. The profile rendered here is a fixture — a
          person named "Linkfolio" whose seventeen links all point at "#1".."#17"
          — so a ProfilePage + Person graph would assert to search engines that
          someone exists who does not. Publishing no entity is honest; the same
          reasoning is spelled out for the landing page in lib/landingJsonLd.ts.
          The page's own metadata (title, description, canonical) is unaffected.
        */}
        <LinkFolio
          userConfig={tweak.previewConfig}
          renderJsonLd={false}
          BeforeSocialLinksComponent={tweak.showText ? Intro : undefined}
          AfterSocialLinksComponent={tweak.showText ? Outro : undefined}
          FooterComponent={tweak.showFooter ? undefined : NoFooter}
        />
      </div>
    </>
  );
}
