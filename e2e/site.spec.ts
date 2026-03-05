import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders with article list", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toContainText("hasparus");
    // Check that article links are present
    const articles = page.locator("ul li a");
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });
});

test.describe("Dark/light mode toggle", () => {
  test("select switches color scheme", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const select = page.getByLabel("Change color scheme");

    await select.selectOption("dark");
    await expect(html).toHaveClass(/dark/);

    await select.selectOption("light");
    await expect(html).not.toHaveClass(/dark/);

    // Reset to system default
    await select.selectOption("");
  });
});

test.describe("Mobile responsive layout", () => {
  test("homepage is readable on mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Mobile-specific test");
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    const articles = page.locator("ul li a");
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(10);
    // Content should not overflow
    const body = page.locator("body");
    const box = await body.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(375);
  });
});
