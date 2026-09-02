// Screenshots /og/<name> from a running dev server into public/content/<name>/og.png at 2x.
import { chromium } from "@playwright/test";
const [, , name] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto(`http://localhost:4321/og/${name}`, {
  waitUntil: "networkidle",
});
await page.evaluate(() => {
  document.querySelector("astro-dev-toolbar")?.remove();
  return document.fonts.ready;
});
await page.locator("#og").screenshot({ path: `public/content/${name}/og.png` });
await browser.close();
