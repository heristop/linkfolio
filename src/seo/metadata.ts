import type { Metadata } from "next";
import type { UserConfigType } from "../types";

const DEFAULT_LOCALE = "en_US";

/**
 * `new URL` throws on a value with no scheme ("example.com"), and this runs at
 * module scope in a root layout — an unparseable `siteUrl` would take down
 * every route, including the error page. An unusable origin is dropped.
 */
function toMetadataBase(origin: string): URL | undefined {
  if (!origin) return undefined;

  try {
    return new URL(origin);
  } catch {
    return undefined;
  }
}

export function buildMetadata(
  config: UserConfigType,
  options: { siteUrl?: string } = {},
): Metadata {
  // The caller's origin wins: it is the deployment talking (`NEXT_APP_URL`),
  // while `config.siteUrl` is a value carried over from whichever config the
  // template shipped with. The other way round, a fork that sets the env var
  // but never edits the config canonicalises onto the template's own domain.
  const origin = (options.siteUrl ?? config.siteUrl ?? "").replace(/\/$/, "");
  const metadataBase = toMetadataBase(origin);
  const title = config.metaTitle ?? config.fullName ?? "Linkfolio";
  const description = config.metaDescription ?? "";

  return {
    title,
    ...(description && { description }),
    ...(config.keywords?.length && { keywords: config.keywords }),
    ...(metadataBase && { metadataBase }),
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      ...(description && { description }),
      ...(origin && { url: origin }),
      ...(config.fullName && { siteName: config.fullName }),
      locale: config.locale ?? DEFAULT_LOCALE,
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description && { description }),
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    appleWebApp: { capable: true, statusBarStyle: "default", title },
    ...(config.themeColor && {
      other: { "msapplication-TileColor": config.themeColor },
    }),
  };
}
