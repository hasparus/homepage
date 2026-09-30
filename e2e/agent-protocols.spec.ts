import { expect, test } from "@playwright/test";
import SwaggerParser from "@apidevtools/swagger-parser";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { run } from "../packages/cli/bin/hasparus.mjs";
import { fetchRemoteImage } from "../src/lib/prose/fetchRemoteImage";
import { prefersMarkdown } from "../src/lib/agents/http";

const base = "http://localhost:4321";
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
      expect((await request.get(new URL(url).pathname)).status(), url).toBe(
        200,
      );
    }
  }
});

test("MCP initializes, lists and reads all resources, and calls both tools through the official client", async () => {
  const client = new Client({ name: "hasparus-tests", version: "1.0.0" });
  await client.connect(
    new StreamableHTTPClientTransport(new URL(`${base}/mcp`)),
  );
  try {
    expect(client.getServerCapabilities()?.resources).toBeDefined();
    const { resources } = await client.listResources();
    expect(resources.length).toBeGreaterThan(0);
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

test("agent guide, API catalog, docs, trust pages, and metadata are discoverable", async ({
  request,
  page,
}) => {
  const guide = await (await request.get("/llms.txt")).text();
  expect(guide).toContain("## When to use this site");
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
    expect(
      (await page.getByRole("main").innerText()).length,
    ).toBeGreaterThanOrEqual(500);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.goto("/");
  await expect(
    page.getByText("a software sculptor, clanker cowboy", { exact: false }),
  ).toContainText(
    "building zagrajmy.net. hobbyist designer of games for nerds.",
  );
  await expect(
    page.getByRole("link", { name: "zagrajmy.net", exact: true }),
  ).toHaveAttribute("href", "https://zagrajmy.net");
  const markdownBio = await (await request.get("/index.md")).text();
  expect(markdownBio).toContain(
    "building [zagrajmy.net](https://zagrajmy.net). hobbyist designer of games for nerds.",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "an online abode of Piotr Monwid-Olechnowicz",
  );
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
  expect(person.description).toBe(
    "a software sculptor, clanker cowboy, interested in human computer interaction, and tooling that push us into the pit of success. building zagrajmy.net. hobbyist designer of games for nerds.",
  );
  expect(person.sameAs).toContain("https://github.com/hasparus");
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

test("media negotiation ignores disabled and malformed quality values", () => {
  expect(prefersMarkdown("text/markdown;q=1,text/html;q=0.5")).toBe(true);
  expect(prefersMarkdown("text/markdown;q=0")).toBe(false);
  expect(prefersMarkdown("text/markdown;q=wrong")).toBe(false);
  expect(prefersMarkdown("text/markdown;q=2")).toBe(false);
  expect(prefersMarkdown("TEXT/MARKDOWN")).toBe(true);
});

test("remote image failures don't prevent the site from building", async ({
  page,
}) => {
  expect(
    await fetchRemoteImage(
      "https://example.test/image.png",
      async () => new Response("image"),
    ),
  ).toEqual(Buffer.from("image"));
  expect(
    await fetchRemoteImage(
      "https://example.test/image.png",
      async () => new Response("offline", { status: 503 }),
    ),
  ).toBeUndefined();
  expect(
    await fetchRemoteImage("https://example.test/image.png", async () => {
      throw new Error("offline");
    }),
  ).toBeUndefined();
  await page.goto("/tiny-alternative-to-storybook/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Tiny Alternative to Storybook",
  );
  await expect(
    page.getByRole("img", { name: "Scrolling through UI examples page" }),
  ).toHaveAttribute(
    "src",
    "https://i.gyazo.com/a5750ce4db513d66d5ba483faa0b5437.gif",
  );
});

test("CLI reads real public endpoints and reports errors without mixing stdout and stderr", async () => {
  for (const args of [["profile"], ["posts"], ["read", "refinement-types"]]) {
    let stdout = "",
      stderr = "";
    const code = await run(args, {
      baseUrl: base,
      stdout: {
        write: (value: string) => {
          stdout += value;
        },
      },
      stderr: {
        write: (value: string) => {
          stderr += value;
        },
      },
    });
    expect(code).toBe(0);
    expect(stderr).toBe("");
    if (args[0] === "read") expect(stdout).toMatch(/^# Refinement Types/);
    else expect(JSON.parse(stdout)).toBeDefined();
  }
  let error = "";
  expect(
    await run(["read", "../private"], {
      baseUrl: base,
      stdout: {
        write: () => {
          throw new Error("unexpected stdout");
        },
      },
      stderr: {
        write: (text: string) => {
          error += text;
        },
      },
    }),
  ).toBe(1);
  expect(error).toContain("Unknown public article");
});
