import React from "react";
import { UserProfile, SocialLinks, Footer } from "..";
import { LinkFolioProps } from "../types";
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

  return (
    <div
      className={`lf-card flex flex-col items-center max-w-screen-lg lg:mx-auto font-roboto sm:m-4 m-2 ${className || ""}`}
      style={{
        backgroundColor: "var(--lf-card-bg)",
        borderRadius: "var(--lf-card-radius)",
        boxShadow: "var(--lf-card-shadow)",
        border: "var(--lf-card-border)",
        padding: "var(--lf-card-padding-y) var(--lf-card-padding-x)",
        minHeight: "var(--lf-card-min-height)",
        backdropFilter: "var(--lf-card-backdrop)",
        WebkitBackdropFilter: "var(--lf-card-backdrop)",
        ...(config.themeColor && { "--color-primary": config.themeColor } as React.CSSProperties),
      }}
    >
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
