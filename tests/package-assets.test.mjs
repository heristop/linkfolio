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
