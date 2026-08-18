# SEO helpers

`buildMetadata` and `buildJsonLd`, for server components that assemble their own metadata or JSON-LD.

## SEO helpers for server components (`linkfolio/seo`)

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

---

[← Back to the README](../README.md)
