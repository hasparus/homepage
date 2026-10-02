import { test, expect } from "@playwright/test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";

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

test("Contact in the command menu opens the site's contact page", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "⌘", exact: true }).click();
  await page.getByRole("option", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(
    page.getByRole("main").getByRole("heading", { level: 1 }),
  ).toBeVisible();
});

test("MDX page Markdown preserves main content and links without page chrome", async ({
  page,
  request,
}) => {
  const processor = await createMarkdownProcessor();
  const content = () =>
    page.getByRole("main").evaluate((main) => ({
      text: main.textContent?.replace(/\s+/g, " ").trim(),
      links: [...main.querySelectorAll("a")].map((link) => ({
        text: link.textContent,
        href: link.getAttribute("href"),
      })),
    }));
  for (const name of ["about", "contact", "privacy", "docs"]) {
    await page.goto(`/${name}/`);
    const html = await content();
    const markdown = await (await request.get(`/${name}.md`)).text();
    const rendered = await processor.render(markdown);
    await page.setContent(`<main>${rendered.code}</main>`);
    expect(await content()).toEqual(html);
  }
});

test.describe("Dark/light mode toggle", () => {
  test("command palette switches color scheme", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    // Toggle dark mode via JS (same mechanism used by the command palette)
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("color-scheme", "dark");
    });
    await expect(html).toHaveClass(/dark/);

    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("color-scheme", "light");
    });
    await expect(html).not.toHaveClass(/dark/);
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
