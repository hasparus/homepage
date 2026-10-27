import type { MDXInstance } from "astro";
import { isPostVisible } from "../lib/isPostVisible";
import type { PostFrontmatter } from "../types";

const modules = import.meta.glob<MDXInstance<PostFrontmatter>>(
  "/posts/**/*.mdx",
  { eager: true },
);
const sources = import.meta.glob<string>("/posts/**/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const allPosts = Object.entries(modules).map(([key, module]) => ({
  key,
  module,
}));
export const visiblePosts = allPosts.filter(({ module }) =>
  isPostVisible(module.frontmatter),
);
export const orderedPosts = [...visiblePosts].sort(
  (a, b) =>
    new Date(b.module.frontmatter.date).getTime() -
    new Date(a.module.frontmatter.date).getTime(),
);

export function postMarkdown({
  key,
  module,
}: (typeof allPosts)[number]): string {
  const source = sources[key];
  if (source === undefined) throw new Error(`Missing article source: ${key}`);
  const end = source.startsWith("---") ? source.indexOf("\n---", 3) : -1;
  const body =
    end === -1 ? source : source.slice(end + 4).replace(/^\r?\n/, "");
  return `# ${module.frontmatter.title}\n\n${body.trim()}\n`;
}
