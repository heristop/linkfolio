import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const packageJson = JSON.parse(
  readFileSync(join(repoRoot, "package.json"), "utf8"),
);

test("package includes webp assets", () => {
  const cacheDir = mkdtempSync(join(tmpdir(), "linkfolio-npm-cache-"));

  try {
    const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        npm_config_cache: cacheDir,
      },
    });
    const [packResult] = JSON.parse(output);
    const packagedFiles = new Set(packResult.files.map((file) => file.path));
    const expectedAssets = readdirSync(join(repoRoot, "src/assets/img"))
      .filter((file) => file.endsWith(".webp"))
      .map((file) => `dist/assets/img/${file}`);
    const missingAssets = expectedAssets.filter(
      (file) => !packagedFiles.has(file),
    );

    assert.equal(packResult.name, packageJson.name);
    assert.equal(packResult.version, packageJson.version);
    assert.deepEqual(missingAssets, []);
  } finally {
    rmSync(cacheDir, { force: true, recursive: true });
  }
});

test("package excludes sourcemaps", () => {
  const cacheDir = mkdtempSync(join(tmpdir(), "linkfolio-npm-cache-"));

  try {
    const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        npm_config_cache: cacheDir,
      },
    });
    const [packResult] = JSON.parse(output);
    const sourcemaps = packResult.files
      .map((file) => file.path)
      .filter((file) => file.endsWith(".map"));

    assert.deepEqual(sourcemaps, []);
  } finally {
    rmSync(cacheDir, { force: true, recursive: true });
  }
});

test("use client banner is scoped to the component entry, not the seo entry", () => {
  const indexCjs = readFileSync(join(repoRoot, "dist/index.cjs"), "utf8");
  const indexMjs = readFileSync(join(repoRoot, "dist/index.mjs"), "utf8");
  const seoCjs = readFileSync(join(repoRoot, "dist/seo.cjs"), "utf8");
  const seoMjs = readFileSync(join(repoRoot, "dist/seo.mjs"), "utf8");
  const themesCjs = readFileSync(join(repoRoot, "dist/themes.cjs"), "utf8");
  const themesMjs = readFileSync(join(repoRoot, "dist/themes.mjs"), "utf8");

  // The component entry is a client boundary: every consumer of
  // LinkFolio/ThemeProvider/etc. relies on this banner being present.
  assert.ok(
    indexCjs.startsWith('"use client";'),
    "dist/index.cjs must start with the use client banner",
  );
  assert.ok(
    indexMjs.startsWith('"use client";'),
    "dist/index.mjs must start with the use client banner",
  );

  // The seo entry (buildJsonLd, buildMetadata) is pure and server-safe.
  // Banner-ing it turns these functions into unusable client references
  // when imported from a server component — the defect this test guards
  // against.
  assert.ok(
    !seoCjs.startsWith('"use client";'),
    "dist/seo.cjs must NOT start with the use client banner",
  );
  assert.ok(
    !seoMjs.startsWith('"use client";'),
    "dist/seo.mjs must NOT start with the use client banner",
  );

  // THEME_PRESETS is plain data. Bannered, a server component reading it gets
  // a client reference and throws on property access.
  assert.ok(
    !themesCjs.startsWith('"use client";'),
    "dist/themes.cjs must NOT start with the use client banner",
  );
  assert.ok(
    !themesMjs.startsWith('"use client";'),
    "dist/themes.mjs must NOT start with the use client banner",
  );
});

test("every documented subpath resolves through the exports map", async () => {
  const { createRequire } = await import("node:module");
  const { symlinkSync, mkdirSync } = await import("node:fs");

  // Resolution has to happen from *outside* the package: an `exports` map only
  // gates specifiers that go through node_modules. README tells consumers to
  // import the stylesheet by package path, and a map that omits the subpath
  // turns that instruction into ERR_PACKAGE_PATH_NOT_EXPORTED.
  const consumer = mkdtempSync(join(tmpdir(), "linkfolio-consumer-"));

  try {
    mkdirSync(join(consumer, "node_modules"));
    symlinkSync(repoRoot, join(consumer, "node_modules/linkfolio"), "dir");

    const require = createRequire(join(consumer, "index.cjs"));

    for (const subpath of [
      "linkfolio",
      "linkfolio/seo",
      "linkfolio/themes",
      "linkfolio/dist/assets/globals.css",
      "linkfolio/package.json",
    ]) {
      assert.doesNotThrow(
        () => require.resolve(subpath),
        `${subpath} must be resolvable`,
      );
    }
  } finally {
    rmSync(consumer, { force: true, recursive: true });
  }
});

test("package excludes demo app routes and policy docs", () => {
  const cacheDir = mkdtempSync(join(tmpdir(), "linkfolio-npm-cache-"));

  try {
    const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        npm_config_cache: cacheDir,
      },
    });
    const [packResult] = JSON.parse(output);
    const packagedFiles = new Set(packResult.files.map((file) => file.path));

    const demoRouteLeaks = [...packagedFiles].filter((file) =>
      file.startsWith("app/"),
    );
    assert.deepEqual(demoRouteLeaks, []);

    const policyDocLeaks = [...packagedFiles].filter(
      (file) => file === "TRADEMARK.md",
    );
    assert.deepEqual(policyDocLeaks, []);

    const topLevelEntries = [
      ...new Set([...packagedFiles].map((file) => file.split("/")[0])),
    ].toSorted();
    assert.deepEqual(
      topLevelEntries,
      [
        "CHANGELOG.md",
        "LICENSE",
        "README.md",
        "dist",
        "package.json",
      ].toSorted(),
    );
  } finally {
    rmSync(cacheDir, { force: true, recursive: true });
  }
});
