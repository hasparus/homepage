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
    expect(dark.preBackgroundColor).not.toBe(light.preBackgroundColor);
    expect(dark.firstTokenColor).not.toBe(light.firstTokenColor);
  });
});

// Visual regression for twoslash blocks (desktop only)
// Skipped until baseline screenshots are generated with: npx playwright test --update-snapshots
test.describe.skip("Twoslash visual snapshots", () => {
  for (const pagePath of twoslashPages) {
    test(`screenshot ${pagePath} first twoslash block`, async ({ page }) => {
      test.skip(
        test.info().project.name === "mobile",
        "Screenshots only on desktop"
      );
      await page.goto(pagePath);
      const firstBlock = page.locator("pre.twoslash").first();
      await expect(firstBlock).toBeVisible();
      await expect(firstBlock).toHaveScreenshot(
        `${pagePath.slice(1)}-twoslash.png`
      );
    });
  }
});
