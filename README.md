# Linkfolio — Open-Source Link-in-Bio Page for Next.js

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)](https://react.dev)
[![TypeScript 7](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![CI](https://github.com/heristop/linkfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/heristop/linkfolio/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/npm/l/linkfolio?color=0b7285)](./LICENSE)

A self-hosted, open-source **Linktree alternative** built with Next.js and Tailwind CSS. One fast, accessible link-in-bio page that connects your audience to everything you publish — on your own domain, with no account, no subscription and no third party in between.

[**Live demo**](https://linkfolio-demo.vercel.app/demo) · [**Documentation**](https://linkfolio-demo.vercel.app/docs) · [**Deploy your own**](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheristop%2Flinkfolio&env=NEXT_APP_URL&envDescription=Your%20site%27s%20public%20URL&install-command=npm%20install%20%20--legacy-peer-deps)

![Linkfolio — a self-hosted link-in-bio page built with Next.js and Tailwind CSS](https://github.com/heristop/linkfolio/blob/main/docs/preview-light.png?raw=true)

## Quick start

Deploy the template and edit one file:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheristop%2Flinkfolio&env=NEXT_APP_URL&envDescription=Your%20site%27s%20public%20URL&install-command=npm%20install%20%20--legacy-peer-deps)

Everything about your page — name, avatar, links, layout, palette — lives in `config/user.config.ts`. Your deployment is your profile page and nothing else: `/` renders your links.

Already have a Next.js app? Install the package instead:

```bash
npm install linkfolio    # or: pnpm add linkfolio · yarn add linkfolio
```

```tsx
import { LinkFolio } from "linkfolio";
import userConfig from "./user.config";

export default function Page() {
  return <LinkFolio userConfig={userConfig} />;
}
```

## Preview

|                                                       Light                                                       |                                                   Dark                                                    |
| :---------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
|    ![Linkfolio in light mode](https://github.com/heristop/linkfolio/blob/main/docs/preview-light.png?raw=true)    | ![Linkfolio in dark mode](https://github.com/heristop/linkfolio/blob/main/docs/preview-dark.png?raw=true) |
|                                                 **Bento layout**                                                  |                                                **Mobile**                                                 |
| ![Linkfolio bento mosaic layout](https://github.com/heristop/linkfolio/blob/main/docs/preview-bento.png?raw=true) | ![Linkfolio on mobile](https://github.com/heristop/linkfolio/blob/main/docs/preview-mobile.png?raw=true)  |

## Features

- **Two layouts** — a classic wrapping list, or a `bento` mosaic that sizes each tile from the group a link already belongs to.
- **Five theme presets** — teal, ocean, forest, sunset and mauve, each generated from one lightness recipe so they share contrast rather than being eyeballed.
- **Dark mode** — a genuine dark palette, not an inversion, transitioned with the View Transition API.
- **Analytics, optional and pluggable** — a DOM event that works with any tracker, plus adapters you can register for your own.
- **SEO built in** — `linkfolio/seo` exports `buildMetadata` and `buildJsonLd` so server components emit correct metadata and `ProfilePage` structured data.
- **Accessible by default** — keyboard reachable, screen-reader labelled, and honouring `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`.
- **Fast** — a static Next.js page with the React Compiler enabled and images served through `next/image`.
- **Yours to change** — full source access, injectable React components, and every colour and motion value exposed as a CSS custom property.

## Why self-host instead of using Linktree?

<!-- generated:comparison -->
| | Linkfolio | Linktree | LinkStack | Bio.link |
| --- | --- | --- | --- | --- |
| Cost | Free, MIT licensed | Free tier; paid from €4.50/mo billed annually | Free and open source; hosted from $1/mo | One plan at $7.49/mo, 7-day free trial |
| Account required | None | Yes, a Linktree account | Yes, an account on the instance | Yes, a Bio Link account |
| Open source | Yes, MIT | — | Yes, AGPL-3.0 | — |
| Your own domain | Yes, you deploy it | No, pages live at linktr.ee/username | Yes, self-hosted or on the $5/mo plan | Yes, on the paid plan |
| Where your data lives | Your infrastructure | — | Your own web server when self-hosted | — |
| Built with | Next.js and Tailwind CSS | — | PHP and Laravel | — |
<!-- /generated:comparison -->

"—" means the vendor does not publish that information. Competitor details checked August 2026.

## Who it's for

Developers, designers, writers and makers who want a personal link hub they fully control — a single page linking a portfolio, a blog, social profiles and side projects, deployable in minutes to Vercel.

<details>
<summary><b>Installation — template or existing project</b></summary>

There are two methods to get started with Linkfolio:

### 1. Starting with the Linkfolio template

[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheristop%2Flinkfolio&env=NEXT_APP_URL&envDescription=Your%20site%27s%20public%20URL&install-command=npm%20install%20%20--legacy-peer-deps)

Edit the `user.config.ts` file in the `config` directory to personalize and tailor your profile to your preferences.

Using this method, you can quickly deploy a Linkfolio page with Vercel using the provided template. Your deployment is your profile page and nothing else: `/` renders your links, and the project's own marketing pages (landing, `/docs`, `/demo`) are not built.

Set `NEXT_APP_URL` to your site's public URL (e.g. `https://links.example.com`) so the canonical URL, sitemap and Open Graph tags point at your domain. On Vercel it falls back to the project's production URL; on other hosts it is required.

> **Showcase mode** — the project's own demo deployment sets `LINKFOLIO_SHOWCASE=1`, which turns on the marketing landing page, `/docs` and `/demo`. Leave it unset for a personal deployment. The flag is read at build time, so changing it requires a redeploy.

### 2. Integrating into an existing Next.js project

Install the `linkfolio` package in your Next.js / Tailwind project:

```bash
npm install linkfolio
```

Or using Yarn / Pnpm:

```bash
yarn add linkfolio
```

```bash
pnpm add linkfolio
```

</details>

<details>
<summary><b>Usage and customization</b></summary>

### Basic Usage

Here's a simple example of how to use the `<LinkFolio />` component with just the `userConfig`:

```javascript
import { LinkFolio } from "linkfolio";

const userConfig = {
  avatarSrc: "/assets/avatar.webp",
  avatarAlt: "Avatar",
  fullName: "Your Name",
  alias: "@your_alias",
  metaTitle: "LinkFolio",
  metaDescription: "A Hub for all your online links 🔗",
  socialNetworks: [
    {
      url: "https://github.com/{your_alias}",
      iconSrc: githubIcon,
      title: "GitHub",
      description: "Open-source contributions",
    },
    // Add more social networks here
  ],
};

function MyPage() {
  return <LinkFolio userConfig={userConfig} />;
}
```

This basic setup will create a Linkfolio page using the default components and styles.

### Customization Options

For more advanced customization, you can use the optional component props. Here's an example showing how to use custom components and add additional content:

```jsx
import { LinkFolio } from "linkfolio";
import MyCustomFooter from "./MyCustomFooter";

function MyPage() {
  return (
    <LinkFolio
      userConfig={userConfig}
      BeforeSocialLinksComponent={() => (
        <div className="mb-8 text-center">
          <h2>Welcome to my page!</h2>
          <p>Check out my social links below:</p>
        </div>
      )}
      AfterSocialLinksComponent={() => (
        <div className="mt-8 text-center">
          <h2>Thanks for visiting!</h2>
          <p>Reach me on any of these platforms.</p>
        </div>
      )}
      FooterComponent={MyCustomFooter}
    />
  );
}
```

In addition to the content-slot props above, `LinkFolio` accepts the
behavioural props below for embedding the component inside a page that already has
its own document structure — its own `<h1>`, its own JSON-LD, or its own
theme toggle:

| Prop           | Type             | Default | Purpose                                                                                                                                                                                                                    |
| -------------- | ---------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `renderJsonLd` | `boolean`        | `true`  | Renders the component's own `ProfilePage` + `Person` `<script type="application/ld+json">`. Set to `false` when the host page already publishes its own structured data, to avoid a duplicate `Person` entity on that URL. |
| `renderChrome` | `boolean`        | `true`  | Renders the `QrCodeButton` / `ShareButton` / `ThemeToggle` row. Set to `false` when the host page has its own theme toggle, to avoid two controls fighting over global theme state.                                        |
| `headingLevel` | `"h1"` \| `"h2"` | `"h1"`  | Heading level rendered for the full name in `UserProfile`. Set to `"h2"` when embedding `LinkFolio` on a page that already has its own `<h1>`.                                                                             |
| `onLinkClick`  | `(link) => void` | —       | Called when a visitor clicks a link card. Client components only — see [Analytics](#analytics) for the server-safe equivalent.                                                                                             |

</details>

<details>
<summary><b>Configuration reference</b></summary>

The `config/user.config.ts` file (or the `userConfig` object you pass to
`<LinkFolio />` directly) accepts the following options:

| Option              | Type                        | Default       | Purpose                                                                         |
| ------------------- | --------------------------- | ------------- | ------------------------------------------------------------------------------- |
| `avatarSrc`         | `string \| StaticImageData` | —             | Path or imported image for the profile avatar                                   |
| `avatarAlt`         | `string`                    | —             | Alt text for the avatar image                                                   |
| `fullName`          | `string`                    | —             | Display name; used as the `Person` name and Open Graph site name                |
| `alias`             | `string`                    | —             | Username or tagline shown under the name                                        |
| `metaTitle`         | `string`                    | `"Linkfolio"` | Page `<title>`, `og:title`, `twitter:title`                                     |
| `metaDescription`   | `string`                    | —             | Page description, `og:description`, `twitter:description`, `Person.description` |
| `siteUrl`           | `string`                    | —             | Canonical origin, e.g. `"https://example.com"`. See note below.                 |
| `jobTitle`          | `string`                    | —             | `Person.jobTitle` in structured data                                            |
| `worksFor`          | `string`                    | —             | `Person.worksFor` organization name in structured data                          |
| `locale`            | `string`                    | `"en_US"`     | Open Graph locale                                                               |
| `lang`              | `string`                    | `"en"`        | `<html lang>` value                                                             |
| `keywords`          | `string[]`                  | —             | Meta keywords                                                                   |
| `themeColor`        | `string`                    | —             | Browser chrome theme colour; also written to `msapplication-TileColor`          |
| `theme`             | `ThemeColors`               | —             | Light-mode CSS custom property overrides (colours + motion tokens)              |
| `darkTheme`         | `ThemeColors`               | —             | Dark-mode CSS custom property overrides                                         |
| `enableTypingAlias` | `boolean`                   | `false`       | Enable the typewriter effect on the alias                                       |
| `layout`            | `"classic" \| "bento"`      | `"classic"`   | Arrangement of the links section. See below.                                    |
| `analytics`         | `AnalyticsConfig`           | —             | Opt-in analytics provider. Nothing loads unless set. See below.                 |
| `socialNetworks`    | `SocialNetworkType[]`       | `[]`          | Your links: `url`, `iconSrc`, `title`, `description`, `hidden?`, `group?`       |

> [!IMPORTANT]
>
> `siteUrl` isn't cosmetic. It anchors `metadataBase`, the canonical URL,
> `og:url`, resolution of relative image paths (like `avatarSrc`) to absolute
> URLs, and every `@id` in the JSON-LD entity graph (`Person`, `ProfilePage`,
> `ItemList`, `WebSite`). Omit it and those fields are silently dropped, and
> `@id`s fall back to non-resolvable fragment identifiers — the page still
> renders, but the entity graph is measurably weaker.

### Layouts

`classic` (the default) renders one centred, wrapping row per link group.
`bento` merges every group into a single mosaic grid and takes each tile's
size from the `group` the link already declares:

| `group`       | Default tile  |
| ------------- | ------------- |
| `project`     | `2x2` — large |
| `website`     | `2x1` — wide  |
| anything else | `1x1` — small |

Any link can override that with its own `span`, read as **columns x rows**:
`"1x1"`, `"2x1"`, `"1x2"`, `"2x2"` or `"2x3"`. A second field, `direction`,
sets how the card arranges its own contents — `"vertical"` stacks the image
above the title, `"horizontal"` sets them side by side (the default for a
one-row-tall wide tile, which has no vertical room for both):

```javascript
socialNetworks: [
  { url: "...", title: "Portfolio", group: "website", span: "2x2" },
  { url: "...", title: "GitHub", span: "1x2" },
  { url: "...", title: "YouTube", span: "2x1", direction: "horizontal" },
  { url: "...", title: "X" }, // no span: 1x1, from its group
];
```

Both fields are ignored by the classic layout, so adding them costs nothing if
you switch back.

```javascript
const userConfig = {
  // ... other configurations
  layout: "bento",
};
```

Nothing needs annotating to start — an existing `socialNetworks` array becomes
a bento as it stands, because every link already has a group.

Tiles are ordered so the sizes alternate: config files list links group by
group, and honouring that order would produce bands of identical tiles rather
than a mosaic. Relative order within one size is preserved. The grid drops to
two columns under 768px, where every wide and large tile takes a full row.

A `horizontal` card carries a resting surface, since side by side a short
caption can leave enough space between the two halves to read as two separate
things. Four CSS custom properties tune all of this: `--lf-bento-columns`
(default `4`), `--lf-bento-row` (default `8rem`, the height of one small
tile), and `--lf-bento-tile-bg` / `--lf-bento-tile-hover-bg`, both mixed from
`--color-primary` so they follow the palette in either mode.

Example of adding the typewriter effect on the alias:

```javascript
const userConfig = {
  // ... other configurations
  enableTypingAlias: true,
};
```

### SEO helpers for server components (`linkfolio/seo`)

`buildMetadata` and `buildJsonLd` produce the same `Metadata` object and
JSON-LD graph that `<LinkFolio />` builds internally, so you can generate
them yourself — inside `generateMetadata`, a custom `<head>`, or a page that
assembles its own JSON-LD `@graph`.

They are exported from the **`linkfolio/seo`** subpath, not from `linkfolio`:

```javascript
// Server component / route handler
import { buildMetadata, buildJsonLd } from "linkfolio/seo";

export async function generateMetadata() {
  return buildMetadata(userConfig, { siteUrl: "https://example.com" });
}

const jsonLd = buildJsonLd(userConfig, "https://example.com");
```

The root `linkfolio` entry point carries a `"use client"` banner, because it
exports the interactive `<LinkFolio />` component tree. Importing
`buildMetadata` or `buildJsonLd` from `linkfolio` instead of `linkfolio/seo`
and calling them in a server component — `generateMetadata` included — throws.
`linkfolio/seo` has no client-side dependencies, which is why it exists as a
separate export.

### Public configuration API

Linkfolio also exposes a public API to access the user configuration. You can access it via the `/api/config` route. This API returns the configuration data in JSON format, which can be useful for:

- Dynamically integrating your Linkfolio information into other parts of your application
- Allowing third-party applications to fetch your Linkfolio data
- Debugging purposes
- Creating custom widgets or extensions that use your Linkfolio data

Example usage:

```javascript
fetch("https://your-linkfolio-site.com/api/config")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

> [!TIP]
>
> Since this API is public, ensure that you don't include any sensitive information in your Linkfolio configuration that you wouldn't want to be publicly accessible.

</details>

<details>
<summary><b>Analytics</b></summary>

Linkfolio ships no analytics and phones nobody home by default. When you do
want measurement, there are two layers and you can use either or both.

### The DOM event — works with anything, needs no configuration

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

### The provider system — opt into a tracker

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

`trackLinkClicks` and `linkClickEvent` only affect what reaches the provider.
The DOM event is unconditional and always carries `link_click`, so turning
forwarding off never blinds your own listener.

An unknown provider, a missing `id`, or an `id` containing anything but
letters, digits, dots, dashes and underscores is ignored — your page renders
normally and no script is injected.

### Bring your own provider

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

### The callback prop

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

</details>

<details>
<summary><b>Styling, fonts and theming</b></summary>

### Theme presets

`themePreset` picks one of five bundled palettes — `teal`, `ocean`, `forest`, `sunset` and `mauve`. Each is generated from a single lightness recipe with a different hue, so they land at the same contrast instead of being tuned by eye, and each ships a light and a dark palette.

```ts
const userConfig: UserConfig = {
  themePreset: "sunset",
  // `theme` and `darkTheme` still win per key, so a preset can be
  // adopted and then adjusted rather than replaced wholesale.
  darkTheme: { "color-secondary": "oklch(0.78 0.05 30)" },
};
```

The presets are exported too, if you want to read their values or build a picker:

```ts
import { THEME_PRESETS, THEME_PRESET_KEYS } from "linkfolio";
```

### Theme tokens

Every colour, size and typeface the component uses is a CSS custom property.
Set them from the config, where they apply to the light and dark palettes
independently:

```ts
const userConfig: UserConfig = {
  theme: {
    "color-primary": "oklch(0.4 0.06 280)",
    "lf-card-bg": "oklch(0.99 0.005 280)",
    "lf-name-font-family": "Georgia, serif",
  },
  darkTheme: { "lf-card-bg": "oklch(0.22 0.01 280)" },
};
```

…or as plain CSS, which is the easier route when the value refers to something
the config cannot see, such as a `next/font` variable:

```css
@theme {
  --lf-name-font-family: var(--font-display), Georgia, serif;
  --lf-title-font-family: var(--font-display), Georgia, serif;
}
```

| Token group | Tokens                                                                                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette     | `color-primary`, `color-secondary`, `color-background-start`, `color-background-end`                                                                                                                       |
| Card        | `lf-card-bg`, `lf-card-radius`, `lf-card-shadow`, `lf-card-border`, `lf-card-padding-x`, `lf-card-padding-y`, `lf-card-min-height`, `lf-card-backdrop`                                                     |
| Profile     | `lf-name-color`, `lf-name-font-size`, `lf-name-font-weight`, `lf-name-font-family`, `lf-alias-color`, `lf-profile-margin-bottom`, `lf-accent-line-color`, `lf-accent-line-width`, `lf-accent-line-opacity` |
| Cards       | `lf-title-font-family`, `lf-description-color`, `lf-network-hover-bg`                                                                                                                                      |
| Layout      | `lf-links-gap-x`, `lf-links-gap-y`, `lf-links-padding-x`, `lf-bento-columns`, `lf-bento-row`, `lf-bento-tile-bg`, `lf-bento-tile-hover-bg`                                                                 |
| Motion      | `lf-motion-fast`, `lf-motion-base`, `lf-motion-slow`, `lf-motion-reveal`, `lf-ease-out`, `lf-ease-spring`, `lf-press-scale`, `lf-press-scale-sm`, `lf-hover-lift`, `lf-hover-scale`                        |
| Chrome      | `lf-button-opacity`, `lf-footer-opacity`                                                                                                                                                                   |

`lf-name-font-family` and `lf-title-font-family` default to `inherit`, so the
body face applies until you name another. They exist because a typeface was
the one thing the theme could not express — a display font previously required
writing CSS against `.lf-name` and `.lf-title` directly.

### Importing the bundled assets

The package ships the default icon set and the stylesheet:

```ts
import { githubIcon, defaultAvatarIcon } from "linkfolio/assets";
```

```css
@import "linkfolio/assets/globals.css";
```

Linkfolio uses TailwindCSS for styling. If you wish to customize styles, you can use the default Tailwind configuration `tailwind.config.ts` provided with the package.

Linkfolio uses the `Raleway` font by default. If you wish to change the font, you can update the `font-family` in `layout.tsx`:

```javascript
import { Roboto } from "next/font/google";

const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
```

To customize the theme, you can override the default CSS variables in your own CSS file. If you have installed `linkfolio` as a package, you can import the default styles and override the variables like this:

```css
@import "tailwindcss";
@import "linkfolio/dist/assets/globals.css";

@source "../node_modules/linkfolio/dist";

@theme {
  --color-primary: #937fa3;
  --color-secondary: #a56b8c;
  --color-background-start: #e8eff7;
  --color-background-end: #ede8f7;

  --background-image-gradient-background: linear-gradient(
    to bottom,
    var(--color-background-start),
    var(--color-background-end)
  );
}
```

If you are using the template, you can directly modify the `src/assets/globals.css` file.

### Motion tokens

Motion is themeable the same way colour is. Every value below is a CSS custom
property the interaction styles consume, so you can retune the feel — or remove
it entirely — without forking the stylesheet. All of them are also typed on
`ThemeColors`, so they work through the `theme` and `darkTheme` config keys.

| Token                 | Default                          | Controls                    |
| --------------------- | -------------------------------- | --------------------------- |
| `--lf-motion-fast`    | `140ms`                          | Press-down feedback         |
| `--lf-motion-base`    | `220ms`                          | Hover, colour, opacity      |
| `--lf-motion-slow`    | `380ms`                          | Press release, settle       |
| `--lf-motion-reveal`  | `500ms`                          | Card entrance               |
| `--lf-ease-out`       | `cubic-bezier(0.32, 0.72, 0, 1)` | Standard deceleration       |
| `--lf-ease-spring`    | a sampled `linear()` spring      | Settle after a release      |
| `--lf-press-scale`    | `0.972`                          | Press depth on cards        |
| `--lf-press-scale-sm` | `0.94`                           | Press depth on icon buttons |
| `--lf-hover-lift`     | `-2px`                           | Card lift on hover          |
| `--lf-hover-scale`    | `1.08`                           | Icon button growth on hover |

Press-down is deliberately faster than release: the asymmetry is what makes the
interaction feel physical rather than scripted.

For a completely static build, flatten the amplitudes:

```css
@theme {
  --lf-hover-lift: 0px;
  --lf-hover-scale: 1;
  --lf-press-scale: 1;
  --lf-press-scale-sm: 1;
}
```

Visitors who set "reduce motion" in their OS already get a gentler treatment
automatically: transforms and entrance animations are dropped, while opacity
and colour transitions are kept short so a tap still visibly registers.

</details>

<details>
<summary><b>Testing with Playwright</b></summary>

Playwright is used for end-to-end testing to ensure the integrity and functionality of the project.

### Running Tests

To execute the Playwright tests, run the following command:

```bash
npx playwright test
```

### Updating Reference Snapshots

As the project evolves, you might update the UI or functionality, causing the existing reference snapshots to be outdated. In such cases, you'll need to update the snapshots to match the latest changes.

To update the reference snapshots, run:

```bash
npx playwright test --update-snapshots
```

This will run the tests and update any snapshots that don't match the current render of your page.

</details>

## Example Usage

For a practical implementation of Linkfolio, check out my example repository: [My Linkfolio Page](https://github.com/heristop/my-linkfolio).

This repository demonstrates how to integrate and customize Linkfolio in a Next.js project.

## Frequently asked questions

<!-- generated:faq -->
### Is Linkfolio free?

Yes. Linkfolio is open source under the MIT licence. You host it yourself, so there is no subscription and no usage limit.

### How is it different from Linktree?

Linkfolio runs on your own domain and infrastructure. You have full access to the source, can inject your own React components, and no third party sits between you and your visitors.

### Do I need to know Next.js to use it?

No. You can deploy the template to Vercel in one click and personalise it by editing a single configuration file. Knowing Next.js helps if you want to customise components.

### Can I add it to an existing Next.js project?

Yes. Install the linkfolio package and render the LinkFolio component with your own config object.

### Can I use Google Analytics with Linkfolio?

Yes, and it is not the only option. Set analytics: { provider: "ga", id: "G-…" } in your config and Linkfolio loads the tag and reports which link each visitor clicked. Google Tag Manager, Plausible and Umami ship as built-in providers too, you can register your own, and every link card emits a linkfolio:analytics DOM event you can listen to without configuring any provider at all.
<!-- /generated:faq -->

## Contributing

If you have ideas to improve Linkfolio or found a bug, do not hesitate to open an issue or a pull request. [`CONTRIBUTING.md`](./CONTRIBUTING.md) covers local setup, the checks CI runs, and how screenshot baselines are regenerated.

## Brand

Linkfolio's code is MIT licensed — fork it, modify it, and redistribute it freely.

The name "Linkfolio" and its logo are **not** covered by the MIT licence. The MIT grant covers copyright in the software, not the project's identity.

You're welcome to reference Linkfolio factually, e.g. "built with Linkfolio", "a fork of Linkfolio", or "compatible with Linkfolio". Please don't use the Linkfolio name or logo as the identity of a derivative project, in a product, company or domain name, or in any way that implies endorsement by or affiliation with this project.

For any other use, please [open an issue](https://github.com/heristop/linkfolio/issues) to ask first.

See [TRADEMARK.md](https://github.com/heristop/linkfolio/blob/main/TRADEMARK.md) for the full trademark policy.

## License

Linkfolio is open-sourced under the [MIT License](LICENSE).
