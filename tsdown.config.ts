import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    seo: "src/seo/index.ts",
    // The palettes are plain data with no client dependency, but the root
    // entry is bannered `"use client"`, which turns every value it exports
    // into a client reference a server component cannot read. They need an
    // entry of their own to stay usable from `generateMetadata` and friends.
    themes: "src/themes.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  deps: {
    neverBundle: ["react"],
  },
  loader: {
    ".svg": "dataurl",
    ".webp": "dataurl",
  },
  inputOptions: {
    // Each component keeps its own `"use client"` for the demo app in this
    // repo, which imports them unbundled. Bundling merges them into one
    // chunk, where the directive is meaningless — the `use-client-banner`
    // plugin below puts the one that matters on the entry — so rolldown's
    // per-file warning about dropping them is expected, not a problem.
    onLog(level, log, defaultHandler) {
      if (log.code === "MODULE_LEVEL_DIRECTIVE") return;

      defaultHandler(level, log);
    },
  },
  plugins: [
    {
      name: "use-client-banner",
      renderChunk(code, chunk) {
        // Only the component entry needs the client boundary. The seo
        // entry re-exports pure, server-safe helpers (buildJsonLd,
        // buildMetadata) — banner them and they become unusable client
        // references from a server component.
        if (chunk.name !== "index") return null;

        return { code: `"use client";\n${code}` };
      },
    },
  ],
});
