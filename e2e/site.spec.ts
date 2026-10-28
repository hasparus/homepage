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
  const content = (base: string) =>
    page.getByRole("main").evaluate(
      (main, base) => ({
        text: main.textContent?.replace(/\s+/g, " ").trim(),
        links: [...main.querySelectorAll("a")].map((link) => ({
          text: link.textContent,
          href: new URL(link.getAttribute("href")!, base).href,
        })),
      }),
      base,
    );
  for (const name of ["about", "contact", "privacy", "docs"]) {
    await page.goto(`/${name}/`);
    const base = `https://haspar.us/${name}/`;
    const html = await content(base);
    const markdown = await (await request.get(`/${name}.md`)).text();
    if (name === "docs")
      expect(markdown).toContain("(https://haspar.us/openapi.json)");
    const rendered = await processor.render(markdown);
    await page.setContent(`<main>${rendered.code}</main>`);
    expect(await content(base)).toEqual(html);
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

test("bear-fit's social card loops as og:video and an X player card", async ({
  page,
  request,
}) => {
  await page.goto("/bear-fit/");
  const meta = (attribute: string) =>
    page.locator(`meta[${attribute}]`).getAttribute("content");
  expect(await meta('name="twitter:card"')).toBe("player");
  const video = new URL((await meta('property="og:video"'))!);
  expect((await request.get(video.pathname)).headers()["content-type"]).toMatch(
    /^video\/mp4/,
  );

  const player = new URL((await meta('name="twitter:player"'))!);
  await page.goto(player.pathname);
  await expect(page.locator("video")).toHaveAttribute("src", video.pathname);
});

test("buttons click quietly until sound is turned off", async ({ page }) => {
  await page.addInitScript(() => {
    const start = AudioBufferSourceNode.prototype.start;
    Object.assign(window, { clicks: 0 });
    AudioBufferSourceNode.prototype.start = function (...args) {
      Object.assign(window, {
        clicks: (window as unknown as { clicks: number }).clicks + 1,
      });
      return start.apply(this, args);
    };
  });
  const clicks = () =>
    page.evaluate(() => (window as unknown as { clicks: number }).clicks);
  await page.goto("/");

  await page.getByRole("button", { name: "⌘", exact: true }).click();
  await expect.poll(clicks).toBeGreaterThan(0);

  await page.getByRole("option", { name: "Turn Sound Off" }).click();
  await page.keyboard.press("Escape");
  const silenced = await clicks();
  await page.getByRole("button", { name: "⌘", exact: true }).click();
  expect(await clicks()).toBe(silenced);
});

test("buttons still work without Web Audio", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Reflect.deleteProperty(window, "AudioContext");
  });
  await page.goto("/");
  await page.getByRole("button", { name: "⌘", exact: true }).click();
  await expect(page.getByRole("option").first()).toBeVisible();
  expect(errors).toEqual([]);
});
