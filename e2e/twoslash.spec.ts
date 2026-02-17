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
      const codeBlocks = page.locator("pre.shiki.twoslash");
      await expect(codeBlocks.first()).toBeAttached();
      const count = await codeBlocks.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test("type hover info (data-lsp) is present in DOM", async ({ page }) => {
      // data-lsp elements may be inside hidden theme variants,
      // so we check attachment rather than visibility
      const lspElements = page.locator("data-lsp");
      const count = await lspElements.count();
      expect(count).toBeGreaterThanOrEqual(1);

      // Verify the first data-lsp element has a non-empty lsp attribute
      const firstLsp = lspElements.first();
      const lspValue = await firstLsp.getAttribute("lsp");
      expect(lspValue).toBeTruthy();
    });
  });
}

// refinement-types has @errors annotations
test.describe("Twoslash error annotations on /refinement-types", () => {
  test("error annotations render", async ({ page }) => {
    await page.goto("/refinement-types");
    const errors = page.locator(".error, .error-behind");
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
      // Wait for code blocks to render
      await page.locator("pre.shiki.twoslash").first().waitFor({ state: "attached" });

      // Screenshot visible twoslash blocks
      const visibleBlocks = page.locator("pre.shiki.twoslash:visible");
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
