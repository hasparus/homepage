// Screenshots /og/<name> from a running dev server into public/content/<name>/og.png at 2x, and with --video, its looping og.mp4.
import { spawn } from "node:child_process";
import { once } from "node:events";
import { rename } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { chromium } from "@playwright/test";

const FPS = 30;

const [, , name, flag] = process.argv;
const dir = `public/content/${name}`;
const browser = await chromium.launch();
try {
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
  await page.locator("#og").screenshot({ path: `${dir}/og.png` });

  if (flag === "--video") {
    await page.waitForFunction(() => window.ogScene);
    const duration = await page.evaluate(() => window.ogScene.duration);
    const frameCount = Math.round((duration / 1000) * FPS);
    async function* frames() {
      for (let frame = 0; frame < frameCount; frame++) {
        const t = (frame * 1000) / FPS;
        await page.evaluate((t) => window.ogScene.seek(t), t);
        yield await page.screenshot();
      }
    }

    const ffmpeg = spawn(
      "ffmpeg",
      // prettier-ignore
      [
        "-y", "-loglevel", "error",
        "-f", "image2pipe", "-framerate", `${FPS}`, "-i", "-",
        "-vf", "scale=1200:630:flags=lanczos",
        "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        `${dir}/og.tmp.mp4`,
      ],
      { stdio: ["pipe", "inherit", "inherit"] },
    );
    const [[code]] = await Promise.all([
      once(ffmpeg, "exit"),
      pipeline(Readable.from(frames()), ffmpeg.stdin),
    ]);
    if (code) throw new Error(`ffmpeg exited with ${code}`);
    await rename(`${dir}/og.tmp.mp4`, `${dir}/og.mp4`);
  }
} finally {
  await browser.close();
}
