import React from "react";
import { UserProfile, SocialLinks, Footer } from "..";
import { LinkFolioProps } from "../types";
import defaultConfig from "../default.config";

const LinkFolio: React.FC<LinkFolioProps> = ({
  userConfig,
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-10 md:p-16 lg:px-15% lg:py-10 max-w-screen-lg lg:mx-auto font-roboto rounded-lg sm:m-4 m-2 shadow-lg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
