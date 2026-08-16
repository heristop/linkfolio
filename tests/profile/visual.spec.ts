import { test, expect } from "@playwright/test";

/**
 * Visual regression for the card itself, run against the default build — the
 * one a fork deploys. The showcase site's /demo renders the same component
 * behind a flag only this project's own deployment sets, so a baseline taken
 * there guards the marketing route rather than the product.
 */
test("the profile card renders as expected", async ({ page }) => {
  await page.goto("/");

  // Cards are revealed by an IntersectionObserver, which Playwright's
  // animation-disabling does not stop: it changes classes from JS, so the
  // capture can land mid-reveal and the baseline never settles.
  //
  // Waiting only for cards 10% inside the viewport — the observer's own
  // trigger — leaves the band between there and the bottom edge undecided:
  // those cards are painted in the screenshot but nothing waits for them, so
  // the two tiles on the fold flipped between blank and painted from run to
  // run, on both platforms. Scrolling to the end and back settles every card
  // instead. The observer unobserves each one as it reveals, so the state
  // sticks, and the page ends at the scroll position it is captured at.
  await page.evaluate(async () => {
    globalThis.scrollTo({
      top: document.body.scrollHeight,
      behavior: "instant",
    });
    await new Promise((resolve) => setTimeout(resolve, 300));
    globalThis.scrollTo({ top: 0, behavior: "instant" });
  });

  await expect
    .poll(
      () =>
        page.evaluate(
          () => document.querySelectorAll(".network:not(.is-revealed)").length,
        ),
      { timeout: 10_000 },
    )
    .toBe(0);

  // A revealed card is not a painted one: only the first four pictures are
  // fetched eagerly, and the rest were pulled in by the scroll above. Both a
  // blank and a painted frame hold still long enough to look settled, so
  // `toHaveScreenshot` would otherwise record whichever it found.
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll("img")].filter(
              // `complete` alone is also true for an image that failed, which
              // would wait out the timeout and then compare against a broken
              // frame instead of failing on the cause.
              (image) => !(image.complete && image.naturalWidth > 0),
            ).length,
        ),
      { timeout: 10_000 },
    )
    .toBe(0);

  // Both schemes from one page: the palette is CSS-variable driven, so
  // emulating the media query re-themes without a reload, and the reveal
  // state settled above is reused rather than waited for twice.
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await expect(page).toHaveScreenshot(`${colorScheme}.png`);
  }
});
