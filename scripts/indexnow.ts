/**
 * Submits the showcase site's URLs to IndexNow (Bing, Yandex, Seznam).
 *
 * Chosen because it is the only submission channel that needs no account and
 * no dashboard verification — ownership is proved by serving the key file.
 * The site is currently absent from Bing's index rather than ranking poorly
 * in it, so this is the difference between being crawled and not.
 *
 * Never fails a deploy: a submission endpoint being down is not a reason to
 * mark a release broken.
 *
 * This script has no repository guard of its own — the one that keeps it
 * from submitting the maintainer's URLs from a fork's own CI run lives in
 * .github/workflows/indexnow.yml (`if: github.repository == ...`), not here.
 * Running `pnpm indexnow` from any clone, including a fork, POSTs the
 * maintainer's host and key as written above.
 *
 * The key file this reads from public/ ships in every fork's deploy, since
 * public/ is served verbatim — so a fork ends up serving the maintainer's
 * IndexNow key at its own origin. That is a known, accepted trade-off of
 * keeping the key as a static public/ file rather than a surprise: the key
 * only proves the fork controls whatever host it's served from, and the
 * workflow guard above is what actually keeps a fork from submitting on the
 * maintainer's behalf.
 *
 * Run: pnpm indexnow
 */
import { readdirSync } from "node:fs";

const HOST = "linkfolio-demo.vercel.app";
const ORIGIN = `https://${HOST}`;

const URLS = [
  ORIGIN,
  `${ORIGIN}/demo`,
  `${ORIGIN}/docs`,
  `${ORIGIN}/llms.txt`,
  `${ORIGIN}/llms-full.txt`,
];

function readKey(): string {
  const files = readdirSync(new URL("../public", import.meta.url));
  const keyFile = files.find((f) => /^[0-9a-f]{32}\.txt$/.test(f));

  if (!keyFile) throw new Error("no IndexNow key file found in public/");

  return keyFile.replace(/\.txt$/, "");
}

async function main() {
  const key = readKey();

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key,
      keyLocation: `${ORIGIN}/${key}.txt`,
      urlList: URLS,
    }),
  });

  console.log(`IndexNow responded ${response.status} for ${URLS.length} URLs`);

  if (response.status >= 400) {
    console.log(await response.text());
  }
}

main().catch((error) => {
  console.log(`IndexNow submission skipped: ${error.message}`);
});
