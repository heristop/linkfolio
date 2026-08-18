# Configuration

Every option in `user.config.ts`, from a minimal setup to the full public API.

## Basic Usage

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

## Customization Options

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
| `onLinkClick`  | `(link) => void` | —       | Called when a visitor clicks a link card. Client components only — see [Analytics](./analytics.md) for the server-safe equivalent.                                                                                         |

## Configuration reference

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

## Public configuration API

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

---

[← Back to the README](../README.md)
