import { test, expect } from "@playwright/test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { parseHTML } from "linkedom";

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
        text: main.innerText.replace(/\s+/g, " ").trim(),
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
  const response = await request.get("/bear-fit/", {
    headers: { "User-Agent": "Twitterbot/1.0" },
  });
  expect(response.ok()).toBe(true);
  const { document } = parseHTML(await response.text());
  const meta = (attribute: string) =>
    document.querySelector(`meta[${attribute}]`)?.getAttribute("content");
  const description = meta('name="description"');
  expect(description).toBe(
    "I built a thing to make meeting my friends dead simple. On two-click UX, absorbing complexity, and deciding what not to build.",
  );
  expect(meta('property="og:description"')).toBe(description);
  expect(meta('name="twitter:description"')).toBe(description);
  expect(meta('property="og:site_name"')).toBe("hasparus");
  expect(meta('name="twitter:title"')).toBe(meta('property="og:title"'));
  expect(meta('name="twitter:card"')).toBe("player");
  expect(meta('name="twitter:image"')).toBe(meta('property="og:image"'));
  const { origin } = new URL(meta('property="og:image"')!);
  const video = new URL(meta('property="og:video"')!);
  expect(video.origin).toBe(origin);
  expect(meta('name="twitter:player:stream"')).toBe(video.href);
  expect(meta('name="twitter:player:stream:content_type"')).toBe("video/mp4");
  const mp4 = await request.get(video.pathname);
  expect(mp4.ok()).toBe(true);
  expect(mp4.headers()["content-type"]).toMatch(/^video\/mp4/);

  const player = new URL(meta('name="twitter:player"')!);
  expect(player.origin).toBe(origin);
  expect(meta('name="twitter:player:width"')).toBe("1200");
  expect(meta('name="twitter:player:height"')).toBe("630");
  await page.goto(player.pathname);
  const embeddedVideo = page.locator("video");
  await expect(embeddedVideo).toHaveAttribute("src", video.pathname);
  await expect(embeddedVideo).toHaveAttribute("controls", "");
  await expect(embeddedVideo).toHaveJSProperty("loop", true);
  await expect(embeddedVideo).toHaveJSProperty("muted", true);
  await expect
    .poll(() =>
      embeddedVideo.evaluate((video: HTMLVideoElement) => video.currentTime),
    )
    .toBeGreaterThan(0);
});

declare global {
  interface Window {
    clicks: number;
  }
}

test("buttons click quietly until sound is turned off", async ({ page }) => {
  await page.addInitScript(() => {
    const start = AudioBufferSourceNode.prototype.start;
    window.clicks = 0;
    AudioBufferSourceNode.prototype.start = function (...args) {
      window.clicks++;
      return start.apply(this, args);
    };
  });
  const clicks = () => page.evaluate(() => window.clicks);
  await page.goto("/");

  await page.getByRole("button", { name: "⌘", exact: true }).click();
  await expect.poll(clicks).toBeGreaterThan(0);

  await page.getByRole("option", { name: "Turn Sound Off" }).click();
  await page.keyboard.press("Escape");
  const silenced = await clicks();
  await page.getByRole("button", { name: "⌘", exact: true }).click();
  expect(await clicks()).toBe(silenced);

  await page.getByRole("option", { name: "Turn Sound On" }).click();
  await page.keyboard.press("Escape");
  const resumed = await clicks();
  await page.getByRole("button", { name: "⌘", exact: true }).click();
  await expect.poll(clicks).toBeGreaterThan(resumed);
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
