import type { APIRoute } from "astro";

import { whenToUse } from "../lib/agents/content";
import { publicPosts } from "../lib/agents/posts";
import { SITE_BLURB, SITE_NAME } from "../lib/siteMeta";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("`site` must be set in astro.config for llms.txt");
  }

  const posts = publicPosts();

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_BLURB}`,
    "",
    whenToUse.trim(),
    "",
    "## Developer resources",
    "",
    "- [hasparus developer documentation](https://haspar.us/docs/): Read-only REST API, Markdown access, MCP tools, and CLI usage.",
    "- [OpenAPI specification](https://haspar.us/openapi.json): Read-only content API. You don't need authentication.",
    "- [MCP endpoint](https://haspar.us/mcp): Streamable HTTP; initialize with POST, then use list_posts or read_post.",
    "- [Author profile](https://haspar.us/api/profile.json): Published identity and contact-page URL.",
    "- [Article index](https://haspar.us/api/posts.json): Public articles with HTML and Markdown links.",
    "- [Homepage Markdown](https://haspar.us/index.md): Explicit Markdown export of the homepage.",
    "- [CLI source](https://github.com/hasparus/homepage/tree/main/packages/cli): Script public content reads from a checkout; npm publication is pending.",
    "",
    "## About this site",
    "",
    "- [About](https://haspar.us/about/): Author and site background.",
    "- [Contact](https://haspar.us/contact/): Published contact channels.",
    "- [Privacy](https://haspar.us/privacy/): Hosting, analytics, and contact information.",
    "",
    "## Posts",
    "",
  ];

  for (const { title, url, description } of posts) {
    const suffix = description ? `: ${description}` : "";
    lines.push(`- [${title}](${url})${suffix}`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
