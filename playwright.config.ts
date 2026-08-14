import { defineConfig, devices } from "@playwright/test";

/* Overridable so a run can be pinned to its own server. The default port is
   shared with `pnpm dev`, and `reuseExistingServer` will happily test whatever
   is already listening there — including a different build. */
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const baseURL = `http://127.0.0.1:${port}`;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* `*.test.mjs` files belong to the node:test runner (`pnpm test:package`).
     Playwright's default testMatch also claims them, and it would import them
     during collection — running their assertions once per project with their
     results reported nowhere. `tests/profile/` belongs to
     playwright.profile.config.ts, which builds WITHOUT the showcase flag. */
  testIgnore: ["**/*.test.mjs", "**/profile/**"],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },

    /* Test against branded browsers. */
    //{
    //  name: "Microsoft Edge",
    //  use: { ...devices["Desktop Edge"], channel: "msedge" },
    //},
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],

  /* Run your local dev server before starting the tests.
     LINKFOLIO_SHOWCASE is baked in at build time: these suites exercise the
     project's showcase site (landing page, /docs, /demo). The clean personal
     deployment — the default build — is covered by
     playwright.profile.config.ts. */
  webServer: {
    command: `LINKFOLIO_SHOWCASE=1 pnpm build && LINKFOLIO_SHOWCASE=1 pnpm exec next start -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
