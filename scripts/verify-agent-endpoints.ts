import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import SwaggerParser from "@apidevtools/swagger-parser";

const base = new URL(process.argv[2] || "http://localhost:4321");
const url = (path: string) => new URL(path, base);
async function get(path: string, type: string, status = 200) {
  const response = await fetch(url(path), {
    headers: { Accept: type },
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, status, `${path}: status`);
  assert.ok(
    response.headers.get("content-type")?.startsWith(type),
    `${path}: Content-Type`,
  );
  const body = await response.text();
  assert.ok(body.length > 0, `${path}: body`);
  console.log(
    `${response.status} ${response.headers.get("content-type")} ${path}`,
  );
  return { body, response };
}

for (const path of ["/", "/about/", "/contact/", "/privacy/", "/docs/"]) {
  const markdown = await get(path, "text/markdown");
  assert.ok(markdown.response.headers.get("vary")?.includes("Accept"));
  assert.ok(markdown.body.startsWith("# "));
  await get(path, "text/html");
}
await get("/does-not-exist-agent-verification", "text/markdown", 404);
await get("/does-not-exist-agent-verification", "text/html", 404);
const spec = await get("/openapi.json", "application/json");
await SwaggerParser.validate(JSON.parse(spec.body));
for (const path of Object.keys(JSON.parse(spec.body).paths))
  await get(path, "application/json");
await get("/api/does-not-exist", "application/json", 404);
await get("/.well-known/api-catalog", "application/linkset+json");
for (const path of ["/llms.txt", "/llms-full.txt", "/robots.txt"])
  await get(path, "text/plain");
for (const path of [
  "/index.md",
  "/about.md",
  "/contact.md",
  "/privacy.md",
  "/docs.md",
])
  await get(path, "text/markdown");
for (const path of ["/sitemap-index.xml", "/sitemap-0.xml", "/rss.xml"]) {
  const response = await fetch(url(path));
  assert.equal(response.status, 200, path);
  assert.ok((await response.text()).includes("<?xml"), path);
  console.log(`200 XML ${path}`);
}
await get("/api/status", "text/plain");
await get("/api/og", "application/json", 400);
for (const path of ["/api/profile.json", "/api/posts.json"]) {
  const denied = await fetch(url(path), { method: "POST" });
  assert.equal(denied.status, 405);
  assert.equal(denied.headers.get("allow"), "GET, HEAD");
  assert.ok((await denied.json()).error.hint);
}
const image = await fetch(url("/og.png"));
assert.equal(image.status, 200);
assert.ok(image.headers.get("content-type")?.startsWith("image/png"));
assert.ok((await image.arrayBuffer()).byteLength > 100);
const { posts } = JSON.parse(
  (await get("/api/posts.json", "application/json")).body,
);
for (const post of posts) {
  await get(new URL(post.url).pathname, "text/html");
  await get(new URL(post.markdownUrl).pathname, "text/markdown");
}

if (base.hostname !== "localhost" && base.hostname !== "127.0.0.1") {
  const article = await (await fetch(url("/refinement-types/"))).text();
  const meta = article.match(/<meta property="og:image" content="([^"]+)"/);
  assert.ok(meta, "Article OG image");
  const signedUrl = new URL(meta[1]!.replaceAll("&amp;", "&"));
  const signed = await fetch(url(signedUrl.pathname + signedUrl.search));
  assert.equal(signed.status, 200, "Signed OG image");
  assert.ok(signed.headers.get("content-type")?.startsWith("image/png"));
  assert.ok((await signed.arrayBuffer()).byteLength > 100);
  signedUrl.searchParams.set("token", "invalid");
  const invalid = await fetch(url(signedUrl.pathname + signedUrl.search));
  assert.equal(invalid.status, 401, "Invalid OG token");
  assert.equal((await invalid.json()).error.code, "INVALID_TOKEN");
  console.log("Signed OG image and token rejection verified.");
}

const getMcp = await fetch(url("/mcp"), {
  headers: { Accept: "text/event-stream" },
});
assert.equal(getMcp.status, 405);
const client = new Client({ name: "hasparus-verifier", version: "1.0.0" });
await client.connect(
  new StreamableHTTPClientTransport(
    url("/mcp"),
  ) as import("@modelcontextprotocol/sdk/shared/transport.js").Transport,
);
try {
  const { resources } = await client.listResources();
  assert.ok(resources.length > 0);
  for (const resource of resources) {
    assert.ok(resource.mimeType);
    const { contents } = await client.readResource({ uri: resource.uri });
    assert.ok(contents.length > 0);
    for (const content of contents) {
      assert.equal(content.mimeType, resource.mimeType);
      assert.ok("text" in content && content.text.length > 0);
      assert.equal(
        (await fetch(url(new URL(content.uri).pathname))).status,
        200,
      );
      const links = content.text.matchAll(
        /https:\/\/haspar\.us\/[^\s)"\]<>;,]+/g,
      );
      for (const [link] of links) {
        const target = new URL(link);
        const response = await fetch(url(target.pathname), {
          method: "GET",
          signal: AbortSignal.timeout(15000),
        });
        assert.ok(
          response.ok ||
            (target.pathname === "/mcp" && response.status === 405),
          link,
        );
      }
    }
    console.log(`MCP resource OK ${resource.uri}`);
  }
  assert.equal((await client.listTools()).tools.length, 2);
  assert.ok(
    !(await client.callTool({ name: "list_posts", arguments: {} })).isError,
  );
  assert.ok(
    !(
      await client.callTool({
        name: "read_post",
        arguments: { slug: "refinement-types" },
      })
    ).isError,
  );
} finally {
  await client.close();
}
console.log(
  `Verified agent endpoints and ${posts.length} public articles on ${base.origin}`,
);
