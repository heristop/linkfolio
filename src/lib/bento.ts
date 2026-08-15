import type { BentoDirection, BentoSpan, SocialNetworkType } from "../types";

/**
 * Tile size for a link that does not declare one. The groups already express
 * a hierarchy — a project is a bigger thing than a profile link — so an
 * existing config becomes a mosaic without annotating anything.
 */
const GROUP_SPAN: Record<string, BentoSpan> = {
  project: "2x2",
  website: "2x1",
};

const SPAN_AREA: Record<BentoSpan, number> = {
  "1x1": 1,
  "2x1": 2,
  "1x2": 2,
  "2x2": 4,
  "2x3": 6,
};

export function resolveSpan(config: SocialNetworkType): BentoSpan {
  return config.span ?? GROUP_SPAN[config.group ?? ""] ?? "1x1";
}

/**
 * A wide, one-row tile has no vertical room for an image above two lines of
 * text, so side-by-side is its natural reading order. Everything else stacks.
 */
export function resolveDirection(config: SocialNetworkType): BentoDirection {
  return (
    config.direction ??
    (resolveSpan(config) === "2x1" ? "horizontal" : "vertical")
  );
}

/** Splits the links by the area their resolved span covers. */
function bucketByArea(networks: SocialNetworkType[]) {
  const big: SocialNetworkType[] = [];
  const medium: SocialNetworkType[] = [];
  const small: SocialNetworkType[] = [];

  for (const network of networks) {
    const area = SPAN_AREA[resolveSpan(network)];

    if (area >= 4) big.push(network);
    else if (area > 1) medium.push(network);
    else small.push(network);
  }

  return { big, medium, small };
}

/** Alternates two lists so two of a kind rarely land side by side. */
function alternate(
  first: SocialNetworkType[],
  second: SocialNetworkType[],
): SocialNetworkType[] {
  const out: SocialNetworkType[] = [];

  for (let i = 0; i < Math.max(first.length, second.length); i++) {
    if (i < first.length) out.push(first[i]);
    if (i < second.length) out.push(second[i]);
  }

  return out;
}

export function arrangeBento(
  networks: SocialNetworkType[],
): SocialNetworkType[] {
  const { big, medium, small } = bucketByArea(networks);
  const anchors = alternate(big, medium);

  if (anchors.length === 0 || small.length === 0) {
    return [...anchors, ...small];
  }

  const run = Math.ceil(small.length / anchors.length);
  const out: SocialNetworkType[] = [];
  let cursor = 0;

  for (const anchor of anchors) {
    out.push(anchor);
    out.push(...small.slice(cursor, cursor + run));
    cursor += run;
  }

  return [...out, ...small.slice(cursor)];
}
