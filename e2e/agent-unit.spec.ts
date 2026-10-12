import { expect, test } from "@playwright/test";
import middleware from "../middleware";
import { parseSearchParams } from "../api/og";
import { prefersMarkdown } from "../src/lib/agents/http";
import { acceptCases } from "./accept-cases";

test("Markdown paths cannot turn into cross-origin requests", async () => {
  const originalFetch = globalThis.fetch;
  const targets: URL[] = [];
  globalThis.fetch = async (input) => {
    targets.push(new URL(String(input)));
    return new Response("# Same-site Markdown", {
      headers: { "Content-Type": "text/markdown" },
    });
  };
  try {
    for (const path of [
      "//outside.example/article",
      "/%2F%2Foutside.example/article",
    ]) {
      const response = await middleware(
        new Request(`https://haspar.us${path}?ignored=true`, {
          headers: { Accept: "text/markdown" },
        }),
      );
      expect(response.status).toBe(200);
    }
    expect(targets).toHaveLength(2);
    for (const target of targets) {
      expect(target.origin).toBe("https://haspar.us");
      expect(target.search).toBe("");
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("OG parameters preserve literal percent signs and encoded-looking titles", () => {
  for (const title of ["100% useful", "Literal %20 and %2F"]) {
    const source = `1700000000000\t3\t${title}\t`;
    const parsed = parseSearchParams(
      new URLSearchParams(
        new URLSearchParams({ post: source, token: "test-token" }).toString(),
      ),
    );
    expect(parsed.stringifiedPost).toBe(source);
    expect(parsed.post.title).toBe(title);
    expect(parsed.token).toBe("test-token");
  }
});

test("media negotiation uses whitespace, valid quality values, and wildcard specificity", () => {
  for (const { accept, markdown } of acceptCases)
    expect(prefersMarkdown(accept), accept).toBe(markdown);
});
