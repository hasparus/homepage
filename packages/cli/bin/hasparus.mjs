#!/usr/bin/env node
import { pathToFileURL } from "node:url";

export async function run(
  args,
  {
    baseUrl = "https://haspar.us",
    fetchImpl = fetch,
    stdout = process.stdout,
    stderr = process.stderr,
  } = {},
) {
  const [command, slug, ...extra] = args;
  if (command === "--help" || command === "help" || !command) {
    stdout.write(
      "Usage: hasparus profile | posts | read <slug>\nRead-only public content; no credentials required.\n",
    );
    return 0;
  }
  if (
    !["profile", "posts", "read"].includes(command) ||
    extra.length ||
    (command === "read" ? !slug : !!slug)
  ) {
    stderr.write("Invalid command. Use hasparus --help.\n");
    return 2;
  }
  try {
    const get = async (path) => {
      const url = new URL(baseUrl);
      url.pathname = path;
      url.search = "";
      url.hash = "";
      const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        let details;
        try {
          details = (await response.json()).error;
        } catch {}
        throw new Error(
          `HTTP ${response.status}: ${details?.message || "Public content unavailable."} ${details?.hint || "Retry later; see https://haspar.us/docs/."}`,
        );
      }
      return response;
    };
    if (command === "read") {
      const { posts } = await (await get("/api/posts.json")).json();
      const post = posts.find((entry) => entry.slug === slug);
      if (!post)
        throw new Error(
          "Unknown public article. Run hasparus posts and use an exact slug from the index.",
        );
      const path = new URL(post.markdownUrl);
      if (path.origin !== "https://haspar.us" || !path.pathname.endsWith(".md"))
        throw new Error("Invalid article URL in public index.");
      stdout.write(await (await get(path.pathname)).text());
    } else {
      stdout.write(
        JSON.stringify(
          await (await get(`/api/${command}.json`)).json(),
          null,
          2,
        ) + "\n",
      );
    }
    return 0;
  } catch (error) {
    stderr.write(`${error.message}\n`);
    return 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = await run(process.argv.slice(2));
}
