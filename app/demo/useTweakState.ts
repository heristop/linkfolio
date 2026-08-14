"use client";

import { useMemo, useState } from "react";
import userConfig from "~/user.config";
import { useThemePreset } from "../lib/ThemePresetProvider";
import type { UserConfigType } from "@/types";
import {
  THEME_PRESETS,
  THEME_PRESET_KEYS,
  type ThemePresetKey,
} from "@/themes";

/**
 * The palettes come from the package — `themePreset` is a real config option,
 * so the panel offers exactly what a consumer can put in their own config
 * rather than maintaining a parallel list.
 */
export type PaletteKey = ThemePresetKey;

export const PALETTES = THEME_PRESETS;
export const PALETTE_KEYS = THEME_PRESET_KEYS;

/** Swatch colours read from each preset's own light theme. */
export function swatchOf(key: PaletteKey) {
  const { theme } = THEME_PRESETS[key];

  return {
    from: theme["color-background-start"],
    to: theme["color-background-end"],
    dot: theme["color-primary"],
  };
}

export type FontKey = "default" | "geometric" | "serif" | "mono";

type FontOption = {
  /** Human label — a visitor picks a look, not a font-family string. */
  label: string;
  /**
   * System font stack applied to the card preview only, via inline style.
   * `undefined` for "Default" leaves the site's own font (loaded once, in
   * `app/layout.tsx`) in place. Every other option is a stack of fonts the
   * OS is expected to already have — no `next/font` import, no network
   * fetch, no font file added to the package.
   */
  stack?: string;
};

export const FONTS: Record<FontKey, FontOption> = {
  default: { label: "Default" },
  geometric: {
    label: "Geometric",
    stack:
      '"Century Gothic", "Avenir Next", "Segoe UI", ui-sans-serif, system-ui, sans-serif',
  },
  serif: {
    label: "Serif",
    stack:
      'Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, "Times New Roman", serif',
  },
  mono: {
    label: "Monospace",
    stack:
      'ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace',
  },
};

export const FONT_KEYS = Object.keys(FONTS) as FontKey[];

export const GROUPS = ["socialnetwork", "website", "project"] as const;
export type Group = (typeof GROUPS)[number];

export const GROUP_LABELS: Record<Group, string> = {
  socialnetwork: "Social networks",
  website: "Websites",
  project: "Projects",
};

export const AVATAR_SIZES = [96, 120, 152] as const;
export type AvatarSize = (typeof AVATAR_SIZES)[number];

/**
 * Taken from the package's own config type rather than re-declared, so a
 * layout added there cannot silently go missing from the panel.
 */
export type Layout = NonNullable<UserConfigType["layout"]>;

export const LAYOUTS: Layout[] = ["classic", "bento"];

export const LAYOUT_LABELS: Record<Layout, string> = {
  classic: "Classic",
  bento: "Bento",
};

const DEFAULTS = {
  palette: "teal" as PaletteKey,
  font: "default" as FontKey,
  layout: "classic" as Layout,
  fullName: userConfig.fullName ?? "Your Name",
  alias: userConfig.alias ?? "@your_alias",
  typingAlias: userConfig.enableTypingAlias ?? true,
  avatarSize: 120 as AvatarSize,
  showText: true,
  showFooter: true,
};

function normalizeGroup(group: string | undefined): Group {
  return group === "website" || group === "project" ? group : "socialnetwork";
}

/** The snippet mirrors the shape of `config/user.config.ts`. */
function buildSnippet(config: {
  fullName: string;
  alias: string;
  typingAlias: boolean;
  avatarSize: AvatarSize;
  palette: PaletteKey;
  layout: Layout;
}): string {
  return [
    "const userConfig: UserConfig = {",
    `  fullName: ${JSON.stringify(config.fullName)},`,
    `  alias: ${JSON.stringify(config.alias)},`,
    `  enableTypingAlias: ${config.typingAlias},`,
    `  avatarSize: ${config.avatarSize},`,
    `  themePreset: ${JSON.stringify(config.palette)},`,
    `  layout: ${JSON.stringify(config.layout)},`,
    "  socialNetworks: [/* your links */],",
    "};",
  ].join("\n");
}

/** Everything the panel controls, kept out of the component that renders it. */
export function useTweakState() {
  // Lives above the route so the choice survives navigating to /docs or a
  // status page, where there is no LinkFolio card to carry it.
  const { preset: palette, setPreset: setPalette } = useThemePreset();
  const [font, setFont] = useState<FontKey>(DEFAULTS.font);
  const [layout, setLayout] = useState<Layout>(DEFAULTS.layout);
  const [fullName, setFullName] = useState(DEFAULTS.fullName);
  const [alias, setAlias] = useState(DEFAULTS.alias);
  const [typingAlias, setTypingAlias] = useState(DEFAULTS.typingAlias);
  const [avatarSize, setAvatarSize] = useState<AvatarSize>(DEFAULTS.avatarSize);
  const [showText, setShowText] = useState(DEFAULTS.showText);
  const [showFooter, setShowFooter] = useState(DEFAULTS.showFooter);
  const [visibleGroups, setVisibleGroups] = useState<ReadonlySet<Group>>(
    () => new Set(GROUPS),
  );

  const snippet = useMemo(
    () =>
      buildSnippet({
        fullName,
        alias,
        typingAlias,
        avatarSize,
        palette,
        layout,
      }),
    [fullName, alias, typingAlias, avatarSize, palette, layout],
  );

  const previewConfig: UserConfigType = useMemo(() => {
    return {
      ...userConfig,
      fullName,
      alias,
      enableTypingAlias: typingAlias,
      avatarSize,
      // The package resolves the preset, including the page background — the
      // panel does not reach into the document itself.
      themePreset: palette,
      theme: undefined,
      darkTheme: undefined,
      layout,
      // Listed explicitly rather than spread-and-override: a link already
      // marked hidden in the config stays hidden whatever the filter says.
      socialNetworks: (userConfig.socialNetworks ?? []).map((network) => ({
        url: network.url,
        iconSrc: network.iconSrc,
        title: network.title,
        description: network.description,
        group: network.group,
        span: network.span,
        direction: network.direction,
        hidden:
          network.hidden === true ||
          !visibleGroups.has(normalizeGroup(network.group)),
      })),
    };
  }, [
    palette,
    fullName,
    alias,
    typingAlias,
    avatarSize,
    layout,
    visibleGroups,
  ]);

  return {
    palette,
    setPalette,
    font,
    setFont,
    layout,
    setLayout,
    fullName,
    setFullName,
    alias,
    setAlias,
    typingAlias,
    setTypingAlias,
    avatarSize,
    setAvatarSize,
    showText,
    setShowText,
    showFooter,
    setShowFooter,
    visibleGroups,
    toggleGroup: (group: Group) =>
      setVisibleGroups((previous) => {
        const next = new Set(previous);

        if (next.has(group)) {
          next.delete(group);
        } else {
          next.add(group);
        }

        return next;
      }),
    reset: () => {
      setPalette(DEFAULTS.palette);
      setFont(DEFAULTS.font);
      setLayout(DEFAULTS.layout);
      setFullName(DEFAULTS.fullName);
      setAlias(DEFAULTS.alias);
      setTypingAlias(DEFAULTS.typingAlias);
      setAvatarSize(DEFAULTS.avatarSize);
      setShowText(DEFAULTS.showText);
      setShowFooter(DEFAULTS.showFooter);
      setVisibleGroups(new Set(GROUPS));
    },
    snippet,
    previewConfig,
  };
}
