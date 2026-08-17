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
