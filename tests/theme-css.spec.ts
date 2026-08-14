import { test, expect } from "@playwright/test";
import {
  buildLightStyle,
  buildThemeCss,
  resolveTheme,
} from "../src/lib/themeCss";
import { THEME_PRESETS } from "../src/themes";

test("resolveTheme: no preset passes the config palettes through untouched", () => {
  const theme = { "color-primary": "red" };
  const darkTheme = { "color-primary": "pink" };

  expect(resolveTheme({ theme, darkTheme })).toEqual({ theme, darkTheme });
  expect(resolveTheme({})).toEqual({ theme: undefined, darkTheme: undefined });
});

test("resolveTheme: a preset alone adopts both bundled palettes", () => {
  const { theme, darkTheme } = resolveTheme({ themePreset: "ocean" });

  expect(theme).toEqual(THEME_PRESETS.ocean.theme);
  expect(darkTheme).toEqual(THEME_PRESETS.ocean.darkTheme);
});

test("resolveTheme: an override adjusts one colour without dropping the preset", () => {
  const { theme, darkTheme } = resolveTheme({
    themePreset: "ocean",
    theme: { "color-primary": "rebeccapurple" },
  });

  expect(theme?.["color-primary"]).toBe("rebeccapurple");
  expect(theme?.["lf-card-bg"]).toBe(THEME_PRESETS.ocean.theme["lf-card-bg"]);
  expect(darkTheme).toEqual(THEME_PRESETS.ocean.darkTheme);
});

test("buildLightStyle: maps theme entries to custom properties on the card", () => {
  const style = buildLightStyle(
    { themeColor: "#123456" },
    { "lf-card-bg": "white" },
  ) as Record<string, string>;

  expect(style).toEqual({
    "--color-primary": "#123456",
    "--lf-card-bg": "white",
  });
});

test("buildLightStyle: returns undefined instead of an empty style object", () => {
  expect(buildLightStyle({})).toBeUndefined();
  expect(buildLightStyle({}, {})).toBeUndefined();
});

test("buildLightStyle: drops unsafe values instead of rendering them", () => {
  const style = buildLightStyle(
    { themeColor: "red; } body { display: none }" },
    {
      "lf-card-bg": "white",
      "lf-name-color": "blue; } * { color: red }",
    },
  ) as Record<string, string>;

  expect(style).toEqual({ "--lf-card-bg": "white" });
});

test("buildThemeCss: hoists background variables to :root and .dark", () => {
  const css = buildThemeCss(
    { "color-background-start": "white", "lf-card-bg": "ivory" },
    { "color-background-start": "black" },
  );

  expect(css).toContain(":root { --color-background-start: white; }");
  expect(css).toContain(".dark { --color-background-start: black; }");
  // Card-only variables stay off the page root: they ride the inline style.
  expect(css).not.toContain("ivory");
});

test("buildThemeCss: dark card variables outrank the inline light style", () => {
  const css = buildThemeCss(undefined, { "lf-card-bg": "black" });

  expect(css).toContain(".dark .lf-card { --lf-card-bg: black !important; }");
});

test("buildThemeCss: silently drops unsafe declarations, keeps the rest", () => {
  const css = buildThemeCss(undefined, {
    "lf-card-bg": "black",
    "lf-name-color": "red; } body { display: none }",
  });

  expect(css).toContain("--lf-card-bg: black !important;");
  expect(css).not.toContain("display: none");
});

test("buildThemeCss: no palettes means no <style> content at all", () => {
  expect(buildThemeCss()).toBe("");
  expect(buildThemeCss({}, {})).toBe("");
});
