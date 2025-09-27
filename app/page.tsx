/**
 * @jsxImportSource react
 */

import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { createHmac } from "node:crypto";

interface PostFrontmatter {
  title?: string;
  date?: string;
  img?: string | { og?: string; src?: string };
  readingTime?: { minutes: number };
}

function parseFrontmatter(content: string): PostFrontmatter {
  const frontmatterMatch = /^---\n([\s\S]*?)\n---/.exec(content);
  if (!frontmatterMatch) return {};

  const frontmatterText = frontmatterMatch[1];
  const frontmatter: PostFrontmatter = {};

  // Parse basic fields
  const titleMatch = frontmatterText.match(/title:\s*["']?([^"'\n]+)["']?/);
  if (titleMatch) frontmatter.title = titleMatch[1].trim();

  const dateMatch = frontmatterText.match(/date:\s*(.+)/);
  if (dateMatch) frontmatter.date = dateMatch[1].trim();

  const imgMatch = frontmatterText.match(/img:\s*(.+)/);
  if (imgMatch) frontmatter.img = imgMatch[1].trim();

  return frontmatter;
}

function createOgImageLink(filename: string, frontmatter: PostFrontmatter) {
  const OG_IMAGE_SECRET = process.env.OG_IMAGE_SECRET || "fallback-secret";

  // Extract title from filename if not in frontmatter
  const title =
    frontmatter.title || filename.replace(".mdx", "").replace(/-/g, " ");

  // Parse date
  let date = new Date();
  if (frontmatter.date) {
    date = new Date(frontmatter.date);
  }

  // Mock reading time (since we don't have the actual calculation)
  const readingTimeMinutes = 5; // fallback

  // Handle image
  let img = frontmatter.img;
  if (typeof img === "object") img = img.og || img.src;
  if (typeof img === "string" && img.startsWith("raw!")) {
    img = img.replace(/^raw!/, "");
  }

  const stringifiedPost = `${date.getTime()}\t${readingTimeMinutes}\t${title}\t${img || ""}`;

  const hmac = createHmac("sha256", OG_IMAGE_SECRET);
  hmac.update(stringifiedPost);
  const token = hmac.digest("hex");

  return `/api/og?post=${encodeURIComponent(stringifiedPost)}&token=${token}`;
}

function getAllBlogPosts() {
  const postsDir = join(process.cwd(), "posts");
  const files = readdirSync(postsDir).filter((file) => file.endsWith(".mdx"));

  return files.map((file) => {
    const content = readFileSync(join(postsDir, file), "utf8");
    const frontmatter = parseFrontmatter(content);
    const ogLink = createOgImageLink(file, frontmatter);

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
