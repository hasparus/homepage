import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

import { pageMarkdown, profile, whenToUse } from "./content.js";

import { postsSchema } from "./schemas.js";

function allowedHost(host: string): boolean {
  const configured = [
    "haspar.us",
    "www.haspar.us",
    "hasparus.vercel.app",
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.DEPLOYMENT_ALIAS,
  ];
  if (configured.includes(host)) return true;
  if (/^[a-z0-9-]+--hasparus\.vercel\.app$/.test(host)) return true;
  return (
    process.env.NODE_ENV !== "production" &&
    ["localhost:4321", "127.0.0.1:4321"].includes(host)
  );
}

export async function handleMcp(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (
    !allowedHost(url.host) ||
    (origin && origin !== url.origin && origin !== "https://haspar.us")
  ) {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32000, message: "Forbidden origin or host." },
      },
      { status: 403 },
    );
  }

  if (request.method !== "POST") {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32000,
          message:
            "Use POST. This stateless server has no GET stream or sessions to delete.",
        },
      },
      { status: 405, headers: { Allow: "POST" } },
    );
  }

  const server = new McpServer(
    { name: "hasparus", version: "1.0.0" },
    {
      instructions: whenToUse,
    },
  );
  const loadText = async (path: string) => {
    const response = await fetch(new URL(path, url.origin), {
      headers: { Accept: "text/html" },
    });
    if (!response.ok)
      throw new Error(
        `Couldn't load public content (HTTP ${response.status}). Try again later; see https://haspar.us/docs/.`,
      );
    return response.text();
  };
  const loadPosts = async () =>
    postsSchema.parse(JSON.parse(await loadText("/api/posts.json")));

  server.registerResource(
    "profile",
    "https://haspar.us/api/profile.json",
    {
      title: "hasparus author profile",
      description: "The author's published identity and contact-page URL.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(profile),
        },
      ],
    }),
  );
  server.registerResource(
    "homepage",
    "https://haspar.us/index.md",
    {
      title: "hasparus homepage",
      description: "Author introduction and links to published articles.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: await loadText("/index.md"),
        },
      ],
    }),
  );
  server.registerResource(
    "agent-guide",
    "https://haspar.us/llms.txt",
    {
      title: "hasparus agent guide",
      description:
        "When to use this site, developer interfaces, and article discovery.",
      mimeType: "text/plain",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: await loadText("/llms.txt"),
        },
      ],
    }),
  );
  server.registerResource(
    "developer-docs",
    "https://haspar.us/docs.md",
    {
      title: "hasparus developer documentation",
      description: "REST, Markdown, MCP, and CLI usage.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: pageMarkdown("docs"),
        },
      ],
    }),
  );

  const annotations = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  };
  server.registerTool(
    "list_posts",
    {
      title: "List hasparus articles",
      description:
        "List public articles, newest first. Includes links to the HTML and Markdown source.",
      inputSchema: {},
      outputSchema: postsSchema.shape,
      annotations,
    },
    async () => {
      const result = await loadPosts();
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
        structuredContent: result,
      };
    },
  );
  server.registerTool(
    "read_post",
    {
      title: "Read a hasparus article",
      description:
        "Read an article's Markdown/MDX source using a slug from list_posts. Cite its canonical URL. Use HTML to see interactive examples.",
      inputSchema: {
        slug: z
          .string()
          .min(1)
          .max(200)
          .describe(
            "Exact slug returned by list_posts, for example refinement-types.",
          ),
      },
      outputSchema: { url: z.string().url(), markdown: z.string() },
      annotations,
    },
    async ({ slug }) => {
      const index = await loadPosts();
      const post = index.posts.find((entry) => entry.slug === slug);
      if (!post)
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Couldn't find that article. Call list_posts and use a slug from the index.",
            },
          ],
        };
      const result = {
        url: post.url,
        markdown: await loadText(new URL(post.markdownUrl).pathname),
      };
      return {
        content: [{ type: "text", text: result.markdown }],
        structuredContent: result,
      };
    },
  );

  const transport = new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
    maxRequestBodySize: 64 * 1024,
  });
  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    await server.close();
  }
}
