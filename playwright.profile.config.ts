import { defineConfig, devices } from "@playwright/test";

/**
 * Tests the template's default build — the clean personal deployment a fork
 * gets when LINKFOLIO_SHOWCASE is not set. The main playwright.config.ts
 * builds WITH the flag and covers the showcase site; the two configs share
 * `.next/`, so run them sequentially, never concurrently.
 *
 * The routing and metadata assertions would be identical on every engine, but
 * the visual baseline in visual.spec.ts is not — rendering is exactly what
 * differs between them — so the browser matrix is here rather than in the
 * showcase config.
 */
const port = Number(process.env.PLAYWRIGHT_PROFILE_PORT ?? 3100);

/* Baked into the build, so it also names the baselines: the two layouts are
   different renderings of the same page and each needs its own. */
const layout = process.env.LINKFOLIO_LAYOUT === "bento" ? "bento" : "classic";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/profile",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  snapshotPathTemplate: `{testDir}/{testFileName}-snapshots/${layout}-{arg}-{projectName}-{platform}{ext}`,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
    /* No iPad Pro descriptor ships with Playwright; 1024x1366 is the 12.9"
       portrait viewport, and it sits exactly on the `lg` breakpoint where the
       card's gutter is easiest to get wrong. */
    {
      name: "iPad Pro",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1024, height: 1366 },
      },
    },
  ],
  webServer: {
    /* LINKFOLIO_SHOWCASE=0 explicitly: real process env outranks .env files,
       so a developer machine whose local .env sets the flag still builds the
       clean personal page here. */
    command: `LINKFOLIO_SHOWCASE=0 LINKFOLIO_LAYOUT=${layout} pnpm build && LINKFOLIO_SHOWCASE=0 LINKFOLIO_LAYOUT=${layout} pnpm exec next start -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
