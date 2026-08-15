import { test, expect } from "vitest";
import { observeReveal } from "../../src/lib/revealObserver";

/**
 * The module keeps one shared observer and a pending set at module scope, so
 * these tests are order-dependent by design: the no-observer path must run
 * before a fake IntersectionObserver is installed, otherwise the memoised
 * observer from an earlier test would satisfy the later ones. Vitest runs a
 * file's tests in order in a single worker, which is what module state
 * (per-process) needs — do not mark these concurrent.
 */
/**
 * The sweep's scroll net calls `globalThis.addEventListener`, which the test
 * process does not provide. Stubbed with a registry so the binding itself is
 * observable. Installed at module scope: a sweep scheduled by an early test
 * can fire during any later one.
 */
const scrollListeners = new Set<EventListener>();

(globalThis as { addEventListener?: unknown }).addEventListener = (
  type: string,
  listener: EventListener,
) => {
  if (type === "scroll") scrollListeners.add(listener);
};

(globalThis as { removeEventListener?: unknown }).removeEventListener = (
  type: string,
  listener: EventListener,
) => {
  scrollListeners.delete(listener);
};

type Entry = {
  isIntersecting: boolean;
  boundingClientRect: { top: number };
  target: Element;
};

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  observed = new Set<Element>();

  constructor(
    public callback: (entries: Entry[], self: FakeIntersectionObserver) => void,
    public options: IntersectionObserverInit,
  ) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.add(element);
  }

  unobserve(element: Element) {
    this.observed.delete(element);
  }

  disconnect() {
    this.observed.clear();
  }
}

type FakeElement = Element & {
  classes: Set<string>;
  styles: Map<string, string>;
};

function fakeElement(group?: string, top = 10_000): FakeElement {
  const classes = new Set<string>();
  const styles = new Map<string, string>();

  return {
    classes,
    styles,
    classList: {
      add: (name: string) => classes.add(name),
      contains: (name: string) => classes.has(name),
    },
    dataset: group ? { group } : {},
    style: {
      setProperty: (name: string, value: string) => styles.set(name, value),
    },
    getBoundingClientRect: () => ({ top }),
  } as unknown as FakeElement;
}

function entry(target: Element, top: number, isIntersecting = true): Entry {
  return { isIntersecting, boundingClientRect: { top }, target };
}

const revealed = (element: FakeElement) => element.classes.has("is-revealed");

function currentObserver(): FakeIntersectionObserver {
  const observer = FakeIntersectionObserver.instances[0];
  expect(observer).toBeDefined();

  return observer;
}

test("without IntersectionObserver, cards reveal immediately", () => {
  const element = fakeElement();

  const cleanup = observeReveal(element);

  expect(revealed(element)).toBe(true);
  expect(typeof cleanup).toBe("function");
  expect(cleanup).not.toThrow();
});

test("with an observer, a card waits to be observed instead of revealing", () => {
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
    FakeIntersectionObserver;

  const element = fakeElement();
  observeReveal(element);

  const observer = currentObserver();

  expect(observer.observed.has(element)).toBe(true);
  expect(revealed(element)).toBe(false);

  // The margin is what makes jump-scrolled cards count as intersecting; a
  // silent change here would strand content above the viewport.
  expect(observer.options.rootMargin).toBe("10000px 0px -10% 0px");
});

test("an intersecting batch reveals top-down with a per-group stagger", () => {
  const observer = currentObserver();

  const elements = {
    sn1: fakeElement(),
    sn2: fakeElement(),
    sn3: fakeElement("socialnetwork"),
    web1: fakeElement("website"),
    web2: fakeElement("website"),
  };

  for (const element of Object.values(elements)) observeReveal(element);

  // Delivered out of visual order: the callback must sort by top itself.
  observer.callback(
    [
      entry(elements.sn1, 300),
      entry(elements.web1, 150),
      entry(elements.sn2, 100),
      entry(elements.web2, 250),
      entry(elements.sn3, 200),
    ],
    observer,
  );

  for (const element of Object.values(elements)) {
    expect(revealed(element)).toBe(true);
    expect(observer.observed.has(element)).toBe(false);
  }

  // Sorted by top and grouped: socialnetwork ramps 100→200→300, website
  // ramps 150→250 — each group cascading from zero.
  const staggers = Object.fromEntries(
    Object.entries(elements).map(([name, element]) => [
      name,
      element.styles.get("--lf-stagger"),
    ]),
  );

  expect(staggers).toEqual({
    sn2: "0ms",
    sn3: "45ms",
    sn1: "90ms",
    web1: "0ms",
    web2: "45ms",
  });
});

test("elements missing data-group ramp together with 'socialnetwork'", () => {
  const observer = currentObserver();

  const bare = fakeElement();
  const grouped = fakeElement("socialnetwork");

  observeReveal(bare);
  observeReveal(grouped);
  observer.callback([entry(bare, 100), entry(grouped, 200)], observer);

  expect(bare.styles.get("--lf-stagger")).toBe("0ms");
  expect(grouped.styles.get("--lf-stagger")).toBe("45ms");
});

test("the stagger ramp is capped so a long batch does not crawl", () => {
  const observer = currentObserver();

  const batch = Array.from({ length: 13 }, () => fakeElement());
  for (const element of batch) observeReveal(element);

  observer.callback(
    batch.map((element, i) => entry(element, i * 10)),
    observer,
  );

  // Index 10 onwards all sit at the cap: 10 * 45ms.
  expect(batch[9].styles.get("--lf-stagger")).toBe("405ms");
  expect(batch[10].styles.get("--lf-stagger")).toBe("450ms");
  expect(batch[12].styles.get("--lf-stagger")).toBe("450ms");
});

test("a non-intersecting entry stays hidden and observed", () => {
  const observer = currentObserver();

  const element = fakeElement();
  observeReveal(element);

  observer.callback([entry(element, 10_000, false)], observer);

  expect(revealed(element)).toBe(false);
  expect(observer.observed.has(element)).toBe(true);
});

test("cleanup unobserves a card that unmounts before revealing", () => {
  const observer = currentObserver();

  const element = fakeElement();
  const cleanup = observeReveal(element);

  expect(observer.observed.has(element)).toBe(true);

  cleanup();

  expect(observer.observed.has(element)).toBe(false);
  expect(revealed(element)).toBe(false);
});

test("the sweep reveals on-screen cards the observer never fired for", async () => {
  const observer = currentObserver();

  (globalThis as { innerHeight?: number }).innerHeight = 800;

  // Above the sweep threshold (800 * 0.9 = 720): must be force-revealed.
  const onScreen = fakeElement(undefined, 100);
  // Below it: deliberately still waiting to come into view.
  const belowFold = fakeElement(undefined, 790);

  observeReveal(onScreen);
  observeReveal(belowFold);

  await expect.poll(() => revealed(onScreen), { timeout: 3000 }).toBe(true);

  expect(observer.observed.has(onScreen)).toBe(false);
  expect(revealed(belowFold)).toBe(false);

  // Cards are still pending below the fold, so the sweep leaves a scroll
  // listener behind as its follow-up net.
  expect(scrollListeners.size).toBe(1);
});

test("the scroll net unbinds once nothing is pending any more", async () => {
  const observer = currentObserver();

  // Reveal everything still pending through the observer path, as if the
  // visitor scrolled the rest into view.
  const leftovers = [...observer.observed];
  observer.callback(
    leftovers.map((element) => entry(element, 0)),
    observer,
  );

  // The listener bound by the previous sweep is scheduleSweep itself; firing
  // it schedules the sweep that discovers the pending set is empty.
  for (const listener of scrollListeners) listener(new Event("scroll"));

  await expect.poll(() => scrollListeners.size, { timeout: 3000 }).toBe(0);
});
