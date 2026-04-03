import React from "react";
import UserProfile from "./UserProfile";
import SocialLinks from "./SocialLinks";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import ShareButton from "./ShareButton";
import QrCodeButton from "./QrCodeButton";
import type { LinkFolioProps } from "../types";
import defaultConfig from "../default.config";

const LinkFolio: React.FC<LinkFolioProps> = ({
  userConfig,
  className,
  UserProfileComponent,
  BeforeSocialLinksComponent,
  SocialLinksComponent,
  AfterSocialLinksComponent,
  FooterComponent,
}) => {
  const config = userConfig || defaultConfig;
  const UserProfileToRender = UserProfileComponent || UserProfile;
  const SocialLinksToRender = SocialLinksComponent || SocialLinks;
  const FooterToRender = FooterComponent || Footer;

  const socialUrls =
    config.socialNetworks
      ?.filter((n) => !n.hidden && n.url)
      .map((n) => n.url) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: config.fullName,
      ...(config.alias && { alternateName: config.alias }),
      ...(config.avatarSrc &&
        typeof config.avatarSrc === "string" && { image: config.avatarSrc }),
      ...(socialUrls.length > 0 && { sameAs: socialUrls }),
    },
  };

  const jsonLdString = JSON.stringify(jsonLd);

  const lightStyle: Record<string, string> = {};
  if (config.themeColor) lightStyle["--color-primary"] = config.themeColor;
  if (config.theme) {
    for (const [key, value] of Object.entries(config.theme)) {
      lightStyle[`--${key}`] = value;
    }
  }

  let darkCss = "";
  if (config.darkTheme) {
    const bgVars = ["color-background-start", "color-background-end"];
    const cardDecls: string[] = [];
    const rootDecls: string[] = [];

    for (const [key, val] of Object.entries(config.darkTheme)) {
      const decl = `--${key}: ${val};`;
      cardDecls.push(decl);
      if (bgVars.includes(key)) rootDecls.push(decl);
    }

    darkCss = `.dark .lf-card { ${cardDecls.join(" ")} }`;
    if (rootDecls.length) darkCss += ` .dark { ${rootDecls.join(" ")} }`;
  }

  return (
    <div
      className={`lf-card flex flex-col items-center max-w-screen-lg lg:mx-auto sm:m-4 m-2 transition-colors duration-300 text-[var(--color-primary)] bg-[var(--lf-card-bg)] rounded-[var(--lf-card-radius)] shadow-[var(--lf-card-shadow)] border-[length:0] border-[var(--lf-card-border)] p-[var(--lf-card-padding-y)_var(--lf-card-padding-x)] min-h-[var(--lf-card-min-height)] backdrop-blur-[var(--lf-card-backdrop)] ${className || ""}`}
      style={Object.keys(lightStyle).length ? lightStyle as React.CSSProperties : undefined}
    >
      {darkCss && (
        <style>{darkCss}</style>
      )}
      <div className="self-end flex gap-3">
        <QrCodeButton />
        <ShareButton />
        <ThemeToggle />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <UserProfileToRender userConfig={config} />

      {BeforeSocialLinksComponent && <BeforeSocialLinksComponent />}

      <SocialLinksToRender userConfig={config} />

      {AfterSocialLinksComponent && <AfterSocialLinksComponent />}

      <FooterToRender />
    </div>
  );
};

export default LinkFolio;
