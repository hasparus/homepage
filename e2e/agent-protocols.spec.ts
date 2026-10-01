import { expect, test } from "@playwright/test";
import SwaggerParser from "@apidevtools/swagger-parser";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { acceptCases } from "./accept-cases";

test.setTimeout(120_000);
const base = process.env.PLAYWRIGHT_BASE_URL;
if (!base)
  throw new Error(
    "Run hosted protocol tests with pnpm verify:agents <deployment-url>.",
  );
const mcpHeaders = {
  Accept: "application/json, text/event-stream",
  "Content-Type": "application/json",
};

for (const path of [
  "/",
  "/refinement-types/",
  "/docs/",
  "/about/",
  "/contact/",
  "/privacy/",
]) {
  test(`${path} negotiates Markdown and keeps HTML`, async ({ request }) => {
    const md = await request.get(path, {
      headers: { Accept: "text/markdown" },
    });
    expect(md.status()).toBe(200);
    expect(md.headers()["content-type"]).toMatch(/^text\/markdown/);
    expect(md.headers().vary).toContain("Accept");
    expect(await md.text()).toMatch(/^# /);
    const html = await request.get(path, { headers: { Accept: "text/html" } });
    expect(html.status()).toBe(200);
    expect(html.headers()["content-type"]).toMatch(/^text\/html/);
    expect(html.headers().vary).toContain("Accept");
    expect(await html.text()).toContain('<html lang="en">');
  });
}

for (const missingPath of [
  "/some-path-that-does-not-exist",
  "/__ora-404-probe-test",
  "/missing-file.md",
  "/missing-file.html",
]) {
  test(`${missingPath}: Markdown 404 keeps status, media type, explanation, and a real index link`, async ({
    request,
  }) => {
    const res = await request.get(missingPath, {
      headers: { Accept: "text/markdown" },
    });
    expect(res.status()).toBe(404);
    expect(res.headers()["content-type"]).toMatch(/^text\/markdown/);
    expect(res.headers().vary).toContain("Accept");
    expect((await res.text()).length).toBeGreaterThan(20);
    expect(await res.text()).toContain("https://haspar.us/llms.txt");
    const html = await request.get("/some-path-that-does-not-exist", {
      headers: { Accept: "text/html" },
    });
    expect(html.status()).toBe(404);
    expect(html.headers()["content-type"]).toMatch(/^text\/html/);
    expect(await html.text()).toContain("Hello stranger.");
  });
}

test("quality values retain HTML when preferred; HEAD has negotiation headers without a body", async ({
  request,
}) => {
  for (const accept of [
    "*/*",
    "text/markdown;q=0",
    "text/html,text/markdown;q=0.5",
  ]) {
    const res = await request.get("/", { headers: { Accept: accept } });
    expect(res.headers()["content-type"]).toMatch(/^text\/html/);
  }
  const head = await request.head("/", {
    headers: { Accept: "text/markdown" },
  });
  expect(head.status()).toBe(200);
  expect(head.headers()["content-type"]).toMatch(/^text\/markdown/);
  expect(await head.text()).toBe("");
});

test("OpenAPI is valid and every public response matches its schema", async ({
  request,
}) => {
  const response = await request.get("/openapi.json");
  expect(response.status()).toBe(200);
  const spec = await response.json();
  await SwaggerParser.validate(structuredClone(spec));
  const dereferenced = (await SwaggerParser.dereference(
    structuredClone(spec),
  )) as any;
  const ajv = new Ajv2020({ strict: false });
  addFormats(ajv);
  const ids = new Set();
  for (const [path, item] of Object.entries(dereferenced.paths) as [
    string,
    any,
  ][]) {
    expect(item.get.description.length).toBeGreaterThan(20);
    expect(ids.has(item.get.operationId)).toBe(false);
    ids.add(item.get.operationId);
    const res = await request.get(path);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^application\/json/);
    const validate = ajv.compile(
      item.get.responses["200"].content["application/json"].schema,
    );
    expect(validate(await res.json()), JSON.stringify(validate.errors)).toBe(
      true,
    );
    const denied = await request.post(path, { data: {} });
    expect(denied.status()).toBe(405);
    expect(denied.headers().allow).toBe("GET, HEAD");
    const validateError = ajv.compile(
      item.get.responses["405"].content["application/json"].schema,
    );
    expect(validateError(await denied.json())).toBe(true);
  }
  const missing = await request.get("/api/not-a-real-endpoint");
  expect(missing.status()).toBe(404);
  expect(await missing.json()).toEqual({
    error: {
      code: "NOT_FOUND",
      message: expect.any(String),
      hint: expect.stringContaining("openapi.json"),
    },
  });
});

test("every listed article and source resolves; hidden posts remain unlisted", async ({
  request,
}) => {
  const { posts } = await (await request.get("/api/posts.json")).json();
  expect(posts.length).toBeGreaterThan(0);
  expect(posts.some((post: any) => post.slug === "nie-trzeba")).toBe(false);
  for (const post of posts) {
    for (const url of [post.url, post.markdownUrl]) {
      const response = await request.get(new URL(url).pathname);
      expect(response.status(), url).toBe(200);
      if (url === post.url) {
        const published = (await response.text())
          .match(/<time[^>]*>([^<]+)<\/time>/)?.[1]
          ?.trim();
        expect(published, post.slug).toBe(post.date);
      }
    }
  }
});

test("MCP initializes, lists and reads all resources, and calls both tools through the official client", async ({
  request,
}) => {
  const client = new Client({ name: "hasparus-tests", version: "1.0.0" });
  await client.connect(
    new StreamableHTTPClientTransport(new URL(`${base}/mcp`)),
  );
  try {
    expect(client.getServerCapabilities()?.resources).toBeDefined();
    const { resources } = await client.listResources();
    expect(resources).toHaveLength(4);
    for (const resource of resources) {
      expect(resource.mimeType).toMatch(
        /^(application\/json|text\/(markdown|plain))$/,
      );
      const { contents } = await client.readResource({ uri: resource.uri });
      expect(contents.length).toBeGreaterThan(0);
      for (const content of contents) {
        expect(content.mimeType).toBe(resource.mimeType);
        expect(content.text?.length).toBeGreaterThan(20);
        const res = await fetch(`${base}${new URL(content.uri).pathname}`);
        expect(res.status).toBe(200);
        for (const [link] of (content.text || "").matchAll(
          /https:\/\/haspar\.us\/[^\s)"\]<>;,]+/g,
        )) {
          const target = new URL(link);
          const linked = await request.get(target.pathname);
          expect(
            linked.ok() ||
              (target.pathname === "/mcp" && linked.status() === 405),
            link,
          ).toBe(true);
        }
      }
    }
    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name)).toEqual([
      "list_posts",
      "read_post",
    ]);
    for (const tool of tools.tools)
      expect(tool.annotations?.readOnlyHint).toBe(true);
    const list = await client.callTool({ name: "list_posts", arguments: {} });
    expect(list.isError).not.toBe(true);
    const article = await client.callTool({
      name: "read_post",
      arguments: { slug: "refinement-types" },
    });
    expect(article.isError).not.toBe(true);
    expect(article.structuredContent?.markdown).toMatch(/^# Refinement Types/);
    const missing = await client.callTool({
      name: "read_post",
      arguments: { slug: "../../private" },
    });
    expect(missing.isError).toBe(true);
    expect(JSON.stringify(missing.content)).toContain("list_posts");
  } finally {
    await client.close();
  }
});

test("MCP rejects bad origins, malformed messages, invalid Accept, and GET SSE", async ({
  request,
}) => {
  const denied = await request.post("/mcp", {
    headers: { ...mcpHeaders, Origin: "https://attacker.example" },
    data: {},
  });
  expect(denied.status()).toBe(403);
  expect((await denied.json()).error.code).toBe(-32000);
  const bad = await request.post("/mcp", {
    headers: mcpHeaders,
    data: "not JSON",
  });
  expect(bad.status()).toBe(400);
  expect((await bad.json()).error).toBeDefined();
  const accept = await request.post("/mcp", {
    headers: { ...mcpHeaders, Accept: "application/json" },
    data: { jsonrpc: "2.0", id: 1, method: "ping" },
  });
  expect(accept.status()).toBe(406);
  const get = await request.get("/mcp", {
    headers: { Accept: "text/event-stream" },
  });
  expect(get.status()).toBe(405);
  expect(get.headers().allow).toBe("POST");
  const notification = await request.post("/mcp", {
    headers: mcpHeaders,
    data: { jsonrpc: "2.0", method: "notifications/initialized" },
  });
  expect(notification.status()).toBe(202);
  expect(await notification.text()).toBe("");
});

test("agent guide, API catalog, docs, info pages, and metadata are discoverable", async ({
  request,
  page,
}) => {
  const guide = await (await request.get("/llms.txt")).text();
  for (const link of [
    "/docs/",
    "/openapi.json",
    "/mcp",
    "/about/",
    "/contact/",
    "/privacy/",
  ])
    expect(guide).toContain(`https://haspar.us${link}`);
  const catalog = await request.get("/.well-known/api-catalog");
  expect(catalog.headers()["content-type"]).toBe("application/linkset+json");
  expect((await catalog.json()).linkset[0]["service-desc"][0].href).toBe(
    "https://haspar.us/openapi.json",
  );
  for (const path of ["about", "contact", "privacy"]) {
    await page.goto(`/${path}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link").first(),
    ).toBeVisible();
  }
  await page.goto("/");
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(
    (await request.get(new URL(image!).pathname)).headers()["content-type"],
  ).toMatch(/^image\/png/);
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const person = blocks
    .map((text) => JSON.parse(text))
    .find((data) => data["@type"] === "Person");
  const profile = await (await request.get("/api/profile.json")).json();
  expect(person.description).toBe(profile.description);
  expect(person.sameAs).toContain("https://github.com/hasparus");
});

test("homepage and About share the author's copy and metadata", async ({
  page,
  request,
}) => {
  const profile = await (await request.get("/api/profile.json")).json();
  await page.goto("/");
  const title = await page.title();
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  for (const path of ["/", "/about/"]) {
    await page.goto(path);
    await expect(
      page.getByText(profile.description, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "zagrajmy.net", exact: true }),
    ).toHaveAttribute("href", "https://zagrajmy.net");
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      description!,
    );
  }
  for (const path of ["/index.md", "/about.md"]) {
    const markdown = await (await request.get(path)).text();
    expect(markdown).toContain("[zagrajmy.net](https://zagrajmy.net)");
  }
});

test("existing operational endpoints keep success behavior and OG errors become structured JSON", async ({
  request,
}) => {
  const status = await request.get("/api/status");
  expect(status.status()).toBe(200);
  expect(await status.text()).toBe("ok");
  const image = await request.get("/api/og");
  expect(image.status()).toBe(400);
  expect(image.headers()["content-type"]).toMatch(/^application\/json/);
  expect((await image.json()).error).toEqual({
    code: "INVALID_PARAMETERS",
    message: expect.any(String),
    hint: expect.any(String),
  });
});

test("deployed negotiation honors media-type quality and specificity", async ({
  request,
}) => {
  for (const { accept, markdown } of acceptCases) {
    const response = await request.get("/", { headers: { Accept: accept } });
    expect(response.status(), accept).toBe(200);
    expect(response.headers()["content-type"], accept).toMatch(
      markdown ? /^text\/markdown/ : /^text\/html/,
    );
    expect(response.headers()["vary"]).toContain("Accept");
  }
});

test("machine-readable files and XML feeds resolve on the deployed platform", async ({
  request,
}) => {
  const files = {
    "/llms.txt": "text/plain",
    "/llms-full.txt": "text/plain",
    "/robots.txt": "text/plain",
    "/index.md": "text/markdown",
    "/about.md": "text/markdown",
    "/contact.md": "text/markdown",
    "/privacy.md": "text/markdown",
    "/docs.md": "text/markdown",
  };
  for (const [path, type] of Object.entries(files)) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain(type);
    expect((await response.text()).length).toBeGreaterThan(0);
  }
  for (const path of ["/sitemap-index.xml", "/sitemap-0.xml", "/rss.xml"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text()).toContain("<?xml");
  }
});

test("signed OG images render as PNG and invalid signatures return JSON", async ({
  request,
  page,
}) => {
  await page.goto("/refinement-types/");
  const content = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(content).toBeTruthy();
  const imageURL = new URL(content!);
  const image = await request.get(imageURL.pathname + imageURL.search);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toMatch(/^image\/png/);
  const bytes = await image.body();
  expect(bytes.subarray(0, 8)).toEqual(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  imageURL.searchParams.set("token", "invalid");
  const denied = await request.get(imageURL.pathname + imageURL.search);
  expect(denied.status()).toBe(401);
  expect(denied.headers()["content-type"]).toMatch(/^application\/json/);
  expect((await denied.json()).error.code).toBe("INVALID_TOKEN");
});
