import React, { useMemo } from "react";
import SocialNetwork from "./SocialNetwork";
import type { SocialLinksProps, SocialNetworkType } from "../types";
import { arrangeBento } from "../lib/bento";

/**
 * Classic wraps each group into its own centred row. Bento is one grid, so the
 * flex utilities are dropped entirely rather than overridden — a `display`
 * utility sits in Tailwind's utilities layer and would beat the stylesheet's
 * `display: grid` whatever its specificity.
 */
const GROUP_CLASS =
  "lf-group flex flex-wrap justify-center gap-[var(--lf-links-gap-y)_var(--lf-links-gap-x)] px-(--lf-links-padding-x)";
const BENTO_GROUP_CLASS = "lf-group lf-bento px-(--lf-links-padding-x)";

const SocialLinks: React.FC<SocialLinksProps> = ({
  userConfig,
  onLinkClick,
  headingLevel = "h1",
}) => {
  // One level below the profile name. Embedded in a host page that owns the
  // h1, the profile name drops to h2 — and card titles have to follow, or a
  // dozen of them become siblings of the host page's own sections.
  const titleLevel = headingLevel === "h2" ? "h3" : "h2";

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
      const group = map.get(g) ?? [];
      group.push(network);
      map.set(g, group);
    }
    return map;
  }, [filteredNetworks]);

  if (filteredNetworks.length === 0) {
    return null;
  }

  const bento = userConfig.layout === "bento";

  // Tile sizes only contrast when they share a grid, so bento collapses the
  // groups into a single section and mixes the sizes through it. Each card
  // carries its own resolved `data-span`, which is what the stylesheet reads.
  const sections: [string, SocialNetworkType[]][] = bento
    ? [["bento", arrangeBento(filteredNetworks)]]
    : [...groups.entries()];

  // A single counter running across every group, in render order, so
  // "priority" reflects the first 4 tiles on the page overall — not the
  // first 4 of each group.
  let runningIndex = 0;

  return (
    <nav
      aria-label="Social links"
      data-layout={bento ? "bento" : "classic"}
      className="lf-links flex flex-col gap-8 w-full max-w-(--breakpoint-xl) mx-auto"
    >
      {sections.map(([groupName, networks]) => (
        // No aria-label here on purpose: naming a <section> promotes it to a
        // region landmark, and the group key is a config slug, so screen
        // readers announced landmarks called "socialnetwork links". The groups
        // are a visual arrangement; the nav above already names the whole set.
        <section
          key={groupName}
          data-group={bento ? undefined : groupName}
          className={bento ? BENTO_GROUP_CLASS : GROUP_CLASS}
        >
          {networks.map((config, idx) => {
            const globalIndex = runningIndex++;

            return (
              <SocialNetwork
                key={config.url || idx}
                config={config}
                priority={globalIndex < 4}
                onLinkClick={onLinkClick}
                titleLevel={titleLevel}
              />
            );
          })}
        </section>
      ))}
    </nav>
  );
};

export default SocialLinks;
