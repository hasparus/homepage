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

// Visual regression for twoslash blocks (desktop only)
test.describe("Twoslash visual snapshots", () => {
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
