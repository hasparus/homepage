import type { APIRoute } from "astro";
import { orderedPosts, postMarkdown } from "../build-time/posts";

export const GET: APIRoute = () =>
  new Response(orderedPosts.map(postMarkdown).join("\n---\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
