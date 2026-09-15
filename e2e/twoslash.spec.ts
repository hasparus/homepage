import { test, expect } from "@playwright/test";

// Pages known to use twoslash code blocks
const twoslashPages = [
  "/refinement-types",
  "/frivolous-concatenation",
  "/node-crypto-is-underused",
];

for (const pagePath of twoslashPages) {
  test.describe(`Twoslash on ${pagePath}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(pagePath);
    });

    test("twoslash code blocks render", async ({ page }) => {
      const codeBlocks = page.locator("pre.twoslash");
      await expect(codeBlocks.first()).toBeAttached();
      const count = await codeBlocks.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test("type hover info is present in DOM", async ({ page }) => {
      const hoverElements = page.locator(".twoslash-hover");
      const count = await hoverElements.count();
      expect(count).toBeGreaterThanOrEqual(1);

      // Verify popup containers exist
      const popups = page.locator(".twoslash-popup-container");
      const popupCount = await popups.count();
      expect(popupCount).toBeGreaterThanOrEqual(1);
    });
  });
}

// refinement-types has @errors annotations
test.describe("Twoslash error annotations on /refinement-types", () => {
  test("error annotations render", async ({ page }) => {
    await page.goto("/refinement-types");
    const errors = page.locator(".twoslash-error");
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Twoslash dark mode", () => {
  test("code block colors switch in dark mode", async ({ page }) => {
    await page.goto("/refinement-types");

    const html = page.locator("html");
    const block = page.locator("pre.twoslash.astro-code-themes").first();
    await expect(block).toBeVisible();

    const getStyles = async () =>
      block.evaluate((el) => {
        const preStyle = getComputedStyle(el);
        const firstToken = el.querySelector("span");
        return {
          preColor: preStyle.color,
          preBackgroundColor: preStyle.backgroundColor,
          firstTokenColor: firstToken ? getComputedStyle(firstToken).color : "",
          shikiDark: preStyle.getPropertyValue("--shiki-dark").trim(),
          shikiDarkBg: preStyle.getPropertyValue("--shiki-dark-bg").trim(),
        };
      });

    const light = await getStyles();
    expect(light.shikiDark.length).toBeGreaterThan(0);
    expect(light.shikiDarkBg.length).toBeGreaterThan(0);

    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("color-scheme", "dark");
    });
    await expect(html).toHaveClass(/dark/);

    const dark = await getStyles();
    expect(dark.preColor).not.toBe(light.preColor);
    // preBackgroundColor is transparent in both modes (intentional)
    expect(dark.firstTokenColor).not.toBe(light.firstTokenColor);
  });
});

test.describe("Twoslash popup sizing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.HISTORY_DEMO_URL || "/y-travelling");
  });

  test("opens above the token near the bottom of the viewport", async ({
    page,
  }) => {
    const token = page
      .locator(".twoslash-hover")
      .filter({
        has: page
          .locator(".twoslash-popup-code")
          .filter({ hasText: /^function applyUpdate\(/ }),
      })
      .last();
    await token.scrollIntoViewIfNeeded();
    await token.evaluate((element) =>
      window.scrollBy({
        top: element.getBoundingClientRect().bottom - (window.innerHeight - 8),
        behavior: "instant",
      }),
    );
    await token.hover();
    const popup = token.locator(".twoslash-popup-container");
    await expect(popup).toBeVisible();
    await expect
      .poll(() =>
        token.evaluate((element) => {
          const box = element
            .querySelector(".twoslash-popup-container")!
            .getBoundingClientRect();
          return (
            box.bottom <= element.getBoundingClientRect().top + 1 &&
            box.top >= 0
          );
        }),
      )
      .toBe(true);
  });

  for (const { name, signature, singleLine } of [
    { name: "short signature", signature: /^count: number$/, singleLine: true },
    {
      name: "long signature",
      signature: /^function applyUpdate\(/,
      singleLine: false,
    },
    {
      name: "documented signature",
      signature: /^var Number: NumberConstructor/,
      singleLine: false,
    },
  ]) {
    test(`${name} uses available width without leaving its code block`, async ({
      page,
    }) => {
      const token = page
        .locator(".twoslash-hover")
        .filter({
          has: page
            .locator(".twoslash-popup-code")
            .filter({ hasText: signature }),
        })
        .first();
      await token.hover();
      const popup = token.locator(".twoslash-popup-container");
      await expect(popup).toBeVisible();
      const dimensions = await popup.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const block = element.closest("pre")!.getBoundingClientRect();
        const code = element.querySelector(".twoslash-popup-code")!;
        const style = getComputedStyle(code);
        return {
          left: box.left,
          right: box.right,
          width: box.width,
          blockLeft: block.left,
          blockRight: block.right,
          blockWidth: block.width,
          contentHeight:
            code.getBoundingClientRect().height -
            parseFloat(style.paddingTop) -
            parseFloat(style.paddingBottom),
          lineHeight: parseFloat(style.lineHeight),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          viewportWidth: window.innerWidth,
        };
      });
      expect(dimensions.left).toBeGreaterThanOrEqual(
        Math.max(0, dimensions.blockLeft) - 1,
      );
      expect(dimensions.right).toBeLessThanOrEqual(
        Math.min(dimensions.viewportWidth, dimensions.blockRight) + 1,
      );
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth + 1,
      );
      if (singleLine) {
        expect(dimensions.contentHeight).toBeLessThanOrEqual(
          dimensions.lineHeight + 1,
        );
      } else {
        expect(dimensions.width).toBeGreaterThan(dimensions.blockWidth * 0.95);
      }
    });
  }
});

// Visual regression for twoslash blocks (desktop only)
test.describe("Twoslash visual snapshots", () => {
  for (const pagePath of twoslashPages) {
    test(`screenshot ${pagePath} first twoslash block`, async ({ page }) => {
      test.skip(
        test.info().project.name === "mobile",
        "Screenshots only on desktop",
      );
      await page.goto(pagePath);
      const firstBlock = page.locator("pre.twoslash").first();
      await expect(firstBlock).toBeVisible();
      await expect(firstBlock).toHaveScreenshot(
        `${pagePath.slice(1)}-twoslash.png`,
        { maxDiffPixelRatio: 0.05 },
      );
    });
  }
});
