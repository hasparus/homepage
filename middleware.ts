import { next, rewrite } from "@vercel/edge";

import {
  jsonError,
  markdown404,
  prefersMarkdown,
} from "./src/lib/agents/http.js";

const staticApi = new Set(["/api/profile.json", "/api/posts.json"]);
const functions = new Set(["/api/status", "/api/og", "/api/mcp", "/mcp"]);

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "") || "/";
  const readOnly = request.method === "GET" || request.method === "HEAD";

  if ((path === "/api" || path.startsWith("/api/")) && !functions.has(path)) {
    if (!staticApi.has(path)) {
      return jsonError(
        404,
        "NOT_FOUND",
        "Unknown API endpoint.",
        "The endpoints are listed at https://haspar.us/openapi.json.",
      );
    }
    if (!readOnly) {
      return jsonError(
        405,
        "METHOD_NOT_ALLOWED",
        "This endpoint only reads content.",
        "Use GET or HEAD; no authentication is required.",
        { Allow: "GET, HEAD" },
      );
    }
    return next();
  }

  if (functions.has(path) || !readOnly) return next();
  if (!prefersMarkdown(request.headers.get("accept") || "")) {
    return next({ headers: { Vary: "Accept" } });
  }

  const hasExtension = /\.[^/]+$/.test(path);
  const markdownUrl = new URL(url);
  markdownUrl.pathname = path === "/" ? "/index.md" : `${path}.md`;
  markdownUrl.search = "";
  const markdown = hasExtension
    ? null
    : await fetch(markdownUrl, {
        method: "HEAD",
        headers: { Accept: "text/html" },
        redirect: "follow",
      });
  if (
    markdown?.ok &&
    markdown.headers.get("content-type")?.startsWith("text/markdown")
  ) {
    return rewrite(markdownUrl, { headers: { Vary: "Accept" } });
  }

  const html = await fetch(url, {
    method: "HEAD",
    headers: { Accept: "text/html" },
    redirect: "follow",
  });
  if (html.status === 404) {
    return new Response(markdown404, {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
      },
    });
  }
  return next({ headers: { Vary: "Accept" } });
}
