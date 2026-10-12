import type { APIRoute } from "astro";
import { publicPosts } from "../../lib/agents/posts";

export const GET: APIRoute = () => Response.json({ posts: publicPosts() });
