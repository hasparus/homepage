import rss from "@astrojs/rss";

import { isPostVisible } from "../lib/isPostVisible";
import { SITE_BLURB, SITE_NAME } from "../lib/siteMeta";
import type { PostProps } from "../types";

const postImportResult = import.meta.glob<PostProps>("../../posts/**/*.mdx", {
  eager: true,
});
const posts = Object.values(postImportResult).filter((p) =>
  isPostVisible(p.frontmatter),
);

export const GET = () =>
  rss({
    title: SITE_NAME,
    description: SITE_BLURB,
    site: "https://haspar.us",
    items: posts.map(({ frontmatter }) => ({
      title: frontmatter.title,
      link: frontmatter.path,
      pubDate: new Date(frontmatter.date),
      ...(frontmatter.description
        ? { description: frontmatter.description }
        : {}),
    })),
  });
