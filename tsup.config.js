import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };

    options.assetNames = "assets/img/[name]";
  },
  loader: {
    ".svg": "dataurl",
  },
});
