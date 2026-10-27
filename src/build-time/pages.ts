import { basename } from "node:path";
import type { MDXInstance } from "astro";

type PageMetadata = { title: string; description: string };
type PageDocument =
  | MDXInstance<PageMetadata>
  | (MDXInstance<Partial<PageMetadata>> & { metadata: PageMetadata });

const modules = import.meta.glob<PageDocument>("../content/pages/*.mdx", {
  eager: true,
});

export const pages = Object.entries(modules).map(([path, document]) => ({
  slug: basename(path, ".mdx"),
  document,
  metadata: "metadata" in document ? document.metadata : document.frontmatter,
}));
