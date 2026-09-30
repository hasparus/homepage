import { next } from "@vercel/edge";

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
        headers: { Accept: "text/html" },
        redirect: "follow",
      });
  if (
    markdown?.ok &&
    markdown.headers.get("content-type")?.startsWith("text/markdown")
  ) {
    const headers = new Headers(markdown.headers);
    headers.set("Vary", "Accept");
    headers.delete("content-length");
    headers.delete("content-encoding");
    return new Response(request.method === "HEAD" ? null : markdown.body, {
      status: 200,
      headers,
    });
  }

  const html = await fetch(url, {
    headers: { Accept: "text/html" },
    redirect: "follow",
  });
  if (html.status === 404) {
    return new Response(request.method === "HEAD" ? null : markdown404, {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
      },
    });
  }
  const headers = new Headers(html.headers);
  headers.set("Vary", "Accept");
  headers.delete("content-length");
  headers.delete("content-encoding");
  return new Response(request.method === "HEAD" ? null : html.body, {
    status: html.status,
    headers,
  });
}
