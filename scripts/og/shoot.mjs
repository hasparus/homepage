import { chromium } from "@playwright/test";
const [, , name] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(new URL(`./${name}.html`, import.meta.url).href);
await page.screenshot({ path: `src/images/${name}/og.png` });
await browser.close();
