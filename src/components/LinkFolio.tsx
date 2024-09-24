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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-10 md:p-16 lg:px-15% lg:py-10 max-w-screen-lg lg:mx-auto font-roboto rounded-lg sm:m-4 m-2 shadow-lg">
      <UserProfileToRender userConfig={config} />

      {BeforeSocialLinksComponent && <BeforeSocialLinksComponent />}

      <SocialLinksToRender userConfig={config} />

      {AfterSocialLinksComponent && <AfterSocialLinksComponent />}

      <FooterToRender />
    </div>
  );
};

export default LinkFolio;
