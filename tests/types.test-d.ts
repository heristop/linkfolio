import type {
  AnalyticsConfig,
  AnalyticsProviderName,
  BentoDirection,
  BentoSpan,
  LayoutMode,
  ThemeColors,
  UserConfigType,
} from "../src/types";

/**
 * Compile-time assertions on the public theming API. `ThemeColors` is a closed
 * object type, so excess-property checking makes this file fail to compile if
 * a token is renamed or dropped. Run with `pnpm typecheck`.
 */

/** Every motion token the stylesheet consumes must be themeable. */
export const motionTokens: ThemeColors = {
  "lf-motion-fast": "140ms",
  "lf-motion-base": "220ms",
  "lf-motion-slow": "380ms",
  "lf-motion-reveal": "500ms",
  "lf-ease-out": "cubic-bezier(0.32, 0.72, 0, 1)",
  "lf-ease-spring": "linear(0, 0.083 6%, 1)",
  "lf-press-scale": "0.972",
  "lf-press-scale-sm": "0.94",
  "lf-hover-lift": "-2px",
  "lf-hover-scale": "1.08",
};

/** The motion tokens are additive: every pre-existing key still resolves. */
export const legacyTokens: ThemeColors = {
  "color-primary": "oklch(0.4 0.06 185)",
  "color-secondary": "oklch(0.56 0.06 170)",
  "color-background-start": "oklch(0.9 0.01 180)",
  "color-background-end": "oklch(0.93 0.01 170)",
  "lf-card-bg": "oklch(0.98 0.005 170)",
  "lf-card-shadow": "0 4px 24px -6px oklch(0 0 0 / 0.12)",
  "lf-card-border": "none",
  "lf-name-color": "inherit",
  "lf-alias-color": "oklch(0.4 0 0)",
  "lf-network-hover-bg": "oklch(0 0 0 / 0.03)",
  "lf-description-color": "oklch(0.4 0 0)",
  "lf-accent-line-color": "currentColor",
  "lf-accent-line-opacity": "0.3",
  "lf-button-opacity": "0.6",
};

/**
 * `layout` is optional and closed to the two arrangements the stylesheet
 * implements, so a typo fails to compile rather than silently rendering
 * classic.
 */
export const bentoConfig: UserConfigType = {
  fullName: "Your Name",
  layout: "bento",
};

/** Omitting it stays valid — every existing config keeps compiling. */
export const classicByDefault: UserConfigType = {
  fullName: "Your Name",
};

export const layouts: LayoutMode[] = ["classic", "bento"];

/** Per-link tile controls are optional and closed to the shapes the CSS has. */
export const bentoTiles: UserConfigType = {
  layout: "bento",
  socialNetworks: [
    {
      url: "https://example.com",
      iconSrc: "/icon.webp",
      title: "Portfolio",
      description: "Case studies",
      span: "2x2",
    },
    {
      url: "https://example.com/blog",
      iconSrc: "/icon.webp",
      title: "Blog",
      description: "Writing",
      span: "2x1",
      direction: "horizontal",
    },
    // No span: falls back to the group's default, then to 1x1.
    {
      url: "https://example.com/x",
      iconSrc: "/icon.webp",
      title: "X",
      description: "Posts",
    },
  ],
};

export const spans: BentoSpan[] = ["1x1", "2x1", "1x2", "2x2", "2x3"];
export const directions: BentoDirection[] = ["vertical", "horizontal"];

/** Every built-in provider name must stay spelled the way the docs say. */
export const providers: AnalyticsProviderName[] = [
  "ga",
  "gtm",
  "plausible",
  "umami",
];

/**
 * The provider union is open, so a name registered at runtime through
 * `registerAnalyticsAdapter` still type-checks. Closing this union would
 * silently break every consumer using a provider Linkfolio does not ship.
 */
export const customProvider: AnalyticsConfig = {
  provider: "posthog",
  id: "phc_123",
};

/** Analytics is additive: a config that omits it entirely still compiles. */
export const withoutAnalytics: UserConfigType = {
  fullName: "Your Name",
};

/** The full option surface, so a renamed or dropped key fails to compile. */
export const withAnalytics: UserConfigType = {
  fullName: "Your Name",
  analytics: {
    provider: "plausible",
    id: "example.com",
    src: "https://stats.example.com/js/script.js",
    attrs: { "data-consent": "granted" },
    trackLinkClicks: true,
    linkClickEvent: "select_content",
  },
};

/** A consumer can flatten motion entirely without forking the stylesheet. */
export const staticBuild: ThemeColors = {
  "lf-hover-lift": "0px",
  "lf-press-scale": "1",
  "lf-press-scale-sm": "1",
  "lf-hover-scale": "1",
};
