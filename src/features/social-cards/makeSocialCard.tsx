/**
 * Based on https://andrewingram.net/posts/automatic-social-cards-with-gatsby/
 */

/** @jsx jsx */
import { createHash } from "crypto";
import { writeFile } from "fs";
import { resolve } from "path";
import { promisify } from "util";

import { Browser } from "puppeteer";
import { renderToStaticMarkup } from "react-dom/server";
import { jsx, ThemeProvider } from "theme-ui";

import { theme } from "../../gatsby-plugin-theme-ui/index";
import { buildTime } from "../../lib/build-time/gatsby-node-utils";
import { getNodeTitle } from "../../lib/build-time/getNodeTitle";
import { assert } from "../../lib/util/assert";

import { PostSocialPreview } from "./PostSocialPreview";

const VERBOSE = true;
const log = VERBOSE ? console.log : () => {};

const writeFileAsync = promisify(writeFile);

/**
 * Writes a file to the cache location
 */
async function writeCachedFile(
  cacheDir: string,
  key: string,
  contents: Buffer | string,
  extension: string
) {
  // I'm using the title as the key for the hash, because it's the only
  // thing which impacts the final image. If you were to have something
  // more elaborate, you should just use the HTML as the hash instead.
  const fileName = `${createHash("md5")
    .update(key)
    .digest("hex")}.${extension}`;
  const absolutePath = resolve(cacheDir, fileName);
  await writeFileAsync(absolutePath, contents);
  return absolutePath;
}

const _screenshotStatus: Record<string /* title */, string> = {};

/*
 * Returns the path to an image generated from the provided HTML.
 */
async function imageFromHtml(
  cacheDir: string,
  browser: Browser,
  title: string,
  html: string
) {
  const status = (str: string) => {
    _screenshotStatus[title] = str;
    log(`${title}: ${str}`);
  };

  let file: Buffer;
  const filePath = await writeCachedFile(cacheDir, title, html, "html");
  try {
    const page = await browser.newPage();

    try {
      status(`Visiting ${filePath}`);
      await page.goto(`file://${filePath}`, { timeout: 60000 });
      status(`Waiting for document.fonts.ready`);
      await page.evaluateHandle("document.fonts.ready");
      await page.setViewport({ width: 880, height: 440 });
      log(`Taking a screenshot`);
      file = await page.screenshot({ type: "png" });
      status(`Screenshot taken`);
    } finally {
      await page.close();
    }
  } catch (err: unknown) {
    console.error("failed to create image from HTML", {
      err,
      title,
      cacheDir,
      filePath,
      status: _screenshotStatus[title],
      _screenshotStatus,
    });
    throw err;
  }
  return writeCachedFile(cacheDir, title, file, "png");
}

function getSocialCardHtml(post: buildTime.Mdx, title: string) {
  return renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Lexend+Deca&display=block"
          rel="stylesheet"
        />
        <style
          // finally colorful emojis on cloud builds ヽ(✿ﾟ▽ﾟ)ノ
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: /* css */ `
              @font-face {
                font-family: 'Noto Color Emoji';
                src: url(https://gitcdn.xyz/repo/googlefonts/noto-emoji/master/fonts/NotoColorEmoji.ttf);
              }
          `,
          }}
        />
      </head>
      <ThemeProvider theme={theme}>
        <body
          sx={{
            margin: 0,
            bg: "background",
            "*": {
              fontFamily:
                '"Lexend Deca", "Noto Color Emoji" !important' /* 🙊 */,
            },
          }}
        >
          <PostSocialPreview post={post} title={title} />
        </body>
      </ThemeProvider>
    </html>
  );
}

const MAX_POOL_SIZE = 8;
let currentPoolSize = 0;
const listenersQueue: (() => void)[] = [];
async function pool<T>(f: () => Promise<T>): Promise<T> {
  if (currentPoolSize < MAX_POOL_SIZE) {
    currentPoolSize++;
    const res = await f();
    currentPoolSize--;

    if (currentPoolSize < MAX_POOL_SIZE) {
      const listener = listenersQueue.shift();
      listener?.();
    }

    return res;
  } else {
    return new Promise((resolve) => {
      listenersQueue.push(() => {
        void pool(f).then(resolve);
      });
    });
  }
}

export async function makeSocialCard(
  CACHE_DIR: string,
  browser: Browser,
  post: buildTime.Mdx
) {
  const title = getNodeTitle(post, post.rawBody);

  if (!title) {
    console.error("title is missing");
    // debugger;
  }

  assert(title, "We can't render a social card for a post with no title.");

  const html = getSocialCardHtml(post, title);
  return pool(() => imageFromHtml(CACHE_DIR, browser, title, html));
}
