import { test, expect } from "@playwright/test";

const DEMO = "/demo";

test("no analytics config means no third-party script and no tracker global", async ({
  page,
}) => {
  const thirdPartyRequests: string[] = [];
  page.on("request", (request) => {
    const url = request.url();
    if (!url.startsWith("http://127.0.0.1:3000") && !url.startsWith("data:")) {
      thirdPartyRequests.push(url);
    }
  });

  await page.goto(DEMO);
  // `afterInteractive` scripts are injected from a `useEffect` that only
  // runs after hydration, which routinely lands after the "load" event
  // `page.goto` waits for by default. Without this, a regression that
  // unconditionally rendered a tracker script could inject it after both
  // assertions below have already run, leaving this test green.
  await page.waitForLoadState("networkidle");

  // The landing page promises "No third-party analytics unless you add them".
  // Any tracker script here would make that copy false.
  expect(
    thirdPartyRequests.filter((url) =>
      /googletagmanager|plausible|umami/.test(url),
    ),
  ).toEqual([]);

  const globalsPresent = await page.evaluate(() => ({
    gtag: typeof (globalThis as { gtag?: unknown }).gtag,
    plausible: typeof (globalThis as { plausible?: unknown }).plausible,
    umami: typeof (globalThis as { umami?: unknown }).umami,
  }));

  expect(globalsPresent).toEqual({
    gtag: "undefined",
    plausible: "undefined",
    umami: "undefined",
  });
});

test("every card anchor carries its own attribution attributes", async ({
  page,
}) => {
  await page.goto(DEMO);
  await page.waitForLoadState("networkidle");

  const anchor = page.locator(".network a[data-lf-link]").first();
  await expect(anchor).toHaveAttribute("data-lf-url", /.+/);
  await expect(anchor).toHaveAttribute("data-lf-group", /.+/);

  // One anchor per card: a card that lost its attributes would still render,
  // so counting is what catches a partial regression.
  const anchors = await page.locator(".network a[data-lf-link]").count();
  const cards = await page.locator(".network").count();
  expect(cards).toBeGreaterThan(0);
  expect(anchors).toBe(cards);
});

test("clicking a card emits linkfolio:analytics with the link's identity", async ({
  page,
}) => {
  await page.goto(DEMO);
  // Handlers are React synthetic events attached at hydration; clicking
  // before that lands would miss them and make this flaky rather than wrong.
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => {
    (globalThis as { lfCapturedEvents?: unknown[] }).lfCapturedEvents = [];
    document.addEventListener("linkfolio:analytics", (event) => {
      (globalThis as { lfCapturedEvents?: unknown[] }).lfCapturedEvents?.push(
        (event as CustomEvent).detail,
      );
    });
    // The cards are target="_blank"; without this the click opens a tab and
    // the assertions race a navigation. Capture phase does not stop
    // propagation, so React still receives the event.
    document.addEventListener("click", (event) => event.preventDefault(), true);
  });

  const anchor = page.locator(".network a[data-lf-link]").first();
  const title = await anchor.getAttribute("data-lf-link");
  const url = await anchor.getAttribute("data-lf-url");
  const group = await anchor.getAttribute("data-lf-group");

  await anchor.click();

  const events = await page.evaluate(
    () =>
      (globalThis as { lfCapturedEvents?: unknown[] }).lfCapturedEvents ?? [],
  );

  expect(events).toHaveLength(1);
  expect(events[0]).toEqual({
    name: "link_click",
    params: { link_title: title, link_url: url, link_group: group },
  });
});

test("a middle-click emits too, because it is still a navigation", async ({
  page,
}) => {
  await page.goto(DEMO);
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => {
    (globalThis as { lfCapturedEvents?: unknown[] }).lfCapturedEvents = [];
    document.addEventListener("linkfolio:analytics", (event) => {
      (globalThis as { lfCapturedEvents?: unknown[] }).lfCapturedEvents?.push(
        (event as CustomEvent).detail,
      );
    });
    document.addEventListener(
      "auxclick",
      (event) => event.preventDefault(),
      true,
    );
  });

  await page
    .locator(".network a[data-lf-link]")
    .first()
    .click({ button: "middle" });

  const events = await page.evaluate(
    () =>
      (globalThis as { lfCapturedEvents?: unknown[] }).lfCapturedEvents ?? [],
  );

  // Exactly one: `click` does not fire for the middle button, so the two
  // handlers must not double-count.
  expect(events).toHaveLength(1);
});
