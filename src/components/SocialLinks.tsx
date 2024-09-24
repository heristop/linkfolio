import React, { useMemo } from "react";
import SocialNetwork from "./SocialNetwork";
import { SocialLinksProps, SocialNetworkType } from "../types";

const SocialLinks: React.FC<SocialLinksProps> = ({ userConfig }) => {
  const filteredNetworks = useMemo(
    () =>
      userConfig.socialNetworks?.filter(
        (config: SocialNetworkType) => !config.hidden,
      ) ?? [],
    [userConfig.socialNetworks],
  );

  if (filteredNetworks.length === 0) {
    return null;
  }

  return (
    <main className="flex flex-wrap gap-y-4 gap-x-20 justify-center px-4 max-w-screen-xl mx-auto">
      {filteredNetworks.map((config: SocialNetworkType, index: number) => (
        <SocialNetwork
          key={config.url || index}
          config={config}
          delay={index * 100}
        />
      ))}
    </main>
  );
};

export default SocialLinks;
