import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Pure-logic tests: they import from `src/` and `app/lib/` and call the
 * functions directly, so no browser and no server are involved.
 *
 * These ran under the Playwright runner until now, which meant each one
 * executed once per browser project — six identical runs of code that never
 * touches a page, gated behind a full production build. `playwright.config.ts`
 * ignores this directory so the two runners do not collect each other's files.
 *
 * The default `node` environment is deliberate: the one module that reaches
 * for `document` guards the access, and the tests supply their own stubs for
 * `IntersectionObserver` and the scroll listeners.
 */
export default defineConfig({
  resolve: {
    // Mirrors tsconfig.json's "@/*" path so app/lib modules that import
    // from src/ (e.g. landingJsonLd.ts -> "@/lib/sanitize") resolve the
    // same way here as they do under Next.js's own bundler.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["tests/unit/**/*.spec.ts"],
    environment: "node",
  },
});
