import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { openapi } from "../src/lib/agents/openapi";
import { postsSchema } from "../src/lib/agents/schemas";

const validPost = {
  slug: "article",
  title: "Article",
  description: "",
  date: "2022-10-01",
  url: "https://haspar.us/article/",
  markdownUrl: "https://haspar.us/article.md",
};

test("MCP and OpenAPI enforce the same public post boundary", () => {
  const ajv = new Ajv2020({ strict: false });
  addFormats(ajv);
  ajv.addSchema({
    $id: "https://haspar.us/wire",
    components: openapi.components,
  });
  const validate = ajv.compile({
    $ref: "https://haspar.us/wire#/components/schemas/PostIndex",
  });
  for (const [value, valid] of [
    [{ posts: [validPost] }, true],
    [{ posts: [{ ...validPost, date: "not a date" }] }, false],
    [{ posts: [{ ...validPost, date: "2022-02-30" }] }, false],
    [{ posts: [{ ...validPost, extra: "unexpected" }] }, false],
    [{ posts: [validPost], extra: "unexpected" }, false],
  ] as const) {
    expect(postsSchema.safeParse(value).success).toBe(valid);
    expect(validate(value)).toBe(valid);
  }
});

test("MCP accepts advertised production hosts without deployment environment variables", () => {
  const module = new URL("../src/lib/agents/mcp.ts", import.meta.url).href;
  const result = execFileSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "--input-type=module",
      "--eval",
      `
    import { handleMcp } from ${JSON.stringify(module)};
    for (const name of ["VERCEL_URL", "VERCEL_BRANCH_URL", "DEPLOYMENT_ALIAS"]) delete process.env[name];
    const hosts = ["hasparus.vercel.app", "attacker.example"];
    const statuses = [];
    for (const host of hosts) statuses.push((await handleMcp(new Request("https://" + host + "/mcp"))).status);
    console.log(JSON.stringify(statuses));
  `,
    ],
    {
      env: { ...process.env, NODE_ENV: "production" },
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  expect(JSON.parse(result)).toEqual([405, 403]);
});
