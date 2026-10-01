import { formatDate } from "../formatDate";
import { isPostVisible } from "../isPostVisible";
import type { PostFrontmatter } from "../../types";

const postModules = import.meta.glob<{ frontmatter: PostFrontmatter }>(
  "../../../posts/**/*.mdx",
  { eager: true },
);

export function publicPosts() {
  return Object.values(postModules)
    .filter(({ frontmatter }) => isPostVisible(frontmatter))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    )
    .map(({ frontmatter }) => ({
      slug: frontmatter.path.replace(/^\//, "").replace(/\/$/, ""),
      title: frontmatter.title,
      description: frontmatter.description?.trim() ?? "",
      date: formatDate(frontmatter.date),
      url: new URL(frontmatter.path, "https://haspar.us/").href,
      markdownUrl: new URL(
        `${frontmatter.path.replace(/\/$/, "")}.md`,
        "https://haspar.us/",
      ).href,
    }));
}
