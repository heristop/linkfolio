import type { ThemePresetKey } from "./themes";

export type ThemeColors = {
  "color-primary"?: string;
  "color-secondary"?: string;
  "color-background-start"?: string;
  "color-background-end"?: string;
  "lf-card-bg"?: string;
  "lf-card-shadow"?: string;
  "lf-card-border"?: string;
  "lf-name-color"?: string;
  "lf-alias-color"?: string;
  "lf-network-hover-bg"?: string;
  "lf-description-color"?: string;
  "lf-accent-line-color"?: string;
  "lf-accent-line-opacity"?: string;
  "lf-button-opacity"?: string;

  /**
   * Motion scale. Every value below is a CSS custom property consumed by the
   * interaction styles, so a consumer can retune the feel — or flatten it
   * entirely — without forking the stylesheet.
   *
   * For a fully static build, set `lf-hover-lift` to `"0px"` and both press
   * scales to `"1"`.
   */
  "lf-motion-fast"?: string;
  "lf-motion-base"?: string;
  "lf-motion-slow"?: string;
  "lf-motion-reveal"?: string;
  "lf-ease-out"?: string;
  "lf-ease-spring"?: string;
  "lf-press-scale"?: string;
  "lf-press-scale-sm"?: string;
  "lf-hover-lift"?: string;
  "lf-hover-scale"?: string;
};

/**
 * Arrangement of the links section.
 *
 * `"classic"` renders one row per group, wrapping. `"bento"` merges every
 * group into a single mosaic grid where a link's existing `group` sets its
 * tile size — no per-link annotation needed.
 */
export type LayoutMode = "classic" | "bento";

/**
 * Tile footprint in the bento grid, read as `columns x rows`. Ignored by the
 * classic layout.
 */
export type BentoSpan = "1x1" | "2x1" | "1x2" | "2x2" | "2x3";

/**
 * How a bento card arranges its own contents. `vertical` stacks the image
 * above the title; `horizontal` sets them side by side, which is what keeps a
 * one-row-tall wide tile readable.
 */
export type BentoDirection = "vertical" | "horizontal";

export type UserConfigType = {
  avatarSrc?: string | StaticImageData;
  avatarAlt?: string;
  avatarSize?: avatarSize;
  fullName?: string;
  alias?: string;
  metaTitle?: string;
  metaDescription?: string;
  /** Canonical origin, e.g. "https://example.com". Resolves relative image paths to absolute. */
  siteUrl?: string;
  /** Person.jobTitle in structured data. */
  jobTitle?: string;
  /** Person.worksFor organization name in structured data. */
  worksFor?: string;
  /** Open Graph locale. Defaults to "en_US". */
  locale?: string;
  /** <html lang> value. Defaults to "en". */
  lang?: string;
  /** Meta keywords. */
  keywords?: string[];
  themeColor?: string;
  /**
   * Name of a bundled palette ("teal" | "ocean" | "forest" | "sunset" |
   * "mauve"). It sets both light and dark variables, including the page
   * background. `theme`/`darkTheme` below still win where they are set.
   */
  themePreset?: ThemePresetKey;
  theme?: ThemeColors;
  darkTheme?: ThemeColors;
  enableTypingAlias?: boolean;
  /**
   * How the links section is arranged. Defaults to `"classic"`.
   *
   * `"bento"` merges the groups into one grid and sizes each tile from the
   * link's `group`: `project` spans 2 columns x 2 rows, `website` 2 x 1,
   * everything else 1 x 1. Set `span` on a link to override its tile.
   *
   * Under 768px the grid drops to two columns and the wide tiles take a full
   * row. Bento reorders the links so tile sizes alternate — relative order
   * within one size is kept, but a link's position in `socialNetworks` is not
   * its position on the page.
   */
  layout?: LayoutMode;
  /**
   * Opt-in analytics. Omit it and Linkfolio loads no third-party script at
   * all — the link cards still emit a `linkfolio:analytics` DOM event that
   * anything on the page can listen to.
   */
  analytics?: AnalyticsConfig;
  socialNetworks?: SocialNetworkType[];
};

export interface LinkFolioProps {
  userConfig?: UserConfigType;
  className?: string;
  UserProfileComponent?: React.ComponentType<UserProfileProps>;
  BeforeSocialLinksComponent?: React.ComponentType;
  SocialLinksComponent?: React.ComponentType<SocialLinksProps>;
  AfterSocialLinksComponent?: React.ComponentType;
  FooterComponent?: React.ComponentType<FooterProps>;
  /**
   * Render the component's own schema.org `<script type="application/ld+json">`
   * (a `ProfilePage` + `Person` graph). Defaults to `true`. Set to `false` when
   * embedding `LinkFolio` on a page that already publishes its own structured
   * data, to avoid a duplicate `Person` entity on that URL.
   */
  renderJsonLd?: boolean;
  /**
   * Render the `QrCodeButton` / `ShareButton` / `ThemeToggle` chrome row.
   * Defaults to `true`. Set to `false` when embedding `LinkFolio` on a page
   * that has its own theme toggle, to avoid two controls fighting over
   * global theme state.
   */
  renderChrome?: boolean;
  /**
   * Heading level rendered for the full name in `UserProfile`. Defaults to
   * `"h1"`. Set to `"h2"` when embedding `LinkFolio` on a page that already
   * has its own `<h1>`.
   */
  headingLevel?: "h1" | "h2";
  /**
   * Called when a visitor clicks a link card, in addition to the
   * `linkfolio:analytics` DOM event that always fires.
   *
   * A function prop can only be passed from a client component. From a server
   * component, listen for the DOM event instead — it carries the same data.
   */
  onLinkClick?: (link: SocialNetworkType) => void;
}

export interface UserProfileProps {
  userConfig: UserConfigType;
  /** Heading level for the full name. Defaults to `"h1"`. */
  headingLevel?: "h1" | "h2";
}

export interface SocialLinksProps {
  userConfig: UserConfigType;
  onLinkClick?: (link: SocialNetworkType) => void;
  /**
   * Heading level `UserProfile` rendered the full name at. Card titles sit one
   * level below it, so they nest under the profile name instead of becoming
   * its siblings. Defaults to `"h1"`, which puts card titles at `h2`.
   */
  headingLevel?: "h1" | "h2";
}

export type SocialNetworkType = {
  url: string;
  iconSrc: string | StaticImageData;
  title: string;
  description: string;
  hidden?: boolean;
  group?: string;
  /**
   * Tile footprint in the bento grid (`layout: "bento"`), as `columns x rows`.
   * Defaults to the group's size: `project` 2x2, `website` 2x1, everything
   * else 1x1. Ignored by the classic layout.
   */
  span?: BentoSpan;
  /**
   * Whether this bento card stacks its image above the text (`vertical`) or
   * sets them side by side (`horizontal`). Defaults to `horizontal` for a
   * one-row-tall wide tile, `vertical` otherwise. Ignored by the classic
   * layout.
   */
  direction?: BentoDirection;
};

/**
 * A tracker-shaped event. `params` is flat and primitive-valued because every
 * destination — gtag, dataLayer, Plausible props, Umami event data — accepts
 * that shape and nothing richer.
 */
export type AnalyticsEvent = {
  name: string;
  params: Record<string, string | number | boolean>;
};

/** One `<script>` an adapter wants on the page. */
export type AnalyticsScript = {
  /** Stable, unique — `next/script` needs it to dedupe across navigations. */
  id: string;
  /** External source. Omit for a bootstrap snippet. */
  src?: string;
  /** Inline body. Every interpolated config value must be guarded first. */
  inline?: string;
  /**
   * Extra attributes, e.g. `{ "data-domain": "example.com" }`.
   *
   * String-valued only, and deliberately not the place for `async`/`defer`:
   * `<Script strategy="afterInteractive">` already controls loading, and
   * those two props are typed `boolean` on `next/script`, so a string would
   * not type-check when spread.
   */
  attrs?: Record<string, string>;
};

/**
 * The whole contract a provider has to satisfy. Two methods, no lifecycle, no
 * base class — so registering an unlisted vendor is a small object literal.
 */
export type AnalyticsAdapter = {
  /** Scripts to render. Return `[]` to load nothing (already-present tag). */
  scripts(config: AnalyticsConfig): AnalyticsScript[];
  /** Forward one event to whatever global `scripts()` installed. */
  send(event: AnalyticsEvent, config: AnalyticsConfig): void;
};

/** The adapters that ship built in. Consumers may register any other name. */
export type AnalyticsProviderName = "ga" | "gtm" | "plausible" | "umami";

export type AnalyticsConfig = {
  /**
   * Which registered adapter to use. Omit and nothing is loaded — link cards
   * still emit `linkfolio:analytics`, so a consumer can listen directly.
   * The union is open so `registerAnalyticsAdapter("posthog", …)` type-checks.
   */
  provider?: AnalyticsProviderName | (string & {});
  /** Measurement id, container id, site domain — whatever the provider keys on. */
  id?: string;
  /** Override the script origin, for self-hosted or proxied trackers. */
  src?: string;
  /** Extra attributes merged onto every script the adapter returns. */
  attrs?: Record<string, string>;
  /** Forward link clicks to the provider. Defaults to `true`. */
  trackLinkClicks?: boolean;
  /** Rename the forwarded event, e.g. `"select_content"`. Defaults to `"link_click"`. */
  linkClickEvent?: string;
};

export interface SocialNetworkProps {
  config: SocialNetworkType;
  delay?: number;
  priority?: boolean;
  onLinkClick?: (link: SocialNetworkType) => void;
  /** Heading level for the card title. Defaults to `"h2"`. */
  titleLevel?: "h2" | "h3";
}

export interface FooterProps {
  children?: {
    defaultContent?: React.ReactNode;
  };
}
