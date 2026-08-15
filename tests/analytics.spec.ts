import { test, expect } from "@playwright/test";
import {
  LINKFOLIO_ANALYTICS_EVENT,
  buildLinkClickEvent,
  emitAnalyticsEvent,
} from "../src/lib/analytics";
import {
  analyticsScriptsFor,
  registerAnalyticsAdapter,
  resolveAnalyticsAdapter,
  sendAnalyticsEvent,
} from "../src/lib/analytics-adapters";
import { escapeJsonLd, isSafeAnalyticsId } from "../src/lib/sanitize";
import type { AnalyticsEvent, SocialNetworkType } from "../src/types";

const LINK: SocialNetworkType = {
  url: "https://example.com/blog",
  iconSrc: "/icon.webp",
  title: "Blog",
  description: "Writing",
  group: "website",
};

test("the event name is namespaced so it cannot collide", () => {
  expect(LINKFOLIO_ANALYTICS_EVENT).toBe("linkfolio:analytics");
});

test("buildLinkClickEvent carries the fields an attribution report needs", () => {
  expect(buildLinkClickEvent(LINK)).toEqual({
    name: "link_click",
    params: {
      link_title: "Blog",
      link_url: "https://example.com/blog",
      link_group: "website",
    },
  });
});

test("buildLinkClickEvent defaults the group the way the card markup does", () => {
  const event = buildLinkClickEvent({ ...LINK, group: undefined });

  expect(event.params.link_group).toBe("socialnetwork");
});

test("buildLinkClickEvent reports the sanitised href, not the raw config", () => {
  // safeUrl() rejects this, and the anchor renders "#". Reporting the raw
  // value would attribute a click to a destination nobody can have reached.
  const event = buildLinkClickEvent({ ...LINK, url: "javascript:alert(1)" });

  expect(event.params.link_url).toBe("#");
});

test("emitAnalyticsEvent is inert without a document instead of throwing", () => {
  // These specs run in Node. A library that crashes during SSR because a
  // global is missing is worse than one that silently does nothing.
  expect(emitAnalyticsEvent({ name: "link_click", params: {} })).toBe(false);
});

test("emitAnalyticsEvent dispatches a namespaced CustomEvent carrying the event as detail", () => {
  // The early-return branch above only proves the no-document guard; without
  // this, a no-op dispatchEvent or a mangled detail would still leave every
  // other test in this file green. Stub `document` (and `CustomEvent`, in
  // case the runtime lacks it) the way tests/reveal-observer.spec.ts stubs
  // IntersectionObserver, and restore both so test order cannot matter.
  const globals = globalThis as {
    document?: unknown;
    CustomEvent?: unknown;
  };
  const previousDocument = globals.document;
  const previousCustomEvent = globals.CustomEvent;

  const dispatched: CustomEvent<AnalyticsEvent>[] = [];

  globals.document = {
    dispatchEvent: (event: CustomEvent<AnalyticsEvent>) => {
      dispatched.push(event);

      return true;
    },
  };

  if (globals.CustomEvent === undefined) {
    globals.CustomEvent = class FakeCustomEvent<T> {
      type: string;
      detail: T;

      constructor(type: string, init?: { detail?: T }) {
        this.type = type;
        this.detail = init?.detail as T;
      }
    };
  }

  try {
    const event: AnalyticsEvent = {
      name: "link_click",
      params: { link_title: "Blog" },
    };

    expect(emitAnalyticsEvent(event)).toBe(true);
    expect(dispatched).toHaveLength(1);
    expect(dispatched[0].type).toBe(LINKFOLIO_ANALYTICS_EVENT);
    expect(dispatched[0].detail).toEqual(event);
  } finally {
    globals.document = previousDocument;
    globals.CustomEvent = previousCustomEvent;
  }
});

test("isSafeAnalyticsId accepts real measurement ids", () => {
  expect(isSafeAnalyticsId("G-ABC123XYZ")).toBe(true);
  expect(isSafeAnalyticsId("GTM-WXYZ42")).toBe(true);
  expect(isSafeAnalyticsId("linkfolio.dev")).toBe(true);
  expect(isSafeAnalyticsId("2f9c1e04-0a4d-4f0e-9b1a-77a1c1b8e0d2")).toBe(true);
});

test("isSafeAnalyticsId rejects anything that could break out of a script", () => {
  for (const hostile of [
    "G-1';alert(1);//",
    "G-1</script><script>alert(1)</script>",
    'G-1"',
    "G-1\\",
    "",
    "G 1",
    // JS `$` does not match before a trailing newline the way Perl/Python's
    // does — a naive `^...$` port would let these slip through.
    "G-1\n",
    "\nG-1",
    "G-1 ",
  ]) {
    expect(isSafeAnalyticsId(hostile)).toBe(false);
  }
});

test("no provider means no script — the default must load nothing", () => {
  // Explicit undefined exercises the "no config passed" path the type allows.
  // oxlint-disable-next-line unicorn/no-useless-undefined
  expect(analyticsScriptsFor(undefined)).toEqual([]);
  expect(analyticsScriptsFor({})).toEqual([]);
  expect(analyticsScriptsFor({ provider: "ga" })).toEqual([]); // id missing
});

test("an unknown provider is ignored rather than throwing mid-render", () => {
  expect(resolveAnalyticsAdapter("does-not-exist")).toBeUndefined();
  expect(analyticsScriptsFor({ provider: "does-not-exist", id: "x" })).toEqual(
    [],
  );
});

test("a hostile id is refused instead of being escaped into a script", () => {
  expect(
    analyticsScriptsFor({ provider: "ga", id: "G-1';alert(1);//" }),
  ).toEqual([]);
});

test("every built-in provider is registered under its documented name", () => {
  for (const name of ["ga", "gtm", "plausible", "umami"]) {
    expect(resolveAnalyticsAdapter(name)).toBeDefined();
  }
});

test("ga loads gtag.js and bootstraps the measurement id", () => {
  const scripts = analyticsScriptsFor({ provider: "ga", id: "G-ABC123" });

  expect(scripts).toHaveLength(2);
  expect(scripts[0].src).toBe(
    "https://www.googletagmanager.com/gtag/js?id=G-ABC123",
  );
  expect(scripts[1].inline).toContain("G-ABC123");
  expect(scripts.map((s) => s.id)).toEqual(["lf-ga-src", "lf-ga-init"]);
});

test("plausible is configured by domain and points at the vendor origin", () => {
  const [script] = analyticsScriptsFor({
    provider: "plausible",
    id: "example.com",
  });

  expect(script.attrs?.["data-domain"]).toBe("example.com");
  expect(script.src).toContain("plausible.io");
});

test("a self-hosted origin overrides the vendor default", () => {
  const [script] = analyticsScriptsFor({
    provider: "plausible",
    id: "example.com",
    src: "https://stats.example.com/js/script.js",
  });

  expect(script.src).toBe("https://stats.example.com/js/script.js");
});

test("umami keys off its own attribute", () => {
  const [umami] = analyticsScriptsFor({ provider: "umami", id: "abc-123" });
  expect(umami.attrs?.["data-website-id"]).toBe("abc-123");
});

test("config attrs are merged onto every script the adapter returns", () => {
  const scripts = analyticsScriptsFor({
    provider: "ga",
    id: "G-ABC123",
    attrs: { "data-consent": "granted" },
  });

  for (const script of scripts) {
    expect(script.attrs?.["data-consent"]).toBe("granted");
  }
});

test("a config attrs override wins precedence over the adapter's own default", () => {
  // Reusing "data-domain" — a key the plausible adapter itself sets — is the
  // point: this proves override order, not merely that merging happened.
  // Reversing the spread order in analyticsScriptsFor would leave this red.
  const [script] = analyticsScriptsFor({
    provider: "plausible",
    id: "a.com",
    attrs: { "data-domain": "b.com" },
  });

  expect(script.attrs?.["data-domain"]).toBe("b.com");
});

test("gtm honours a self-hosted src override", () => {
  const [script] = analyticsScriptsFor({
    provider: "gtm",
    id: "GTM-ABC",
    src: "https://gtm.example.com/gtm.js",
  });

  expect(script.inline).toContain(
    "j.src=\"https://gtm.example.com/gtm.js\"+'?id='+i",
  );
});

test("gtm falls back to the vendor default when src is not a public http(s) url", () => {
  const [script] = analyticsScriptsFor({
    provider: "gtm",
    id: "GTM-ABC",
    src: "javascript:alert(1)",
  });

  expect(script.inline).toContain(
    "j.src=\"https://www.googletagmanager.com/gtm.js\"+'?id='+i",
  );
  expect(script.inline).not.toContain("javascript:alert(1)");
});

test("a gtm src override containing a quote cannot break out of the script literal", () => {
  // The vulnerable form (fixed in round 2) spliced `base` raw inside single
  // quotes (`j.src='${base}?id='+i`), so a `'` in the value closed the
  // string early and let the rest execute as JS. The fix stops wrapping the
  // value in quotes of its own at all — `JSON.stringify` supplies a
  // complete, self-quoting literal — so assert that vulnerable splice
  // pattern is gone and the value is embedded as a real JS string literal.
  const hostile = "https://evil.example/x';alert(1);//";
  const [script] = analyticsScriptsFor({
    provider: "gtm",
    id: "GTM-ABC",
    src: hostile,
  });

  expect(script.inline).not.toContain(`j.src='${hostile}`);
  expect(script.inline).toContain(`j.src=${JSON.stringify(hostile)}+'?id='+i`);
});

test("a gtm src override containing </script> cannot close the surrounding script tag", () => {
  const hostile = "https://evil.example/</script><script>alert(1)</script>";
  const [script] = analyticsScriptsFor({
    provider: "gtm",
    id: "GTM-ABC",
    src: hostile,
  });

  expect(script.inline).not.toContain("</script>");
  expect(script.inline).toContain(
    `j.src=${escapeJsonLd(JSON.stringify(hostile))}`,
  );
});

test("a gtm src override containing a newline cannot terminate the JS statement early", () => {
  const hostile = "https://evil.example/a\nalert(1)";
  const [script] = analyticsScriptsFor({
    provider: "gtm",
    id: "GTM-ABC",
    src: hostile,
  });

  expect(script.inline).not.toContain(hostile);
  expect(script.inline).toContain(`j.src=${JSON.stringify(hostile)}+'?id='+i`);
});

test("a javascript: src override is ignored in favour of the vendor default", () => {
  const [script] = analyticsScriptsFor({
    provider: "plausible",
    id: "example.com",
    src: "javascript:alert(1)",
  });

  expect(script.src).toBe("https://plausible.io/js/script.outbound-links.js");
});

test("a consumer can register a provider the library has never heard of", () => {
  const seen: AnalyticsEvent[] = [];

  registerAnalyticsAdapter("acme", {
    scripts: (config) => [
      { id: "acme", src: `https://acme.test/${config.id}` },
    ],
    send: (event) => seen.push(event),
  });

  const [script] = analyticsScriptsFor({ provider: "acme", id: "site1" });
  expect(script.src).toBe("https://acme.test/site1");

  sendAnalyticsEvent(
    { name: "link_click", params: { link_title: "Blog" } },
    { provider: "acme", id: "site1" },
  );
  expect(seen).toHaveLength(1);
  expect(seen[0].params.link_title).toBe("Blog");
});

test("trackLinkClicks false suppresses forwarding but not other events", () => {
  const seen: AnalyticsEvent[] = [];
  registerAnalyticsAdapter("acme-mute", {
    scripts: () => [],
    send: (event) => seen.push(event),
  });

  const config = {
    provider: "acme-mute",
    id: "site1",
    trackLinkClicks: false,
  };

  sendAnalyticsEvent({ name: "link_click", params: {} }, config);
  expect(seen).toHaveLength(0);

  sendAnalyticsEvent({ name: "share", params: {} }, config);
  expect(seen).toHaveLength(1);
});

test("linkClickEvent renames the forwarded event", () => {
  const seen: AnalyticsEvent[] = [];
  registerAnalyticsAdapter("acme-rename", {
    scripts: () => [],
    send: (event) => seen.push(event),
  });

  sendAnalyticsEvent(
    { name: "link_click", params: { link_title: "Blog" } },
    {
      provider: "acme-rename",
      id: "site1",
      linkClickEvent: "select_content",
    },
  );

  expect(seen[0].name).toBe("select_content");
  expect(seen[0].params.link_title).toBe("Blog");
});

test("ga send forwards to window.gtag with the vendor's argument shape", () => {
  const globals = globalThis as { gtag?: (...args: unknown[]) => void };
  const previousGtag = globals.gtag;
  const calls: unknown[][] = [];
  globals.gtag = (...args: unknown[]) => {
    calls.push(args);
  };

  try {
    sendAnalyticsEvent(
      { name: "link_click", params: { link_title: "Blog" } },
      { provider: "ga", id: "G-ABC123" },
    );

    expect(calls).toEqual([["event", "link_click", { link_title: "Blog" }]]);
  } finally {
    globals.gtag = previousGtag;
  }
});

test("gtm send pushes an event onto window.dataLayer", () => {
  const globals = globalThis as { dataLayer?: unknown[] };
  const previousDataLayer = globals.dataLayer;
  globals.dataLayer = [];

  try {
    sendAnalyticsEvent(
      { name: "link_click", params: { link_title: "Blog" } },
      { provider: "gtm", id: "GTM-ABC" },
    );

    expect(globals.dataLayer).toEqual([
      { event: "link_click", link_title: "Blog" },
    ]);
  } finally {
    globals.dataLayer = previousDataLayer;
  }
});

test("plausible send forwards the event name and params as props", () => {
  const globals = globalThis as {
    plausible?: (event: string, options?: { props?: object }) => void;
  };
  const previousPlausible = globals.plausible;
  const calls: unknown[][] = [];
  globals.plausible = (...args: unknown[]) => {
    calls.push(args);
  };

  try {
    sendAnalyticsEvent(
      { name: "link_click", params: { link_title: "Blog" } },
      { provider: "plausible", id: "example.com" },
    );

    expect(calls).toEqual([["link_click", { props: { link_title: "Blog" } }]]);
  } finally {
    globals.plausible = previousPlausible;
  }
});

test("umami send calls window.umami.track with the event name and data", () => {
  const globals = globalThis as {
    umami?: { track: (...args: unknown[]) => void };
  };
  const previousUmami = globals.umami;
  const calls: unknown[][] = [];
  globals.umami = {
    track: (...args: unknown[]) => {
      calls.push(args);
    },
  };

  try {
    sendAnalyticsEvent(
      { name: "link_click", params: { link_title: "Blog" } },
      { provider: "umami", id: "abc-123" },
    );

    expect(calls).toEqual([["link_click", { link_title: "Blog" }]]);
  } finally {
    globals.umami = previousUmami;
  }
});

test("sending with no provider configured is a no-op, not a crash", () => {
  // Explicit undefined exercises the "no config passed" path the type allows.
  expect(() =>
    // oxlint-disable-next-line unicorn/no-useless-undefined
    sendAnalyticsEvent({ name: "link_click", params: {} }, undefined),
  ).not.toThrow();
});

// The two tests below cover `<Analytics>`'s forwarding path — the
// `document.addEventListener(LINKFOLIO_ANALYTICS_EVENT, …)` listener its
// `useEffect` installs, which calls `sendAnalyticsEvent` on every dispatched
// event. They live here rather than in tests/analytics-events.spec.ts
// because the component itself cannot be reached: the only place `<Analytics>`
// is rendered with a config is app/layout.tsx (`config={userConfig.analytics}`),
// `config/user.config.ts` sets no `analytics` key, and neither file is in
// this fix round's scope. Mounting the component directly is not an option
// either — the project has no jsdom/testing-library/react-test-renderer
// dependency to render a React component outside a real browser page.
//
// So this replicates the exact listener `<Analytics>` installs, wired from
// the same exported functions it imports (`LINKFOLIO_ANALYTICS_EVENT`,
// `emitAnalyticsEvent`, `sendAnalyticsEvent`), against a minimal fake
// `document` implementing `addEventListener`/`dispatchEvent`. It proves the
// contract the component's effect relies on; it does not execute the
// component's own JSX or effect code, since nothing in this test suite can
// mount it. A true "a configured provider produces a <script> in the DOM"
// assertion is not covered anywhere for the same reason — flagged in the
// task report as an open gap for the reviewer.
type AnalyticsListener = (event: CustomEvent<AnalyticsEvent>) => void;

/** A minimal `EventTarget` stand-in — just enough for the test below. */
class FakeDocument {
  private listeners = new Map<string, Set<AnalyticsListener>>();

  addEventListener(type: string, listener: AnalyticsListener): void {
    const set = this.listeners.get(type) ?? new Set<AnalyticsListener>();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: AnalyticsListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: CustomEvent<AnalyticsEvent>): boolean {
    for (const listener of this.listeners.get(event.type) ?? []) {
      listener(event);
    }

    return true;
  }
}

class FakeCustomEvent<T> {
  type: string;
  detail: T;

  constructor(type: string, init?: { detail?: T }) {
    this.type = type;
    this.detail = init?.detail as T;
  }
}

/**
 * Installs `FakeDocument`/`FakeCustomEvent` as the globals, runs `run`, and
 * restores whatever was there before — even if `run` throws.
 */
function withFakeDom<T>(run: () => T): T {
  const globals = globalThis as { document?: unknown; CustomEvent?: unknown };
  const previousDocument = globals.document;
  const previousCustomEvent = globals.CustomEvent;

  globals.document = new FakeDocument();
  globals.CustomEvent ??= FakeCustomEvent;

  try {
    return run();
  } finally {
    globals.document = previousDocument;
    globals.CustomEvent = previousCustomEvent;
  }
}

test("the DOM event Analytics.tsx listens for reaches a registered adapter's send", () => {
  withFakeDom(() => {
    const seen: AnalyticsEvent[] = [];
    registerAnalyticsAdapter("acme-forward-path", {
      scripts: () => [],
      send: (event) => seen.push(event),
    });

    const config = { provider: "acme-forward-path", id: "site1" };

    // Same wiring as Analytics.tsx's `useEffect`.
    const forward = (event: Event) => {
      const detail = (event as CustomEvent<AnalyticsEvent>).detail;
      if (detail) sendAnalyticsEvent(detail, config);
    };

    document.addEventListener(LINKFOLIO_ANALYTICS_EVENT, forward);

    expect(
      emitAnalyticsEvent({
        name: "link_click",
        params: { link_title: "Blog" },
      }),
    ).toBe(true);

    expect(seen).toEqual([
      { name: "link_click", params: { link_title: "Blog" } },
    ]);

    document.removeEventListener(LINKFOLIO_ANALYTICS_EVENT, forward);

    // The teardown a component unmount would run: after removal, further
    // events must not reach the adapter.
    emitAnalyticsEvent({ name: "link_click", params: { link_title: "Two" } });
    expect(seen).toHaveLength(1);
  });
});
