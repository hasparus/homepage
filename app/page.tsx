/**
 * @jsxImportSource react
 */

import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// @ts-expect-error too lazy to install @types/gray-matter
import matter from "gray-matter";

import { createOgImageLink } from "../src/lib/createOgImageLink";
import type { PostFrontmatter } from "../src/types";

function getAllBlogPosts() {
  const postsDir = join(process.cwd(), "posts");
  const files = readdirSync(postsDir).filter((file) => file.endsWith(".mdx"));

  return files.map((file) => {
    const content = readFileSync(join(postsDir, file), "utf8");
    const frontmatter = matter(content).data as PostFrontmatter;

    const ogLink = createOgImageLink({
      ...frontmatter,
      date: frontmatter.date || new Date().toISOString(),
      readingTime: {
        minutes: 5,
      } as import("reading-time").ReadTimeResults,
    });

    return {
      filename: file,
      title: frontmatter.title || file.replace(".mdx", "").replace(/-/g, " "),
      ogLink,
    };
  });
}

export default function Home() {
  const posts = getAllBlogPosts();

  return (
    <main className="p-8">
      <h1 className="mb-6 font-bold">blog post og images</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.filename}>
            <a
              href={post.ogLink}
              className="block p-0.5 underline decoration-gray-200 underline-offset-4 hover:decoration-transparent focus:decoration-transparent dark:decoration-gray-700 dark:hover:decoration-transparent dark:focus:decoration-transparent"
            >
              {post.filename}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
