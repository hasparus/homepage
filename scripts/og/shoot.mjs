// Screenshots /og/<name> from a running dev server into public/content/<name>/og.png at 2x, and with --video, its looping og.mp4.
import { spawn } from "node:child_process";

import { chromium } from "@playwright/test";

const FPS = 30;

const [, , name, flag] = process.argv;
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

if (flag === "--video") {
  await page.waitForFunction(() => window.ogScene);
  const duration = await page.evaluate(() => window.ogScene.duration);
  const ffmpeg = spawn(
    "ffmpeg",
    // prettier-ignore
    [
      "-y", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", `${FPS}`, "-i", "-",
      "-vf", "scale=1200:630:flags=lanczos",
      "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      `public/content/${name}/og.mp4`,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const exited = new Promise((resolve, reject) =>
    ffmpeg.on("close", (code) =>
      code ? reject(new Error(`ffmpeg exited with ${code}`)) : resolve(),
    ),
  );
  for (let frame = 0; frame < Math.round((duration / 1000) * FPS); frame++) {
    await page.evaluate((t) => window.ogScene.seek(t), (frame * 1000) / FPS);
    ffmpeg.stdin.write(await page.screenshot());
  }
  ffmpeg.stdin.end();
  await exited;
}

await browser.close();
