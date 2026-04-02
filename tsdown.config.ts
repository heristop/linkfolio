import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { index: "src/index.ts" },
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
  plugins: [
    {
      name: "use-client-banner",
      renderChunk(code) {
        return { code: `"use client";\n${code}` };
      },
    },
  ],
});
