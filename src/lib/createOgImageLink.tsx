import { createHmac } from "node:crypto";

import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";

declare global {
  interface ImportMetaEnv {
    OG_IMAGE_SECRET?: string;
  }
}

const OG_IMAGE_SECRET =
  import.meta.env.OG_IMAGE_SECRET ||
  (() => {
    throw new Error("OG_IMAGE_SECRET is not set");
  })();

/** The post's Open Graph image and, when `img.ogVideo` is set, its looping video. */
export function socialCardOf(frontmatter: PostFrontmatter) {
  const video =
    typeof frontmatter.img === "object" ? frontmatter.img.ogVideo : undefined;
  if (video !== undefined && !/^\/content\/.+\.mp4$/.test(video))
    throw new Error(
      `${frontmatter.path}: img.ogVideo must be a /content/**/*.mp4 path served from public/, got ${video}`,
    );
  return { image: createOgImageLink(frontmatter), video };
}

export function createOgImageLink(frontmatter: PostFrontmatter) {
  let img = frontmatter.img;
  if (typeof img === "object") img = img.og || img.src;
  if (img?.startsWith("static!")) return img.slice("static!".length);

  // prettier-ignore
  const stringifiedPost: StringifiedPost = `${
    new Date(frontmatter.date).getTime()
  }\t${
    frontmatter.readingTime.minutes
  }\t${
    frontmatter.title
  }\t${
    img?.replace(/^raw!/, "") || ""
  }`;

  const hmac = createHmac("sha256", OG_IMAGE_SECRET);
  hmac.update(stringifiedPost);
  const token = hmac.digest("hex");

  return `/api/og?post=${encodeURIComponent(stringifiedPost)}&token=${token}`;
}
