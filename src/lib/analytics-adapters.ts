import type {
  AnalyticsAdapter,
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsScript,
} from "../types";
import { escapeJsonLd, isPublicUrl, isSafeAnalyticsId } from "./sanitize";
import { LINK_CLICK_EVENT } from "./analytics";

/**
 * The globals each vendor's tag installs. Declared narrowly rather than with
 * `any` so a typo in an adapter is a compile error.
 */
type TrackerGlobals = {
  gtag?: (command: string, ...args: unknown[]) => void;
  dataLayer?: unknown[];
  plausible?: (event: string, options?: { props?: object }) => void;
  umami?: { track: (event: string, data?: object) => void };
};

function globals(): TrackerGlobals {
  return globalThis as unknown as TrackerGlobals;
}

const registry = new Map<string, AnalyticsAdapter>();

/**
 * Teach Linkfolio about a provider it does not ship.
 *
 * The built-ins go through this exact function, so a consumer-registered
 * adapter is not a second-class citizen — and re-registering a built-in name
 * replaces it, which is how you point one at a proxy.
 */
export function registerAnalyticsAdapter(
  name: string,
  adapter: AnalyticsAdapter,
): void {
  registry.set(name, adapter);
}

/**
 * Look up an adapter, or `undefined` if nothing is registered under `name`.
 *
 * A caller invoking the returned adapter's `scripts()` directly is
 * responsible for its own guarding: validate `config.id` with
 * `isSafeAnalyticsId` before calling `scripts()`, the way the built-in
 * adapters guard themselves internally.
 */
export function resolveAnalyticsAdapter(
  name: string | undefined,
): AnalyticsAdapter | undefined {
  return name ? registry.get(name) : undefined;
}

/**
 * Whether `config` names a usable provider.
 *
 * A missing id is treated as "not configured" rather than an error: a
 * half-filled config is the normal state of a template someone just cloned,
 * and it must not break their page.
 */
function isUsable(
  config: AnalyticsConfig | undefined,
): config is AnalyticsConfig & { provider: string; id: string } {
  return Boolean(config?.provider && config.id && isSafeAnalyticsId(config.id));
}

/** The scripts to render for `config`, or `[]` when nothing is configured. */
export function analyticsScriptsFor(
  config: AnalyticsConfig | undefined,
): AnalyticsScript[] {
  if (!isUsable(config)) {
    return [];
  }

  const adapter = resolveAnalyticsAdapter(config.provider);
  if (!adapter) {
    return [];
  }

  const scripts: AnalyticsScript[] = [];

  for (const script of adapter.scripts(config)) {
    scripts.push({ ...script, attrs: { ...script.attrs, ...config.attrs } });
  }

  return scripts;
}

/** Forward `event` to the configured provider, if there is one. */
export function sendAnalyticsEvent(
  event: AnalyticsEvent,
  config: AnalyticsConfig | undefined,
): void {
  if (!isUsable(config)) {
    return;
  }

  const adapter = resolveAnalyticsAdapter(config.provider);
  if (!adapter) {
    return;
  }

  if (event.name === LINK_CLICK_EVENT) {
    if (config.trackLinkClicks === false) {
      return;
    }

    adapter.send(
      { ...event, name: config.linkClickEvent ?? event.name },
      config,
    );

    return;
  }

  adapter.send(event, config);
}

// --- Built-in adapters -----------------------------------------------------
// Registered through the public function above, in alphabetical order, so no
// provider is privileged by position or by mechanism.

/**
 * `config.src` when it is a public http(s) URL, else `fallback`.
 *
 * `config.src` ends up as a `<Script src>` in Task 3; a `data:` or
 * `javascript:` override there is a script-execution vector, so every
 * adapter routes its override through this instead of using `config.src`
 * unchecked.
 */
function publicSrc(config: AnalyticsConfig, fallback: string): string {
  return config.src && isPublicUrl(config.src) ? config.src : fallback;
}

registerAnalyticsAdapter("beam", {
  scripts: (config) => [
    {
      id: "lf-beam",
      src: publicSrc(config, "https://beamanalytics.b-cdn.net/beam.min.js"),
      attrs: { "data-token": config.id ?? "" },
    },
  ],
  // Beam's only event API (`window.beam("/some/path")`) takes a path, not a
  // named event with params, so this layer's `{ name, params }` shape does
  // not map onto it. Rather than guess at a mapping, link clicks are not
  // forwarded to Beam.
  send: () => {},
});

registerAnalyticsAdapter("ga", {
  scripts: (config) => {
    // `resolveAnalyticsAdapter` hands this adapter to any caller, not just
    // `analyticsScriptsFor` — guard the sink here too, since an unguarded
    // `id` would be interpolated straight into the inline init script below.
    if (!isSafeAnalyticsId(config.id ?? "")) {
      return [];
    }

    return [
      {
        id: "lf-ga-src",
        src: publicSrc(
          config,
          `https://www.googletagmanager.com/gtag/js?id=${config.id}`,
        ),
      },
      {
        id: "lf-ga-init",
        inline: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${config.id}');`,
      },
    ];
  },
  send: (event) => {
    // A click fired before the vendor tag has attached `window.gtag` is
    // dropped, not queued or replayed once the script loads. Accepted: this
    // layer stays stateless rather than buffering events for a script that
    // may never load (e.g. blocked by an ad blocker).
    globals().gtag?.("event", event.name, event.params);
  },
});

registerAnalyticsAdapter("gtm", {
  scripts: (config) => {
    // See the `ga` adapter above: `resolveAnalyticsAdapter` does not guard
    // its callers, so the sink is guarded here too.
    if (!isSafeAnalyticsId(config.id ?? "")) {
      return [];
    }

    const base = publicSrc(config, "https://www.googletagmanager.com/gtm.js");
    // `base` is attacker-controllable (a self-hosted GTM proxy override) and
    // lands inside an inline <script>, so it cannot be spliced into the
    // single-quoted `j.src='...'` literal directly — a quote in the value
    // would close the string early. `isPublicUrl` above only checks the
    // protocol; it does not make the value safe to splice as text.
    // `JSON.stringify` renders it as a complete, self-quoting JS string
    // literal (escaping quotes, backslashes and control characters), and
    // `escapeJsonLd` additionally neutralises `<`, `>`, `&` and U+2028/2029
    // so it cannot close the surrounding `<script>` tag either. The result
    // is interpolated as a whole literal — no extra quotes added here.
    const baseLiteral = escapeJsonLd(JSON.stringify(base));

    return [
      {
        id: "lf-gtm",
        inline: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src=${baseLiteral}+'?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.id}');`,
      },
    ];
  },
  send: (event) => {
    globals().dataLayer?.push({ event: event.name, ...event.params });
  },
});

registerAnalyticsAdapter("plausible", {
  scripts: (config) => [
    {
      id: "lf-plausible",
      src: publicSrc(
        config,
        "https://plausible.io/js/script.outbound-links.js",
      ),
      attrs: { "data-domain": config.id ?? "" },
    },
  ],
  send: (event) => {
    globals().plausible?.(event.name, { props: event.params });
  },
});

registerAnalyticsAdapter("umami", {
  scripts: (config) => [
    {
      id: "lf-umami",
      src: publicSrc(config, "https://cloud.umami.is/script.js"),
      attrs: { "data-website-id": config.id ?? "" },
    },
  ],
  send: (event) => {
    globals().umami?.track(event.name, event.params);
  },
});
