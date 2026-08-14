# Linkfolio — Open-Source Link-in-Bio Page for Next.js

Linkfolio is a self-hosted, open-source **Linktree alternative** built with Next.js and Tailwind CSS. It gives you a single fast, accessible link-in-bio page that connects your audience to every one of your online presences — with no account, no subscription, and no third party between you and your visitors.

![Linkfolio](https://github.com/heristop/linkfolio/blob/main/docs/linkfolio.png?raw=true)

## Preview

![Preview](https://github.com/heristop/linkfolio/blob/main/docs/preview.jpg?raw=true)

## Features

🚀 Built with Next.js for optimal performance

💅 Styled using TailwindCSS for a modern look

🛠️ Easy configuration to add or remove links

📱 Responsive design for all devices

🔧 Customizable components for maximum flexibility

## Why self-host instead of using Linktree?

|               | Linkfolio                                            | Hosted link-in-bio services               |
| ------------- | ---------------------------------------------------- | ----------------------------------------- |
| Cost          | Free, MIT licensed                                   | Free tier with paid upgrades              |
| Hosting       | Your own domain and infrastructure                   | Their domain, their infrastructure        |
| Customisation | Full source access; inject your own React components | Limited to the options exposed            |
| Data          | No third-party analytics unless you add them         | Visitor data flows through their platform |
| Performance   | Static Next.js page you control                      | Depends on their platform                 |

## Who it's for

Developers, designers, writers and makers who want a personal link hub they fully control — a single page linking a portfolio, a blog, social profiles and side projects, deployable in minutes to Vercel.

## Installation

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

## Usage

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

## Configuration

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

The grid is tunable through two CSS custom properties, `--lf-bento-columns`
(default `4`) and `--lf-bento-row` (default `8rem`, the height of one small
tile).

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

## Analytics

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

| Provider      | `id` is your…              | Custom events        |
| ------------- | -------------------------- | -------------------- |
| `"ga"`        | GA4 measurement ID (`G-…`) | Yes, via `gtag`      |
| `"gtm"`       | GTM container ID (`GTM-…`) | Yes, via `dataLayer` |
| `"plausible"` | Site domain                | Yes, as props        |
| `"umami"`     | Website ID                 | Yes                  |
| `"beam"`      | Beam token                 | No — see below       |

Beam is the exception. Its only browser event API takes a _path_, not a named
event with parameters, so there is no honest mapping for a `link_click` and
Linkfolio does not invent one. Beam's tag still records page views, and the
`linkfolio:analytics` event above still fires — link clicks simply are not
forwarded for you.

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

> [!IMPORTANT]
>
> Earlier versions injected Beam Analytics from a `NEXT_BEAM_TOKEN`
> environment variable. That never reached the browser — the name lacks the
> `NEXT_PUBLIC_` prefix required for client bundles — so the tag was silently
> inert. Move to `analytics: { provider: "beam", id: "<your token>" }`.

## Customizing Styles with TailwindCSS

Linkfolio uses TailwindCSS for styling. If you wish to customize styles, you can use the default Tailwind configuration `tailwind.config.ts` provided with the package.

## Customizing Fonts

Linkfolio uses the `Raleway` font by default. If you wish to change the font, you can update the `font-family` in `layout.tsx`:

```javascript
import { Roboto } from "next/font/google";

const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
```

## Theme Customization

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

## Testing with Playwright

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

## Example Usage

For a practical implementation of Linkfolio, check out my example repository: [My Linkfolio Page](https://github.com/heristop/my-linkfolio).

This repository demonstrates how to integrate and customize Linkfolio in a Next.js project.

## Contribution

If you have ideas to improve or found a bug, do not hesitate to create an issue or submit a pull request.

## Brand

Linkfolio's code is MIT licensed — fork it, modify it, and redistribute it freely.

The name "Linkfolio" and its logo are **not** covered by the MIT licence. The MIT grant covers copyright in the software, not the project's identity.

You're welcome to reference Linkfolio factually, e.g. "built with Linkfolio", "a fork of Linkfolio", or "compatible with Linkfolio". Please don't use the Linkfolio name or logo as the identity of a derivative project, in a product, company or domain name, or in any way that implies endorsement by or affiliation with this project.

For any other use, please [open an issue](https://github.com/heristop/linkfolio/issues) to ask first.

See [TRADEMARK.md](https://github.com/heristop/linkfolio/blob/main/TRADEMARK.md) for the full trademark policy.

## License

Linkfolio is open-sourced under the [MIT License](LICENSE).
