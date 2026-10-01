import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

type PublicPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  url: string;
};

test("publication dates preserve the calendar day in a positive-offset timezone", () => {
  const formatter = new URL("../src/lib/formatDate.tsx", import.meta.url).href;
  const fixture = new URL("../posts/2022-and-change.mdx", import.meta.url).href;
  const output = execFileSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "--input-type=module",
      "--eval",
      `
        import { readFileSync } from "node:fs";
        import { formatDate } from ${JSON.stringify(formatter)};
        const source = readFileSync(new URL(${JSON.stringify(fixture)}), "utf8");
        const date = source.match(/^date: (.+)$/m)?.[1];
        if (!date) throw new Error("The public article must have a publication date");
        const parsed = new Date(date);
        console.log(JSON.stringify({
          calendarDate: formatDate(date),
          utcDate: parsed.toISOString().slice(0, 10),
          offset: parsed.getTimezoneOffset(),
        }));
      `,
    ],
    {
      cwd: fileURLToPath(new URL("../", import.meta.url)),
      env: { ...process.env, TZ: "Europe/Warsaw" },
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  const result = JSON.parse(output);
  expect(result.offset).toBeLessThan(0);
  expect(result.utcDate).toBe("2022-09-30");
  expect(result.calendarDate).toBe("2022-10-01");
});

test("API publication dates equal the rendered dates for every public article", async ({
  request,
  page,
}) => {
  const response = await request.get("/api/posts.json");
  expect(response.status()).toBe(200);
  const { posts }: { posts: PublicPost[] } = await response.json();
  expect(posts.length).toBeGreaterThan(0);
  for (const post of posts) {
    await test.step(post.slug, async () => {
      const article = await page.goto(new URL(post.url).pathname);
      expect(article?.status()).toBe(200);
      await expect(page.getByRole("main").locator("header time")).toHaveText(
        post.date,
      );
    });
  }
  expect(posts.find((post) => post.slug === "2022-and-change")?.date).toBe(
    "2022-10-01",
  );
});

test("llms.txt uses the API's ordered public catalog and canonical links", async ({
  request,
}) => {
  const response = await request.get("/api/posts.json");
  expect(response.status()).toBe(200);
  const { posts }: { posts: PublicPost[] } = await response.json();
  expect(posts.length).toBeGreaterThan(0);
  const guide = await request.get("/llms.txt");
  expect(guide.status()).toBe(200);
  expect(guide.headers()["content-type"]).toMatch(/^text\/plain(?:;|$)/);
  const body = await guide.text();
  const entries = posts.map(({ title, url, description }) => {
    expect(new URL(url).origin).toBe("https://haspar.us");
    expect(description).toBe(description.trim());
    return `- [${title}](${url})${description ? `: ${description}` : ""}`;
  });
  expect(body.split("## Posts\n\n")[1]).toBe(entries.join("\n") + "\n");
});
