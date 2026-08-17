# Contributing to Linkfolio

Thanks for considering it. Bug reports, layout fixes, new theme presets and
documentation corrections are all welcome.

## Getting set up

Linkfolio is one repository serving two things: the `linkfolio` npm package
(`src/`) and the project's own showcase site (`app/`). Both build from the same
source.

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Installing and consuming the published `linkfolio` package needs Node 20.9+
(the floor in `engines.node`). Working in this repo needs a newer Node:
`pnpm gen:readme` and `pnpm indexnow` run under plain `node` and rely on
native TypeScript type-stripping, which needs Node 22.18+ or 23.6+ — an
older Node fails them with `ERR_UNKNOWN_FILE_EXTENSION`. `engines.node`
isn't raised to match, because it would lock out package consumers to solve
a contributor-only problem; `scripts/` never ships to them (see `files` in
`package.json`). Use pnpm — the version is pinned in `packageManager`, so
`corepack` will fetch it for you.

By default `pnpm dev` serves the personal profile page, which is what a fork
deploys. To work on the landing page, `/docs` or `/demo`, set
`LINKFOLIO_SHOWCASE=1` (an untracked `.env` is the easiest place). The flag is
read at build time, so restart the dev server after changing it.

## Before you open a pull request

Run the same checks CI runs:

```bash
pnpm run lint         # oxlint
pnpm run fmt:check    # oxfmt
pnpm run typecheck    # tsc, strict
pnpm run test:unit    # vitest, no browser or server needed
pnpm test             # playwright, the showcase suites
```

`pnpm run test:unit` is the fastest signal — it exercises the pure logic
(layout arrangement, sanitising, SEO builders, theme resolution) in a couple of
seconds without starting anything.

## A note on visual tests

Screenshot baselines are per-platform: Playwright suffixes them with the OS
that captured them, because text rasterises differently on macOS and Linux. CI
runs on Linux, so a baseline recorded on your machine will not satisfy it.

If your change is _meant_ to alter the rendering, don't commit locally
regenerated PNGs. Say so in the pull request and a maintainer will run the
**Update Visual Baselines** workflow, which captures them on Linux and commits
them.

## Conventions

- Commits follow [Conventional Commits](https://www.conventionalcommits.org)
  (`feat:`, `fix:`, `docs:`, `test:`, `chore:` …).
- Formatting and linting are enforced; `pnpm fmt` fixes most of it.
- Public API changes belong in `CHANGELOG.md` under _Unreleased_.

## Reporting a bug

Include the Linkfolio version, whether you are using the template or the npm
package, and the browser. A link to a reproduction — a fork, a CodeSandbox, or
just your `user.config.ts` — turns a bug report into a fix much faster.
