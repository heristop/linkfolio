import React from "react";
import { UserProfile, SocialLinks, Footer } from "..";
import { LinkFolioProps } from "../types";
import defaultConfig from "../default.config";

const LinkFolio = ({
  userConfig,
  additionalContent,
  footerContent,
}: LinkFolioProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-10 md:p-16 lg:px-15% lg:py-10 max-w-screen-lg lg:mx-auto font-roboto rounded-lg sm:m-4 m-2 shadow-lg">
      <UserProfile userConfig={userConfig || defaultConfig} />

      <SocialLinks userConfig={userConfig || defaultConfig} />

      {additionalContent ? additionalContent : null}

      <Footer>{{ defaultContent: footerContent }}</Footer>
    </div>
  );
};

export default LinkFolio;
