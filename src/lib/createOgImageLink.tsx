import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";
import { signOgPost } from "./ogToken";
import type { ResolvedPostImages } from "./postImages";

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

/** A ready-made `og.image` is served as is. Otherwise `/api/og` draws a card over `og.backgroundImage`. */
export function socialCardOf(
  frontmatter: PostFrontmatter,
  { image, backgroundImage, video }: ResolvedPostImages["og"],
): SocialCard {
  return {
    image: image ?? createOgImageLink(frontmatter, backgroundImage),
    ...(video && {
      video: { player: `/og/player/${playerPathOf(frontmatter)}/`, src: video },
    }),
  };
}

/** The `[...path]` param of the post's X player page. */
export const playerPathOf = (frontmatter: PostFrontmatter) =>
  frontmatter.path.slice(1);

function createOgImageLink(
  frontmatter: PostFrontmatter,
  img: string | undefined,
) {
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

  const token = signOgPost(OG_IMAGE_SECRET, stringifiedPost);

  return `/api/og?post=${encodeURIComponent(stringifiedPost)}&token=${token}`;
}
