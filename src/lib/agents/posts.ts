import { orderedPosts } from "../../build-time/posts";
import { formatDate } from "../formatDate";
import type { PublicPost } from "./schemas";

export function publicPosts(): PublicPost[] {
  return orderedPosts.map(({ module: { frontmatter } }) => ({
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
