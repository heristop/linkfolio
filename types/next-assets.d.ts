/**
 * Static image imports (`.webp`, `.svg`) are typed by Next, but the reference
 * that pulls those declarations in normally lives in `next-env.d.ts` — a
 * generated file that is gitignored and only written by `next dev`/`next
 * build`. CI typechecks before anything builds, so the declarations were
 * missing there and every asset import in `src/assets/index.ts` failed to
 * resolve.
 *
 * Committing `next-env.d.ts` would not fix it: that file also imports
 * `./.next/types/*`, which exists only after a build. This carries just the
 * part that has no build dependency.
 */

/// <reference types="next/image-types/global" />
