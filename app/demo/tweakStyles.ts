/**
 * Presentation constants for the tweak panel, kept beside it rather than in
 * the stylesheet: they are utility compositions specific to this one panel,
 * not design-system classes other pages reach for. Motion and press feedback
 * come from `.lf-cta`/`.lf-cta-ghost` and the motion tokens, so nothing here
 * restates a value the design system already owns.
 */

export const FIELD_LEGEND_CLASS =
  "mb-2 text-sm font-semibold tracking-wide text-primary";
// A quieter, smaller tier above `FIELD_LEGEND_CLASS`: iOS-style grouped-table
// section eyebrow, not a competing heading. "Identity"/"Palette"/etc. are the
// real semantic groupings (each a `<fieldset>`); "Profile"/"Appearance"/
// "Content" are wayfinding over a *cluster* of those fieldsets, so it has to
// read as subordinate — muted colour, small size, no bold — or it fights the
// legends underneath it instead of framing them. `<h3>`, nested under this
// panel's own `<h2>` ("Tweak this page"), so assistive tech gets the same
// three-tier structure a sighted reader sees from size/weight alone.
export const CLUSTER_LABEL_CLASS =
  "mt-2 mb-2 text-xs font-medium tracking-wider text-(--lf-description-color) uppercase";
export const CONTROL_LABEL_CLASS =
  "flex min-h-11 cursor-pointer items-center gap-2 text-sm text-(--lf-description-color)";
export const CONTROL_INPUT_CLASS =
  "h-5 w-5 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
// Solid `--lf-card-bg`, not a page-tinted translucency: against the panel's
// own solid tint (see the `<style>` block above) a light wash of the same
// family read as barely-there — reviewer feedback on the panel background
// fix ("inputs barely distinguishable... reads as a grey block") applied
// here too, for the same reason. A flatly different, lighter fill is what
// makes a field read as a control sitting on the panel rather than a hole
// in it; material weight (lighter on the panel's mid-tone) is the
// hierarchy cue, not colour.
export const TEXT_INPUT_CLASS =
  "min-h-11 w-full rounded-md border border-primary/25 bg-(--lf-card-bg) px-3 text-sm text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
// One container for every option, checked or not — selection is never
// signalled by the row appearing/disappearing, only by the ring on its
// swatch and the label's weight (set inline per-option, both channels
// together so the state survives greyscale and reads without colour).
// The press feedback is immediate (100ms, on pointer-down via :active),
// not deferred to release. Same solid `--lf-card-bg` fill as
// `TEXT_INPUT_CLASS`, for the same reason. `min-h-11`, not `-12`: every
// other tappable row in this panel (checkbox rows, buttons, inputs) is the
// same 44px minimum — there was no functional reason for this row alone to
// be 4px taller, just drift.
export const OPTION_ROW_CLASS =
  "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md border border-primary/20 bg-(--lf-card-bg) px-3 text-sm text-(--lf-description-color) hover:border-primary/40 active:scale-(--lf-press-scale) [transition:border-color_var(--lf-motion-fast)_var(--lf-ease-out),transform_var(--lf-motion-fast)_var(--lf-ease-out)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary";
// Two-layer ring (a gap matching the surface, then the accent) around a
// selected swatch — the same treatment system colour pickers use, and the
// only thing that changes between selected and unselected.
export const ringStyle = (selected: boolean) =>
  selected
    ? "0 0 0 2px var(--lf-card-bg), 0 0 0 4px var(--color-primary)"
    : "none";
// The press scale matches `OPTION_ROW_CLASS`: every other selectable
// row in this panel presses on pointer-down, and these segmented buttons
// (Avatar size, Layout) were the one place that didn't — same interaction,
// same feedback, now. Transform doesn't participate in flex layout, so
// scaling this `flex-1` child on press doesn't reflow its siblings.
export const SEGMENT_LABEL_CLASS =
  "flex-1 cursor-pointer transition-transform duration-(--lf-motion-fast) ease-(--lf-ease-out) active:scale-(--lf-press-scale)";
export const SEGMENT_TEXT_CLASS =
  "flex min-h-10 items-center justify-center rounded-[0.3rem] text-sm text-(--lf-description-color) transition-[background-color,color] duration-(--lf-motion-fast) peer-checked:bg-primary peer-checked:text-background-start peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary";
// No `shadow-(--lf-card-shadow)` here: on a small pill, the card
// shadow plus a glass border reads heavier than the control is — bigger
// surfaces (the panel itself) earn a deeper shadow, a chip does not.
// `.lf-glass` itself is *not* used on this chip: its bright
// `border-top-color` (a "light catching the glass" highlight, correct on
// the panel) read as a mismatched border here, and patching that mismatch
// with an inline style over `.lf-glass` created a second bug — the inline
// style also blocked `.lf-cta-ghost:hover`'s own `border-color` rule,
// since an inline style outranks every stylesheet rule in every state,
// hover included. `.lf-cta-ghost` (the system's action-button treatment)
// supplies the hover lift, press scale and hover border-colour directly,
// so composing it here means the hover state is never fought — see
// `.tweak-chip-glass` (declared in `TweakPanel.tsx`) for the
// background/blur/resting-border this chip still needs.
export const TRIGGER_CLASS =
  "lf-cta-ghost tweak-chip-glass inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-primary";
export const BUTTON_CLASS =
  "lf-cta-ghost inline-flex min-h-11 items-center rounded-md border border-primary/20 px-3 text-sm text-primary";
// No border: Reset is the subordinate action next to Copy config, not a
// peer — ghost/text weight says so without needing a second visual system.
export const GHOST_BUTTON_CLASS =
  "lf-cta-ghost inline-flex min-h-11 items-center rounded-md px-3 text-sm text-(--lf-description-color) hover:bg-(--lf-network-hover-bg) hover:text-primary";
// Text link, not a pill: navigation back to the landing page is not a
// primary action, so it must not read like one next to the Tweak trigger.
// `lf-nudge` on top of `lf-cta-ghost`: this is directional navigation (it
// leads back to the landing page), and `.lf-nudge:hover` is the system's
// existing "nav links lean toward where they lead" treatment.
export const BACK_LINK_CLASS =
  "lf-cta-ghost lf-nudge tweak-chip-glass inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:bg-(--lf-network-hover-bg)";
