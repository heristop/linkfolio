import type { Metadata } from "next";
import { buildMetadata } from "@/seo";
import userConfig from "~/user.config";
import { resolveAppUrl, resolveLayout, resolveShowcase } from "./deployMode";

/**
 * Whether this deployment is the project's own showcase site (landing page,
 * /docs, /demo) rather than someone's personal link-in-bio page. Read once at
 * build time; a fork that sets nothing deploys the clean personal page.
 */
export const isShowcase = resolveShowcase(process.env);

/** The arrangement this deployment renders — see `resolveLayout`. */
export const deployLayout = resolveLayout(process.env);

/**
 * The deployment's own origin, and the single place that reads it.
 *
 * Deriving it in more than one place invites drift, and drift here is not
 * cosmetic: a sitemap advertising one host while the canonical tag names
 * another is how a site tells Google its pages belong to someone else.
 */
export const appUrl = resolveAppUrl(process.env, isShowcase);

const base = buildMetadata(userConfig, { siteUrl: appUrl });

/**
 * Page metadata layered onto the root layout's.
 *
 * Metadata merges shallowly between segments, so a page that declares its own
 * `openGraph` replaces the layout's whole object rather than adding to it —
 * dropping `og:site_name` and `og:locale` without a warning. Spreading the base
 * `openGraph` here keeps those while the page overrides what it owns.
 */
export function pageMetadata(options: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { title, description, path } = options;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      ...base.openGraph,
      type: "website",
      title,
      description,
      url: `${appUrl}${path === "/" ? "" : path}`,
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      title,
      description,
    },
  };
}
