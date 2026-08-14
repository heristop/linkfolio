import React, { Suspense } from "react";
import UserProfile from "./UserProfile";
import SocialLinks from "./SocialLinks";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import ShareButton from "./ShareButton";
import QrCodeButton from "./QrCodeButton";
import type { LinkFolioProps } from "../types";
import defaultConfig from "../default.config";
import { buildJsonLd } from "../seo/jsonLd";
import { buildLightStyle, buildThemeCss, resolveTheme } from "../lib/themeCss";

/** Keeps the slot's vertical rhythm while a consumer component streams in. */
function SlotFallback() {
  return <div aria-hidden="true" className="h-8 w-full" />;
}

const FALLBACK_TILES = ["a", "b", "c", "d", "e", "f"];

/** The rhythm the bento arrangement produces: a big tile, then smaller ones. */
const BENTO_FALLBACK_TILES = [
  { key: "a", span: "2x2" },
  { key: "b", span: "1x1" },
  { key: "c", span: "1x1" },
  { key: "d", span: "2x1" },
  { key: "e", span: "1x1" },
  { key: "f", span: "1x1" },
];

/**
 * Placeholder grid rendered while the links section streams in. It mirrors the
 * configured layout so the section does not reshuffle as the real cards land.
 *
 * It carries none of the section's semantic classes — `lf-links` here, and
 * `network` on the tiles below. Those are the handles stylesheets and tests
 * reach for, and a placeholder answering to them makes every such selector
 * match two elements, one of which is a stand-in.
 */
function LinksFallback({ bento }: Readonly<{ bento: boolean }>) {
  if (bento) {
    return (
      <div aria-hidden="true" className="w-full animate-pulse">
        <div className="lf-bento px-(--lf-links-padding-x)">
          {BENTO_FALLBACK_TILES.map((tile) => (
            <div
              key={tile.key}
              // No `network` class: that one is hidden until the reveal
              // observer marks it, and nothing observes a placeholder.
              data-span={tile.span}
              className="rounded-lg bg-current opacity-10"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex flex-wrap justify-center w-full gap-[var(--lf-links-gap-y)_var(--lf-links-gap-x)] px-(--lf-links-padding-x) animate-pulse"
    >
      {FALLBACK_TILES.map((tile) => (
        <div
          key={tile}
          className="w-40 h-24 m-2 rounded-lg bg-current opacity-10"
        />
      ))}
    </div>
  );
}

const LinkFolio: React.FC<LinkFolioProps> = ({
  userConfig,
  className,
  UserProfileComponent,
  BeforeSocialLinksComponent,
  SocialLinksComponent,
  AfterSocialLinksComponent,
  FooterComponent,
  renderJsonLd = true,
  renderChrome = true,
  headingLevel = "h1",
  onLinkClick,
}) => {
  const config = userConfig || defaultConfig;
  const UserProfileToRender = UserProfileComponent || UserProfile;
  const SocialLinksToRender = SocialLinksComponent || SocialLinks;
  const FooterToRender = FooterComponent || Footer;

  const jsonLdString = renderJsonLd ? buildJsonLd(config) : undefined;
  const { theme, darkTheme } = resolveTheme(config);
  const lightStyle = buildLightStyle(config, theme);
  const themeCss = buildThemeCss(theme, darkTheme);

  return (
    <div
      className={`lf-card flex flex-col items-center max-w-[min(var(--breakpoint-lg),100%-1rem)] sm:max-w-[min(var(--breakpoint-lg),100%-2rem)] mx-auto my-2 sm:my-4 transition-colors duration-(--lf-motion-slow) text-primary bg-(--lf-card-bg) rounded-(--lf-card-radius) shadow-(--lf-card-shadow) min-h-(--lf-card-min-height) ${className || ""}`}
      style={lightStyle}
    >
      {themeCss && <style>{themeCss}</style>}
      {renderChrome && (
        <div className="self-end flex gap-3">
          <QrCodeButton />
          <ShareButton />
          <ThemeToggle />
        </div>
      )}
      {renderJsonLd && jsonLdString && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      )}
      <UserProfileToRender userConfig={config} headingLevel={headingLevel} />

      {BeforeSocialLinksComponent && (
        <Suspense fallback={<SlotFallback />}>
          <BeforeSocialLinksComponent />
        </Suspense>
      )}

      <Suspense fallback={<LinksFallback bento={config.layout === "bento"} />}>
        <SocialLinksToRender userConfig={config} onLinkClick={onLinkClick} />
      </Suspense>

      {AfterSocialLinksComponent && (
        <Suspense fallback={<SlotFallback />}>
          <AfterSocialLinksComponent />
        </Suspense>
      )}

      <FooterToRender />
    </div>
  );
};

export default LinkFolio;
