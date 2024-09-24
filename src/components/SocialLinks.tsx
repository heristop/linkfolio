import React from "react";
import SocialNetwork from "./SocialNetwork";
import { SocialLinksProps, SocialNetworkType } from "../types";

const SocialLinks = ({ userConfig }: SocialLinksProps) => {
  if (!userConfig.socialNetworks) {
    return null;
  }

  const filteredNetworks = userConfig.socialNetworks.filter(
    (config: SocialNetworkType) => !config.hidden,
  );

  return (
    <main className="flex flex-wrap gap-y-4 gap-x-20 justify-center">
      {filteredNetworks.map((config: SocialNetworkType, index: number) => (
        <SocialNetwork key={index} config={config} delay={index * 100} />
      ))}
    </main>
  );
};

export default SocialLinks;
