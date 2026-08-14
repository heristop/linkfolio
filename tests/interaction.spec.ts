import { expect, test } from "@playwright/test";

/**
 * The production CSS is minified, so a token authored as `140ms` is served as
 * `.14s` and `cubic-bezier(0.16, ...)` as `cubic-bezier(.16, ...)`. These
 * assertions compare values, not the source spelling.
 */
function toMs(value: string): number {
  const amount = Number.parseFloat(value);

  return value.trim().endsWith("ms") ? amount : amount * 1000;
}

function numbersIn(value: string): number[] {
  return (value.match(/-?\d*\.?\d+/g) ?? []).map(Number);
}

/**
 * The interaction suite exercises the LinkFolio component itself, which lives
 * on the demo route. `/` is the marketing landing page: it embeds a trimmed
 * card with a single group, so it cannot cover grouped elevation, the group
 * divider, or below-the-fold reveal.
 */
const DEMO = "/demo";

test.describe("motion tokens", () => {
  test("the motion scale is exposed as custom properties", async ({ page }) => {
    await page.goto(DEMO);

    const tokens = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      const read = (name: string) => s.getPropertyValue(name).trim();
      return {
        fast: read("--lf-motion-fast"),
        base: read("--lf-motion-base"),
        slow: read("--lf-motion-slow"),
        reveal: read("--lf-motion-reveal"),
        easeOut: read("--lf-ease-out"),
        spring: read("--lf-ease-spring"),
        press: read("--lf-press-scale"),
        pressSm: read("--lf-press-scale-sm"),
        lift: read("--lf-hover-lift"),
        hoverScale: read("--lf-hover-scale"),
      };
    });

    expect(toMs(tokens.fast)).toBe(140);
    expect(toMs(tokens.base)).toBe(220);
    expect(toMs(tokens.slow)).toBe(380);
    expect(toMs(tokens.reveal)).toBe(500);
    expect(numbersIn(tokens.easeOut)).toEqual([0.32, 0.72, 0, 1]);
    expect(tokens.spring).toContain("linear(");
    expect(Number(tokens.press)).toBe(0.972);
    expect(Number(tokens.pressSm)).toBe(0.94);
    expect(tokens.lift).toBe("-2px");
    expect(Number(tokens.hoverScale)).toBe(1.08);
  });

  test("the legacy easing alias is still published", async ({ page }) => {
    await page.goto(DEMO);
    const legacy = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--ease-out-expo")
        .trim(),
    );

    expect(legacy).toContain("cubic-bezier");
    expect(numbersIn(legacy)).toEqual([0.16, 1, 0.3, 1]);
  });
});

test.describe("content availability", () => {
  test("link cards render visibly without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(DEMO);

    const cards = page.locator(".network");
    expect(await cards.count()).toBeGreaterThan(0);

    const opacities = await cards.evaluateAll((els) =>
      els.map((el) => Number(getComputedStyle(el).opacity)),
    );
    for (const opacity of opacities) expect(opacity).toBe(1);

    await context.close();
  });

  test("every card on screen is opaque after load", async ({ page }) => {
    await page.goto(DEMO);
    // On a phone the links start entirely below the fold, so nothing is
    // revealed at load and the sample below would be empty — the test would
    // pass without having checked anything. Bring them into view first.
    await page.locator(".lf-links").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    // Assert on what the observer actually revealed rather than on a viewport
    // band: a phone-sized viewport can leave no card fully inside the band,
    // which silently empties the sample instead of testing anything.
    const revealed = await page
      .locator(".network.is-revealed")
      .evaluateAll((els) =>
        els.map((el) => Number(getComputedStyle(el).opacity)),
      );

    expect(revealed.length).toBeGreaterThan(0);
    for (const opacity of revealed) expect(opacity).toBe(1);
  });

  test("cards below the fold are revealed once scrolled to", async ({
    page,
  }) => {
    // The link page lives at /demo; / is the landing page, where the component
    // appears as a short preview with nothing below the fold.
    await page.goto("/demo");
    await page.waitForTimeout(600);

    const hiddenAtLoad = await page
      .locator(".network")
      .evaluateAll(
        (els) =>
          els.filter((el) => Number(getComputedStyle(el).opacity) === 0).length,
      );

    expect(hiddenAtLoad).toBeGreaterThan(0);

    await page.evaluate(() =>
      globalThis.scrollTo(0, document.body.scrollHeight),
    );
    await page.waitForTimeout(1200);

    const stillHidden = await page
      .locator(".network")
      .evaluateAll(
        (els) =>
          els.filter((el) => Number(getComputedStyle(el).opacity) < 1).length,
      );

    expect(stillHidden).toBe(0);
  });
});

test.describe("entrance stagger", () => {
  // The design spec recommends capping the stagger at 300ms, past which a
  // cascade stops reading as one gesture and starts reading as loading.
  // src/lib/revealObserver.ts instead staggers per arriving batch
  // (MAX_STAGGERED 10 x STAGGER_STEP_MS 45 = 450ms), which is a deliberate
  // trade: a visitor never waits on delay accumulated by cards they already
  // scrolled past. This asserts that batch ceiling, not the spec's 300ms.
  const STAGGER_CEILING_MS = 450;

  test("no card is delayed by more than the batch ceiling", async ({
    page,
  }) => {
    await page.goto(DEMO);

    const delays = await page
      .locator(".network")
      .evaluateAll((els) =>
        els.map((el) =>
          Number.parseFloat(
            getComputedStyle(el).getPropertyValue("--lf-stagger"),
          ),
        ),
      );

    expect(delays.length).toBeGreaterThan(0);
    for (const delay of delays) {
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThanOrEqual(STAGGER_CEILING_MS);
    }
  });

  test("each group restarts its own stagger", async ({ page }) => {
    await page.goto(DEMO);

    const firstPerGroup = await page.evaluate(() => {
      const seen = new Map<string, number>();
      for (const el of document.querySelectorAll<HTMLElement>(".network")) {
        const group = el.dataset.group ?? "socialnetwork";
        if (seen.has(group)) continue;
        seen.set(
          group,
          Number.parseFloat(
            getComputedStyle(el).getPropertyValue("--lf-stagger"),
          ),
        );
      }
      return [...seen.values()];
    });

    expect(firstPerGroup.length).toBeGreaterThan(0);
    for (const delay of firstPerGroup) expect(delay).toBe(0);
  });
});

const ACTION_BUTTONS = [
  /show qr code/i,
  /share this page/i,
  /switch to (light|dark) mode/i,
];

test.describe("touch targets", () => {
  test("action buttons meet 44x44 on coarse pointers", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "coarse-pointer requirement");
    await page.goto(DEMO);

    const boxes = await Promise.all(
      ACTION_BUTTONS.map((name) =>
        page.getByRole("button", { name }).boundingBox(),
      ),
    );

    for (const [i, box] of boxes.entries()) {
      if (!box) throw new Error(`${ACTION_BUTTONS[i]} has no box`);
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("adjacent action buttons keep 8px of separation", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "coarse-pointer requirement");
    await page.goto(DEMO);

    const rawBoxes = await Promise.all(
      ACTION_BUTTONS.map((name) =>
        page.getByRole("button", { name }).boundingBox(),
      ),
    );
    const boxes = rawBoxes.map((box, i) => {
      if (!box) throw new Error(`${ACTION_BUTTONS[i]} has no box`);
      return box;
    });
    boxes.sort((a, b) => a.x - b.x);

    for (let i = 1; i < boxes.length; i++) {
      const gap = boxes[i].x - (boxes[i - 1].x + boxes[i - 1].width);
      expect(gap).toBeGreaterThanOrEqual(8);
    }
  });

  test("all three buttons share one presentation class", async ({ page }) => {
    await page.goto(DEMO);

    // ThemeToggle renders a placeholder <div> until next-themes resolves the
    // active theme, so counting before it mounts races hydration.
    await expect(
      page.getByRole("button", { name: /switch to (light|dark) mode/i }),
    ).toBeVisible();

    await expect(page.locator("button.lf-icon-button")).toHaveCount(3);
  });
});

test.describe("pointer semantics", () => {
  test("no hover rule is reachable on a coarse pointer", async ({ page }) => {
    await page.goto(DEMO);

    const unguarded = await page.evaluate(() => {
      const bad: string[] = [];

      const walk = (rules: CSSRuleList, guarded: boolean) => {
        for (const rule of rules) {
          if (rule instanceof CSSMediaRule) {
            walk(
              rule.cssRules,
              guarded || rule.conditionText.includes("hover: hover"),
            );
          } else if (rule instanceof CSSGroupingRule) {
            walk(rule.cssRules, guarded);
          } else if (
            rule instanceof CSSStyleRule &&
            rule.selectorText.includes(":hover") &&
            !guarded
          ) {
            bad.push(rule.selectorText);
          }
        }
      };

      for (const sheet of document.styleSheets) {
        try {
          walk(sheet.cssRules, false);
        } catch {
          /* cross-origin sheet, not ours */
        }
      }
      return bad;
    });

    expect(unguarded).toEqual([]);
  });

  test("a card scales down while the pointer is held", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "needs a fine pointer");
    await page.goto(DEMO);

    const card = page.locator(".network").first();
    const box = await card.boundingBox();
    if (!box) throw new Error(".network has no box");

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(400);
    const pressed = await card.evaluate((el) => getComputedStyle(el).transform);

    // Drag away before releasing so the link never navigates.
    await page.mouse.move(1, 1);
    await page.mouse.up();

    // Read the x-scale out of the matrix rather than matching the literal
    // token: hover raises the card at the same time, so the two transforms
    // compose and the serialised string is engine-specific.
    const scale = Number.parseFloat(
      pressed.replace(/^matrix\(/, "").split(",")[0],
    );

    expect(pressed).not.toBe("none");
    expect(scale).toBeLessThan(1);
  });

  test("interactive surfaces suppress the native tap highlight", async ({
    page,
  }) => {
    await page.goto(DEMO);
    const highlight = await page
      .locator(".network")
      .first()
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("-webkit-tap-highlight-color"),
      );

    // Gecko does not implement the property, and reports "". There is no
    // native tap highlight to suppress there, so nothing to assert.
    test.skip(highlight === "", "-webkit-tap-highlight-color unsupported");
    expect(highlight).toBe("rgba(0, 0, 0, 0)");
  });
});

test.describe("viewport and scale", () => {
  test("the viewport is safe-area aware and still zoomable", async ({
    page,
  }) => {
    await page.goto(DEMO);
    const content = await page
      .locator('meta[name="viewport"]')
      .getAttribute("content");

    expect(content).toContain("viewport-fit=cover");
    expect(content).not.toContain("user-scalable=no");
    expect(content).not.toContain("maximum-scale");
  });

  test("card padding scales with viewport width", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "needs viewport resizing");
    await page.goto(DEMO);

    const padding = async () =>
      page
        .locator(".lf-card")
        .evaluate((el) => Number.parseFloat(getComputedStyle(el).paddingLeft));

    await page.setViewportSize({ width: 390, height: 844 });
    const small = await padding();

    await page.setViewportSize({ width: 1440, height: 900 });
    const large = await padding();

    expect(small).toBeLessThan(large);
    expect(small).toBeLessThanOrEqual(24);
    expect(large).toBe(40);
  });

  test("no label renders below 12px", async ({ page }) => {
    await page.goto(DEMO);
    const sizes = await page
      .locator(".lf-title, .lf-description, .lf-footer")
      .evaluateAll((els) =>
        els.map((el) => Number.parseFloat(getComputedStyle(el).fontSize)),
      );

    expect(sizes.length).toBeGreaterThan(0);
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(12);
  });
});

test.describe("profile", () => {
  test("the accent line grows from its centre", async ({ page }) => {
    await page.goto(DEMO);
    const line = page.locator(".lf-accent-line");

    const [origin, width] = await Promise.all([
      line.evaluate((el) =>
        Number.parseFloat(getComputedStyle(el).transformOrigin),
      ),
      // offsetWidth, not getBoundingClientRect(): the reveal animation scales
      // this element on the X axis, so its rendered box is 0-wide mid-flight
      // and the comparison would race the animation.
      line.evaluate((el) => (el as HTMLElement).offsetWidth),
    ]);

    expect(origin).toBeCloseTo(width / 2, 0);
  });

  test("the alias typewriter has exactly one implementation", async ({
    page,
  }) => {
    await page.goto(DEMO);

    const keyframes = await page.evaluate(() => {
      const names: string[] = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSKeyframesRule) names.push(rule.name);
          }
        } catch {
          /* cross-origin sheet, not ours */
        }
      }
      return names;
    });

    expect(keyframes).not.toContain("typing");
  });

  test("the caret retires once the alias is written", async ({ page }) => {
    await page.goto(DEMO);
    const caret = page.locator(".alias-typing");

    test.skip(
      (await caret.count()) === 0,
      "typing alias disabled in this config",
    );

    await expect(caret).toHaveClass(/alias-typed/, { timeout: 10_000 });
    const border = await caret.evaluate(
      (el) => getComputedStyle(el).borderRightColor,
    );
    expect(border).toBe("rgba(0, 0, 0, 0)");
  });
});

test.describe("paint discipline", () => {
  test("card elevation is never transitioned as box-shadow", async ({
    page,
  }) => {
    await page.goto(DEMO);

    // Scoped to the elements this design owns. A page-wide sweep also catches
    // Tailwind's blanket `transition` utility, whose default property list
    // includes box-shadow — unrelated to how card elevation is animated.
    const offenders = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          ".network, .network .lf-icon-container, .lf-avatar, .lf-icon-button",
        ),
      ]
        .filter((el) =>
          getComputedStyle(el).transitionProperty.includes("box-shadow"),
        )
        .map((el) => `${el.tagName}.${el.className.toString().slice(0, 60)}`),
    );

    expect(offenders).toEqual([]);
  });

  test("card elevation is carried by an opacity-faded overlay", async ({
    page,
  }) => {
    await page.goto("/demo");

    const overlay = await page
      .locator(
        "[data-group='project'] .lf-icon-container, [data-group='website'] .lf-icon-container",
      )
      .first()
      .evaluate((el) => {
        const after = getComputedStyle(el, "::after");
        return {
          opacity: Number(after.opacity),
          shadow: after.boxShadow,
          transitions: after.transitionProperty,
        };
      });

    expect(overlay.opacity).toBe(0);
    expect(overlay.shadow).not.toBe("none");
    expect(overlay.transitions).toContain("opacity");
  });

  test("keyboard focus rings the card, not the inner link", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "keyboard navigation");
    await page.goto(DEMO);

    let reached = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      reached = await page.evaluate(
        () => !!document.activeElement?.closest(".network"),
      );
      if (reached) break;
    }
    // Safari only tabs to links when "Press Tab to highlight each item" is on,
    // and it is off by default. Nothing to assert if focus never gets there.
    test.skip(!reached, "this engine does not tab to links by default");

    const outlines = await page.evaluate(() => {
      const link = document.activeElement as HTMLElement;
      const card = link.closest(".network");
      if (!card) throw new Error("focused link is not inside a card");
      return {
        cardWidth: Number.parseFloat(getComputedStyle(card).outlineWidth),
        cardStyle: getComputedStyle(card).outlineStyle,
        // outline-width keeps its specified value even when the style is
        // none, so the style is what says whether a ring is drawn.
        linkStyle: getComputedStyle(link).outlineStyle,
      };
    });

    expect(outlines.cardStyle).toBe("solid");
    expect(outlines.cardWidth).toBeGreaterThan(0);
    expect(outlines.linkStyle).toBe("none");
  });

  test("the group divider fades out at both ends", async ({ page }) => {
    await page.goto(DEMO);

    const divider = await page.evaluate(() => {
      const groups = document.querySelectorAll(".lf-group");
      if (groups.length < 2) return null;
      const s = getComputedStyle(groups[1], "::before");
      return { image: s.backgroundImage, height: s.height };
    });

    test.skip(divider === null, "config has only one group");
    if (!divider) return;

    expect(divider.image).toContain("gradient");
    // Computed styles serialise `transparent` as a zero-alpha colour.
    expect(divider.image).toMatch(/rgba?\([^)]*,\s*0\)|transparent/);
  });
});

test.describe("qr dialog", () => {
  test("the panel is anchored toward its trigger", async ({ page }) => {
    await page.goto(DEMO);
    await page.getByRole("button", { name: /show qr code/i }).click();

    const panel = page.locator(".qr-panel");
    await expect(panel).toBeVisible();

    const { origin, box } = await panel.evaluate((el) => ({
      origin: getComputedStyle(el).transformOrigin,
      box: { w: el.clientWidth, h: el.clientHeight },
    }));

    const [ox, oy] = origin.split(" ").map(Number.parseFloat);
    // Anchored up and to the right, toward the card's action row.
    expect(ox).toBeGreaterThan(box.w / 2);
    expect(oy).toBeLessThan(box.h / 2);

    await page.keyboard.press("Escape");
  });

  test("the dialog exits faster than it enters", async ({ page }) => {
    await page.goto(DEMO);
    await page.getByRole("button", { name: /show qr code/i }).click();

    const panel = page.locator(".qr-panel");
    await expect(panel).toBeVisible();

    const enter = await panel.evaluate((el) =>
      Number.parseFloat(getComputedStyle(el).transitionDuration),
    );
    const exit = await page
      .locator(".qr-dialog")
      .evaluate((el) =>
        Number.parseFloat(getComputedStyle(el).transitionDuration),
      );

    expect(enter).toBeGreaterThan(0);
    expect(exit).toBeGreaterThan(0);
    expect(exit).toBeLessThan(enter);

    await page.keyboard.press("Escape");
  });
});

test.describe("reduced motion", () => {
  test("fades survive but movement is dropped", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(DEMO);

    const footer = await page
      .locator(".lf-footer")
      .evaluate((el) => getComputedStyle(el).transitionDuration);

    // Feedback is retained, just brief — removing it entirely would cost
    // these visitors the ability to tell whether a tap registered.
    expect(Number.parseFloat(footer)).toBeGreaterThan(0.05);
    expect(Number.parseFloat(footer)).toBeLessThanOrEqual(0.2);

    const transforms = await page
      .locator(".network")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
    for (const t of transforms) expect(t).toBe("none");
  });

  test("cards on screen are fully opaque when motion is reduced", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(DEMO);
    await page.waitForTimeout(600);

    // Scroll-gated reveal still applies under reduced motion — opacity is not
    // movement, and the gate lives behind `scripting: enabled` rather than a
    // motion query. What must hold is that a revealed card is fully opaque
    // and got there without any transform.
    const revealed = await page
      .locator(".network.is-revealed")
      .evaluateAll((els) =>
        els.map((el) => Number(getComputedStyle(el).opacity)),
      );

    expect(revealed.length).toBeGreaterThan(0);
    for (const o of revealed) expect(o).toBe(1);
  });
});
