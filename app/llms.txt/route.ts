import { appUrl, isShowcase } from "../lib/siteMeta";

/* GET route handlers stopped being cached by default in recent Next.js;
   this document is build-time constant, so prerender it. */
export const dynamic = "force-static";

/**
 * Project index for LLM crawlers, per the llmstxt convention: a short list of
 * links, not the corpus itself — that lives at llms-full.txt. It describes
 * Linkfolio the project, so it only exists on the showcase deployment. A
 * personal deployment answers 404; whoever wants an llms.txt about themselves
 * can add their own.
 *
 * A route handler rather than a public/ file so the Documentation section can
 * name this deployment's real origin instead of a hardcoded one.
 */
const body = `# Linkfolio

> A self-hosted, open-source link-in-bio page built with Next.js and Tailwind CSS. One page linking everything you publish, on your own domain, with no account and no subscription.

## Documentation

- [Full documentation](${appUrl}/llms-full.txt): the comparison, FAQ and full corpus as one document
- [Deploy guide](${appUrl}/docs): deploy to Vercel or install the package
- [Live demo](${appUrl}/demo): the page with an example configuration
- [Source](https://github.com/heristop/linkfolio): MIT licensed
- [Package](https://www.npmjs.com/package/linkfolio): \`npm install linkfolio\`

## Optional

- [Example implementation](https://github.com/heristop/my-linkfolio): a real deployment
`;

export function GET(): Response {
  if (!isShowcase) {
    return new Response(null, { status: 404 });
  }

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
