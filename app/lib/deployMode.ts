/**
 * The template ships two sites in one repo: the personal link-in-bio page a
 * fork deploys, and the project's own showcase (landing, /docs, /demo). Which
 * one a deployment is comes from `LINKFOLIO_SHOWCASE`, read at build time —
 * a fork that sets nothing gets the clean personal page.
 *
 * These helpers are pure and import nothing so the node-style specs in
 * tests/ can exercise every branch without a server.
 */

/**
 * Any env-shaped bag — `process.env` and a test's object literal both
 * satisfy it. The variables read: LINKFOLIO_SHOWCASE, NEXT_APP_URL,
 * VERCEL_PROJECT_PRODUCTION_URL.
 */
type DeployEnv = Record<string, string | undefined>;

export function resolveShowcase(env: DeployEnv): boolean {
  return env.LINKFOLIO_SHOWCASE === "1";
}

/**
 * Which arrangement the deployment renders. A fork can pick the mosaic
 * without editing its config, and the visual-regression run uses it to take
 * a baseline of each layout from the same build pipeline.
 */
export function resolveLayout(env: DeployEnv): "classic" | "bento" {
  return env.LINKFOLIO_LAYOUT === "bento" ? "bento" : "classic";
}

/**
 * Resolution order for the deployment's public origin:
 *
 * 1. `NEXT_APP_URL` — the deployment saying so explicitly.
 * 2. Showcase mode: the project's own domain. Hardcoding it is correct here —
 *    only the maintainer's deployment runs in this mode.
 * 3. `VERCEL_PROJECT_PRODUCTION_URL` — the stable production hostname Vercel
 *    provides at build time. Not `VERCEL_URL`: that is the per-deployment
 *    generated hostname, and canonicalising onto it would point every preview
 *    deploy's metadata at an ephemeral URL.
 * 4. Empty string — `buildMetadata` drops `metadataBase`/`og:url` for an
 *    empty origin rather than emitting broken absolute URLs.
 */
export function resolveAppUrl(env: DeployEnv, showcase: boolean): string {
  if (env.NEXT_APP_URL) return env.NEXT_APP_URL.replace(/\/$/, "");
  if (showcase) return "https://linkfolio-demo.vercel.app";
  if (env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return "";
}

/**
 * A personal deployment has exactly one page worth advertising; the marketing
 * routes exist (and are listed) only in showcase mode.
 */
export function buildSitemapEntries(
  origin: string,
  showcase: boolean,
): { url: string; priority: number }[] {
  const entries = [{ url: origin, priority: 1 }];

  if (showcase) {
    entries.push(
      { url: `${origin}/demo`, priority: 0.9 },
      { url: `${origin}/docs`, priority: 0.8 },
      { url: `${origin}/llms.txt`, priority: 0.5 },
      { url: `${origin}/llms-full.txt`, priority: 0.5 },
    );
  }

  return entries;
}
