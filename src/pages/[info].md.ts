import type { APIRoute } from "astro";
import { pageMarkdown, pages } from "../lib/agents/content";

export function getStaticPaths() {
  return Object.keys(pages).map((info) => ({ params: { info } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(pageMarkdown(params.info as keyof typeof pages), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
