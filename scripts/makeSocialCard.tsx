/**
 * Based on https://andrewingram.net/posts/automatic-social-cards-with-gatsby/
 */

/** @jsx jsx */
import { jsx, ThemeProvider, Styled as s } from "theme-ui";
import { writeFile } from "fs";
import { resolve } from "path";
import { createHash } from "crypto";
import { promisify } from "util";
import { Browser } from "puppeteer";
import { renderToStaticMarkup } from "react-dom/server";

import { theme } from "../src/gatsby-plugin-theme-ui/index";
import { Mdx } from "../__generated__/global";
import { assert } from "../src/lib";
import { BlogpostSocialPreview } from "../src/components";

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

/*
 * Returns the path to an image generated from the provided HTML.
 */
async function imageFromHtml(
  cacheDir: string,
  browser: Browser,
  title: string,
  html: string
) {
  const filePath = await writeCachedFile(cacheDir, title, html, "html");
  const page = await browser.newPage();
  await page.goto(`file://${filePath}`);
  await page.evaluateHandle("document.fonts.ready");
  await page.setViewport({ width: 880, height: 440 });
  const file = await page.screenshot({ type: "png" });
  return writeCachedFile(cacheDir, title, file, "png");
}

const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors.modes.dark,
    modes: theme.colors.modes,
  },
};

function getSocialCardHtml(post: Mdx) {
  return renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* We can't just import the font here */}
        <link
          rel="stylesheet"
          type="text/css"
          href={resolve(
            __dirname,
            "../node_modules/typeface-fira-code/index.css"
          )}
        />
      </head>
      <ThemeProvider theme={darkTheme}>
        <body sx={{ margin: 0, bg: "background" }}>
          <BlogpostSocialPreview post={post} />
        </body>
      </ThemeProvider>
    </html>
  );
}

/*
 * Takes a post (probably a Gatsby node of some kind), generates some HTML,
 * saves a screenshot, then returns the path to the saved image.
 */
export async function makeSocialCard(
  CACHE_DIR: string,
  browser: Browser,
  post: Mdx
) {
  const title = post?.frontmatter?.title;

  assert(title, "We can't render a social card for a post with no title.");

  const html = getSocialCardHtml(post);
  return imageFromHtml(CACHE_DIR, browser, title, html);
}
