import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { Readable } from "node:stream";

import middleware from "../middleware";
import mcp from "../api/mcp";
import og from "../api/og";
import status from "../api/status";

process.env.VERCEL_URL = "localhost:4321";
const upstream = spawn(
  "pnpm",
  ["astro", "preview", "--host", "127.0.0.1", "--port", "4322"],
  { stdio: ["ignore", "pipe", "inherit"] },
);
const server = createServer(async (req, res) => {
  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(Buffer.from(chunk));
    const request = new Request(`http://localhost:4321${req.url}`, {
      method: req.method ?? "GET",
      headers: new Headers(req.headers as Record<string, string>),
      ...(buffers.length ? { body: Buffer.concat(buffers) } : {}),
    });
    let response = await middleware(request);
    const path = new URL(request.url).pathname;
    if (response.headers.has("x-middleware-next")) {
      const additions = response.headers;
      if (path === "/mcp" || path === "/api/mcp") response = await mcp.fetch(request);
      else if (path === "/api/status") response = status(request);
      else if (path === "/api/og") response = await og(request);
      else {
        response = await fetch(`http://127.0.0.1:4322${req.url}`, {
          method: req.method ?? "GET",
          headers: { Accept: request.headers.get("accept") || "*/*" },
          redirect: "manual",
        });
        const headers = new Headers(response.headers);
        if (path.endsWith(".md") && response.ok)
          headers.set("content-type", "text/markdown; charset=utf-8");
        if (path === "/.well-known/api-catalog" && response.ok)
          headers.set("content-type", "application/linkset+json");
        for (const [key, value] of additions)
          if (!key.startsWith("x-middleware-")) headers.set(key, value);
        response = new Response(response.body, {
          status: response.status,
          headers,
        });
      }
    }
    res.writeHead(
      response.status,
      Object.fromEntries(
        [...response.headers].filter(
          ([key]) => !["content-length", "content-encoding"].includes(key),
        ),
      ),
    );
    if (req.method === "HEAD" || !response.body) res.end();
    else
      Readable.fromWeb(
        response.body as unknown as import("node:stream/web").ReadableStream,
      ).pipe(res);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Preview request failed" }));
  }
});
let started = false;
upstream.stdout.on("data", (data) => {
  process.stdout.write(data);
  if (!started && data.toString().includes("http://")) {
    started = true;
    server.listen(4321, "127.0.0.1", () =>
      console.log("Agent-aware preview: http://localhost:4321"),
    );
  }
});
upstream.on("exit", (code) => {
  server.close();
  process.exit(code ?? 1);
});
for (const signal of ["SIGTERM", "SIGINT"] as const)
  process.on(signal, () => {
    server.close();
    upstream.kill(signal);
  });
