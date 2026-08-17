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

|                       | Linkfolio                | Linktree                                      | LinkStack                               | Bio.link                               |
| --------------------- | ------------------------ | --------------------------------------------- | --------------------------------------- | -------------------------------------- |
| Cost                  | Free, MIT licensed       | Free tier; paid from €4.50/mo billed annually | Free and open source; hosted from $1/mo | One plan at $7.49/mo, 7-day free trial |
| Account required      | None                     | Yes, a Linktree account                       | Yes, an account on the instance         | Yes, a Bio Link account                |
| Open source           | Yes, MIT                 | —                                             | Yes, AGPL-3.0                           | —                                      |
| Your own domain       | Yes, you deploy it       | No, pages live at linktr.ee/username          | Yes, self-hosted or on the $5/mo plan   | Yes, on the paid plan                  |
| Where your data lives | Your infrastructure      | —                                             | Your own web server when self-hosted    | —                                      |
| Built with            | Next.js and Tailwind CSS | —                                             | PHP and Laravel                         | —                                      |

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

## Documentation

- [Configuration](./docs/configuration.md) — every option in `user.config.ts`
- [Layouts](./docs/layouts.md) — the classic list and the bento mosaic
- [Theming](./docs/theming.md) — presets, colour tokens and motion tokens
- [Analytics](./docs/analytics.md) — the DOM event, built-in providers, custom adapters
- [SEO helpers](./docs/seo.md) — `buildMetadata` and `buildJsonLd` for server components
- [Bundled assets](./docs/assets.md) — importing the shipped icons

Full guide: [linkfolio-demo.vercel.app/docs](https://linkfolio-demo.vercel.app/docs)

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
