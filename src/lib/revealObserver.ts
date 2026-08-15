/**
 * Reveals cards as they scroll into view.
 *
 * One observer is shared by every card, so the browser batches all
 * intersections into a single callback instead of scheduling one per element.
 */

const REVEAL_CLASS = "is-revealed";

/**
 * Cards reveal once they are 10% inside the viewport. The percentage keeps the
 * trigger proportional on every screen — a phone and a desktop reveal at the
 * same visual depth — and the negative bottom edge makes a card entering from
 * below wait until it is properly on screen instead of firing as it grazes
 * the fold.
 *
 * The open top edge covers jump scrolls. A card that goes from below the fold
 * to above the viewport in one move — anchor link, End key, restored scroll
 * position — never changes intersection state, so no callback would fire and
 * it would stay hidden forever. Extending the root upwards means anything at
 * or above the viewport always counts as intersecting.
 */
const REVEAL_MARGIN = "10000px 0px -10% 0px";

/**
 * Cards are sequenced per arriving batch rather than by their index in the
 * list. A global ramp makes late cards wait out a delay accumulated by cards
 * the visitor scrolled past long ago; a per-batch ramp cascades whatever comes
 * into view, at any scroll position.
 */
const STAGGER_WINDOW_MS = 260;
const MIN_STAGGER_STEP_MS = 50;
const MAX_STAGGER_STEP_MS = 110;
const MAX_STAGGERED = 10;

/**
 * The gap between cards is derived from how many arrived, not fixed, so the
 * cascade lasts about as long whatever the group's size. A fixed step reads as
 * a ramp across a dozen tiles and as nothing at all across four: five cards at
 * 45ms finish in 180ms, well inside the 500ms each card spends fading, so they
 * effectively appear together.
 *
 * The values are tuned against v2, which used a flat 60ms per card: a group
 * of five lands at 65ms here, so the pace is the one this project has always
 * had. What changes is that small groups no longer finish before the eye can
 * follow them, and the floor keeps a long list from crawling — v2's flat step
 * had neither guard.
 *
 * Clamped at both ends: without a ceiling a two-card group would hold the
 * second card for the whole window, and without a floor a long list would
 * crawl. `MAX_STAGGERED` still caps the accumulated delay so the last card of
 * a long group is not left waiting on all the others.
 */
function staggerStep(count: number): number {
  const spread = STAGGER_WINDOW_MS / Math.max(count - 1, 1);

  return Math.round(
    Math.min(MAX_STAGGER_STEP_MS, Math.max(MIN_STAGGER_STEP_MS, spread)),
  );
}

/**
 * Safety net. The CSS hides a card until this module reveals it, so anything
 * that stops the observer from firing — a browser quirk, a zero-sized ancestor
 * at observe time, an element that never changes intersection state — leaves
 * content permanently invisible. This sweep re-checks whatever is still
 * pending and reveals what the observer should already have caught.
 *
 * The threshold matches REVEAL_MARGIN's bottom edge, so a card deliberately
 * waiting to come fully into view is not force-revealed early.
 */
const SWEEP_DELAY_MS = 1200;
const SWEEP_THRESHOLD = 0.9;

/**
 * Marks the document as able to run the reveal. The stylesheet only hides a
 * card underneath this class, so if this module never executes — a chunk that
 * fails to load, a blocked script, a stale dev server — the cards stay
 * visible instead of being hidden by CSS with nothing left to reveal them.
 * Set at module scope so it lands with the chunk, before any effect runs.
 */
const READY_CLASS = "lf-js";

if (typeof document !== "undefined") {
  document.documentElement.classList.add(READY_CLASS);
}

let observer: IntersectionObserver | undefined;
let sweepTimer: ReturnType<typeof setTimeout> | undefined;

/** Observed but not yet revealed. */
const pending = new Set<Element>();

function reveal(element: Element): void {
  element.classList.add(REVEAL_CLASS);
  pending.delete(element);
}

/**
 * Assigns each element its delay: sorted top-down, cascading from zero per
 * group, with a step derived from how many of that group are arriving.
 *
 * Every rect is read before any style is written. Setting a custom property
 * dirties style, so interleaving the two forces a layout per element.
 */
function applyStagger(elements: readonly Element[]): void {
  const sorted = (elements as readonly HTMLElement[]).toSorted(
    (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
  );

  const total = new Map<string, number>();
  for (const element of sorted) {
    const group = element.dataset.group ?? "socialnetwork";
    total.set(group, (total.get(group) ?? 0) + 1);
  }

  const seen = new Map<string, number>();
  const delays = sorted.map((element) => {
    const group = element.dataset.group ?? "socialnetwork";
    const index = seen.get(group) ?? 0;
    seen.set(group, index + 1);

    return Math.min(index, MAX_STAGGERED) * staggerStep(total.get(group) ?? 1);
  });

  sorted.forEach((element, i) => {
    element.style.setProperty("--lf-stagger", `${delays[i]}ms`);
  });
}

function sweep(): void {
  sweepTimer = undefined;

  // Measured in one pass, then applied in another: revealing writes a class,
  // which dirties style, so an interleaved loop forces a layout per element.
  const limit = globalThis.innerHeight * SWEEP_THRESHOLD;
  const due = [...pending].filter(
    (element) => element.getBoundingClientRect().top < limit,
  );

  // Staggered like the observer's own batches. Without this the failsafe
  // reveals everything on the same frame, and a page that happens to fall
  // through to it shows no cascade at all — the same content arriving in a
  // visibly different way from one load to the next.
  applyStagger(due);

  for (const element of due) {
    observer?.unobserve(element);
    reveal(element);
  }

  // A single pass only covers the first screen. Whatever is still pending is
  // below the fold, and if the observer is the thing that failed, nothing else
  // will ever look at it again — so the net follows the scroll rather than
  // polling: a listener that costs nothing until the visitor moves.
  if (pending.size > 0) bindScroll();
  else unbindScroll();
}

function scheduleSweep(): void {
  sweepTimer ??= setTimeout(sweep, SWEEP_DELAY_MS);
}

let scrollBound = false;

/** Guarded like the observer above: the host may not be a DOM event target. */
function bindScroll(): void {
  if (scrollBound || typeof globalThis.addEventListener !== "function") return;

  scrollBound = true;
  globalThis.addEventListener("scroll", scheduleSweep, { passive: true });
}

function unbindScroll(): void {
  if (!scrollBound) return;

  scrollBound = false;
  globalThis.removeEventListener("scroll", scheduleSweep);
}

function getObserver(): IntersectionObserver | undefined {
  if (!("IntersectionObserver" in globalThis)) return undefined;

  observer ??= new IntersectionObserver(
    (entries, self) => {
      const arriving = entries
        .filter((entry) => entry.isIntersecting)
        .toSorted(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );

      // The stylesheet reads --lf-stagger as the transition-delay, so every
      // delay is assigned before any card flips to its revealed state.
      applyStagger(arriving.map((entry) => entry.target));

      arriving.forEach((entry) => {
        reveal(entry.target as HTMLElement);
        self.unobserve(entry.target);
      });
    },
    { rootMargin: REVEAL_MARGIN, threshold: 0 },
  );

  return observer;
}

/** Observe `element` until it is revealed. Returns a cleanup function. */
export function observeReveal(element: Element): () => void {
  const io = getObserver();

  if (!io) {
    // Cards are hidden by CSS wherever scripting is available, so without an
    // observer they would never show.
    reveal(element);

    return () => {};
  }

  pending.add(element);
  io.observe(element);
  scheduleSweep();

  return () => {
    pending.delete(element);
    io.unobserve(element);

    if (pending.size === 0) unbindScroll();
  };
}
