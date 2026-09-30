import type { APIRoute } from "astro";
import { profile, whenToUse } from "../lib/agents/content";
import { publicPosts } from "../lib/agents/posts";

export const GET: APIRoute = () =>
  new Response(
    [
      `# hasparus`,
      `an online abode of ${profile.name}`,
      profile.description,
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
