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
  // capture can land mid-reveal and the baseline never settles. Wait until
  // every card in view has been revealed before comparing.
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll(".network")].filter((el) => {
              const box = el.getBoundingClientRect();
              // Matches the observer's own trigger: a card is only revealed
              // once it is 10% inside the viewport, so counting anything that
              // merely grazes the bottom edge waits for a reveal that is not
              // coming.
              const onScreen =
                box.top < globalThis.innerHeight * 0.9 && box.bottom > 0;
              return onScreen && !el.classList.contains("is-revealed");
            }).length,
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
