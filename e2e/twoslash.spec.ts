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

// Screenshot tests for visual regression (desktop only)
test.describe("Twoslash visual snapshots", () => {
  for (const pagePath of twoslashPages) {
    test(`screenshot ${pagePath} twoslash area`, async ({ page }) => {
      test.skip(
        test.info().project.name === "mobile",
        "Screenshots only on desktop"
      );
      await page.goto(pagePath);
      await page.locator("pre.twoslash").first().waitFor({ state: "attached" });

      const visibleBlocks = page.locator("pre.twoslash:visible");
      const count = await visibleBlocks.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        await visibleBlocks.nth(i).screenshot({
          path: `e2e/screenshots/${pagePath.slice(1)}-block-${i}.png`,
        });
      }
      expect(count).toBeGreaterThanOrEqual(1);
    });
  }
});
