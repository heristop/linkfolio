import type { SocialNetworkType } from "../types";
import { resolveSpan } from "./bento";

/** The first tiles on the page, whatever their size. */
const LEADING_TILES = 4;
/** Large tiles above the fold, one of which is usually the page's LCP. */
const LEADING_LARGE_TILES = 2;

/**
 * Which tiles load eagerly, by render index.
 *
 * Counting only the first few tiles missed the Largest Contentful Paint on
 * most real configs: social icons come first and fill those slots, while the
 * big project or website banner further down is what the browser measures. So
 * the first large tiles (any span other than `1x1`) are eager too.
 */
export function eagerTileIndexes(
  networks: readonly SocialNetworkType[],
): Set<number> {
  const eager = new Set<number>();
  let large = 0;

  networks.forEach((network, index) => {
    if (index < LEADING_TILES) {
      eager.add(index);
    }

    if (large >= LEADING_LARGE_TILES || resolveSpan(network) === "1x1") {
      return;
    }

    large += 1;
    eager.add(index);
  });

  return eager;
}
