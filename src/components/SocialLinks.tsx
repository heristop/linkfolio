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

  const groups = useMemo(() => {
    const map = new Map<string, SocialNetworkType[]>();
    for (const network of filteredNetworks) {
      const g = network.group || "socialnetwork";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(network);
    }
    return map;
  }, [filteredNetworks]);

  if (filteredNetworks.length === 0) {
    return null;
  }

  let globalIndex = 0;

  return (
    <main
      aria-label="Social links"
      className="lf-links flex flex-col gap-8 w-full max-w-(--breakpoint-xl) mx-auto"
    >
      {Array.from(groups.entries()).map(([groupName, networks]) => (
        <section
          key={groupName}
          data-group={groupName}
          className="lf-group flex flex-wrap justify-center"
          style={{
            gap: "var(--lf-links-gap-y) var(--lf-links-gap-x)",
            paddingInline: "var(--lf-links-padding-x)",
          }}
          aria-label={`${groupName} links`}
        >
          {networks.map((config) => {
            const idx = globalIndex++;
            return (
              <SocialNetwork
                key={config.url || idx}
                config={config}
                delay={idx * 60}
              />
            );
          })}
        </section>
      ))}
    </main>
  );
};

export default SocialLinks;
