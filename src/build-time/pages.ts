import { basename } from "node:path";
import type { MDXInstance } from "astro";

const modules = import.meta.glob<
  MDXInstance<{ title: string; description: string }>
>("../content/pages/*.mdx", { eager: true });

export const pages = Object.entries(modules).map(([path, document]) => ({
  slug: basename(path, ".mdx"),
  document,
}));
