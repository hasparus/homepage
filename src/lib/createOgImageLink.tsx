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

export interface SocialCard {
  image: string;
  /** A looping mp4 and the page X's player card embeds to play it. */
  video?: { player: string; src: string };
}

export function socialCardOf(frontmatter: PostFrontmatter): SocialCard {
  const src = ogVideoOf(frontmatter);
  return {
    image: createOgImageLink(frontmatter),
    ...(src && {
      video: { player: `/og/player/${playerPathOf(frontmatter)}/`, src },
    }),
  };
}

/** The `[...path]` param of the post's X player page. */
export const playerPathOf = (frontmatter: PostFrontmatter) =>
  frontmatter.path.slice(1);

export function ogVideoOf(frontmatter: PostFrontmatter) {
  const video =
    typeof frontmatter.img === "object" ? frontmatter.img.ogVideo : undefined;
  if (video !== undefined && !/^\/content\/.+\.mp4$/.test(video))
    throw new Error(
      `${frontmatter.path}: img.ogVideo must be a /content/**/*.mp4 path served from public/, got ${video}`,
    );
  return video;
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
