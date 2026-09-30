import type { APIRoute } from "astro";
import { authorBioMarkdown, whenToUse } from "../lib/agents/content";
import { SITE_BLURB, SITE_NAME } from "../lib/siteMeta";
import { publicPosts } from "../lib/agents/posts";

export const GET: APIRoute = () =>
  new Response(
    [
      `# ${SITE_NAME}`,
      SITE_BLURB,
      authorBioMarkdown,
      "Nice to have you here.",
      whenToUse.trim(),
      "## Developer resources\n\n- [Developer documentation](https://haspar.us/docs/)\n- [OpenAPI specification](https://haspar.us/openapi.json)\n- [Agent guide](https://haspar.us/llms.txt)\n- [About](https://haspar.us/about/)\n- [Contact](https://haspar.us/contact/)\n- [Privacy](https://haspar.us/privacy/)",
      "## Posts",
      publicPosts()
        .map((post) => `- [${post.title}](${post.url}) (${post.date})`)
        .join("\n"),
    ].join("\n\n") + "\n",
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
