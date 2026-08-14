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
const STAGGER_STEP_MS = 45;
const MAX_STAGGERED = 10;

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

function sweep(): void {
  sweepTimer = undefined;

  // Measured in one pass, then applied in another: revealing writes a class,
  // which dirties style, so an interleaved loop forces a layout per element.
  const limit = globalThis.innerHeight * SWEEP_THRESHOLD;
  const due = [...pending].filter(
    (element) => element.getBoundingClientRect().top < limit,
  );

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

      // Each group cascades from zero, so a batch spanning two sections does
      // not carry the first section's ramp into the second.
      const seen = new Map<string, number>();

      arriving.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const group = element.dataset.group ?? "socialnetwork";
        const index = seen.get(group) ?? 0;
        seen.set(group, index + 1);

        const step = Math.min(index, MAX_STAGGERED) * STAGGER_STEP_MS;

        // The stylesheet reads this as the transition-delay, so it has to be
        // set before the class flips the card to its revealed state.
        element.style.setProperty("--lf-stagger", `${step}ms`);

        reveal(element);
        self.unobserve(element);
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
