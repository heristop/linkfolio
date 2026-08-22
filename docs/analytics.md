# Analytics

The DOM event, the built-in provider adapters, and how to register your own.

Linkfolio ships no analytics and phones nobody home by default. When you do
want measurement, there are two layers and you can use either or both.

## The DOM event — works with anything, needs no configuration

Every link card dispatches a `linkfolio:analytics` `CustomEvent` on `document`
when it is clicked, whether or not a provider is configured:

```javascript
document.addEventListener("linkfolio:analytics", (event) => {
  const { name, params } = event.detail;
  // name   → "link_click"
  // params → { link_title, link_url, link_group }
  myTracker.record(name, params);
});
```

Middle-clicks are reported too: opening a link in a background tab is a real
navigation that a `click` handler never sees. `link_url` is the sanitised URL
the anchor actually points at, so a `url` your config got wrong is reported as
`"#"` rather than as a destination the visitor never reached.

Each anchor also carries `data-lf-link`, `data-lf-url` and `data-lf-group`, so
a tag manager can build triggers off the DOM without any code from you.

The event and payload names are exported as `LINKFOLIO_ANALYTICS_EVENT` and
`LINK_CLICK_EVENT` if you would rather not hard-code the strings.

## The provider system — opt into a tracker

Name a provider in your config and Linkfolio loads its tag and forwards the
events to it:

```javascript
const userConfig = {
  // ... other configurations
  analytics: {
    provider: "plausible",
    id: "example.com",
  },
};
```

Then render `<Analytics config={userConfig.analytics} />` once, at the end of
your `<body>` — the template already does this in `app/layout.tsx`.

The shipped `config/user.config.ts` reads its GA id from `NEXT_PUBLIC_GA_ID`
rather than hardcoding one, so cloning the template does not point your traffic
at somebody else's property. Set it in your host's environment (Vercel →
Settings → Environment Variables) to switch analytics on; leave it unset and no
third-party script is loaded at all. The `NEXT_PUBLIC_` prefix is required — see
the note at the end of this section.

| Provider      | `id` is your…              | Custom events        |
| ------------- | -------------------------- | -------------------- |
| `"ga"`        | GA4 measurement ID (`G-…`) | Yes, via `gtag`      |
| `"gtm"`       | GTM container ID (`GTM-…`) | Yes, via `dataLayer` |
| `"plausible"` | Site domain                | Yes, as props        |
| `"umami"`     | Website ID                 | Yes                  |

Two provider quirks worth knowing before you read your dashboard. Plausible's
default script is `script.outbound-links.js`, which already records outbound
clicks on its own, so a card click shows up twice under two names — Plausible's
`Outbound Link: Click` and the forwarded `link_click`. Point `src` at a plain
`script.js` if you only want one. And GTM only pushes to `dataLayer`: nothing
is recorded until you add a trigger for the `link_click` event in your
container.

| Option            | Type                     | Default        | Purpose                                              |
| ----------------- | ------------------------ | -------------- | ---------------------------------------------------- |
| `provider`        | `string`                 | —              | Which adapter to use. Omit to load nothing.          |
| `id`              | `string`                 | —              | Measurement ID, container ID, site domain or token.  |
| `src`             | `string`                 | vendor default | Override the script origin, for self-hosted proxies. |
| `attrs`           | `Record<string, string>` | —              | Extra attributes merged onto every injected script.  |
| `trackLinkClicks` | `boolean`                | `true`         | Forward link clicks to the provider.                 |
| `linkClickEvent`  | `string`                 | `"link_click"` | Rename the forwarded event, e.g. `"select_content"`. |

`src` must be an `http(s)` URL. That string becomes a `<script src>`, so
anything else — a `data:` or `javascript:` value — is ignored and the vendor
default is used instead. `attrs` is string-valued and is deliberately not the
place for `async` or `defer`: loading is already controlled by `next/script`'s
`strategy="afterInteractive"`.

Together, `src` and `attrs` are what a self-hosted tracker needs. Umami is the
common case — every adapter defaults to its vendor's cloud, so an instance you
run yourself has to be named explicitly or the tag quietly reports to theirs:

```javascript
analytics: {
  provider: "umami",
  id: "00000000-0000-0000-0000-000000000000", // the website id from your dashboard
  // Your instance, not cloud.umami.is. Absolute http(s) only — see below.
  src: "https://umami.example.com/script.js",
  // Only when the collect API answers on another origin than the script.
  attrs: { "data-host-url": "https://collect.example.com" },
},
```

Get that `src` wrong and nothing tells you. A path like `/stats/script.js`, or
a bare `umami.example.com/script.js`, is not an absolute `http(s)` URL, so it
is rejected and the vendor default takes its place — the page then loads Umami
Cloud with your website id and reports every visit there. Validate the value
where you set it; the library cannot tell a typo from a deliberate cloud setup.

Linkfolio renders no cookie banner under any provider. Whether your site needs
one is yours to decide, but the input to that decision is what a tracker puts
on the visitor's device: Umami's script sets no cookie and writes no id there,
while `ga` and `gtm` do. Umami still derives a pseudonymous visitor hash
server-side, so "no cookie" is not the same as "no personal data" — which is a
question for your jurisdiction, not for this table.

`trackLinkClicks` and `linkClickEvent` only affect what reaches the provider.
The DOM event is unconditional and always carries `link_click`, so turning
forwarding off never blinds your own listener.

An unknown provider, a missing `id`, or an `id` containing anything but
letters, digits, dots, dashes and underscores is ignored — your page renders
normally and no script is injected.

## Bring your own provider

The five above are registered through the same public function you have, so
adding a sixth is not a fork:

```javascript
import { registerAnalyticsAdapter } from "linkfolio";

registerAnalyticsAdapter("posthog", {
  scripts: (config) => [
    {
      id: "lf-posthog",
      src: `https://eu.posthog.com/static/array.js?token=${config.id}`,
    },
  ],
  send: (event) => window.posthog?.capture(event.name, event.params),
});

// then: analytics: { provider: "posthog", id: "phc_…" }
```

Run the registration at module scope in a **client** module — one carrying
`"use client"` — that your page imports, so it has happened by the time
`<Analytics>` renders. The client part matters: the `linkfolio` entry point is
bannered `"use client"`, so `registerAnalyticsAdapter` and the other runtime
exports are client references, and merely reading them from a server component
throws. Return `inline` instead of `src` for a bootstrap snippet — but
remember you own the escaping of anything you interpolate into it.

Registering an existing name replaces it, which is how you point a built-in at
your own proxy. `resolveAnalyticsAdapter(name)` hands you the currently
registered adapter if you would rather wrap one than replace it; calling its
`scripts()` yourself means validating `config.id` yourself too.

## The callback prop

If you render `<LinkFolio />` from a client component, `onLinkClick` is the
shorter path:

```jsx
<LinkFolio
  userConfig={userConfig}
  onLinkClick={(link) => console.log(link.title, link.url)}
/>
```

Functions cannot cross a server-component boundary, so from a server component
listen for the `linkfolio:analytics` DOM event instead — it carries the same
data.

---

[← Back to the README](../README.md)
