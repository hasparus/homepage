import { toMatchImageSnapshot } from "jest-image-snapshot";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDocument, queries } from "pptr-testing-library";
import puppeteer, { type Browser, Page } from "puppeteer";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const HEADLESS = true;

expect.extend({ toMatchImageSnapshot });

const postsDir = new URL("../posts", import.meta.url).pathname;
let allPostFiles = await readdir(postsDir, { recursive: true });
allPostFiles = allPostFiles.filter((file) => /\.mdx?$/.test(file));

// Filter out hidden/draft posts that won't appear on the index page
const visiblePostFiles: string[] = [];
for (const file of allPostFiles) {
  const content = await readFile(join(postsDir, file), "utf-8");
  const isHidden = /^hidden:\s*true/m.test(content);
  if (!isHidden) {
    visiblePostFiles.push(file);
  }
}

let postsInFS = visiblePostFiles
  .map((file) => file.replace(/\.mdx?$/, ""))
  .sort();

/**
 * We're doing visual testing in a blog starter to ensure
 * that version updates don't break anything.
 */
describe("visual regression", async () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: HEADLESS,
    });
    page = await browser.newPage();
  });

  // Use the filtered visible posts, normalizing spaces to hyphens for URL matching
  const postsForScreenshots = visiblePostFiles
    .map((file) => file.replace(/\.mdx?$/, "").replaceAll(" ", "-"));

  // the tests are ran in order with no file parallelism

  it("renders links to all posts on index page", async () => {
    await page.goto("http://localhost:4321");

    const document = await getDocument(page);
    const handles = await queries.getAllByRole(document, "link");

    const hrefs: string[] = [];
    for (const handle of handles) {
      const href = await handle.evaluate((el) => el.getAttribute("href"));
      if (href) {
        hrefs.push(href.replace(/^\//, ""));
      }
    }

    for (const post of postsInFS) {
      expect(hrefs).toContain(post);
    }
  });

  it("matches screenshot on index page", async () => {
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchImageSnapshot();
  });

  it("matches screenshots in blog posts", { timeout: 60_000 }, async () => {
    for (const post of postsForScreenshots) {
      await page.goto(`http://localhost:4321/${post}`);
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot();
    }
  });

  afterAll(async () => {
    await browser.close();
  });
});

declare module "vitest" {
  interface Assertion<T> {
    toMatchImageSnapshot: () => T;
  }
}
