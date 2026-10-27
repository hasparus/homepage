import rss from "@astrojs/rss";

import { visiblePosts } from "../build-time/posts";
import { SITE_BLURB, SITE_NAME } from "../lib/siteMeta";

export const GET = () =>
  rss({
    title: SITE_NAME,
    description: SITE_BLURB,
    site: "https://haspar.us",
    items: visiblePosts.map(({ module: { frontmatter } }) => ({
      title: frontmatter.title,
      link: frontmatter.path,
      pubDate: new Date(frontmatter.date),
      ...(frontmatter.description
        ? { description: frontmatter.description }
        : {}),
    })),
  });
