import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
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
    const hosts = ["haspar.us", "www.haspar.us", "hasparus.vercel.app", "main--hasparus.vercel.app", "attacker.example", "localhost:4321"];
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
  expect(JSON.parse(result)).toEqual([405, 405, 405, 405, 403, 403]);
});

test("published descriptions do not claim a quota or operational limits", async ({
  request,
}) => {
  const spec = await (await request.get("/openapi.json")).json();
  expect(spec.info.description).not.toMatch(/quota|429|service-level/i);
  const { handleMcp } = await import("../src/lib/agents/mcp");
  const response = await handleMcp(
    new Request("http://localhost:4321/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "resources/list" }),
    }),
  );
  expect(response.status).toBe(200);
  expect(JSON.stringify(await response.json())).not.toContain(
    "operational limits",
  );
});

test("CI verifies successful deployments before recording production success", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/ci.yml", import.meta.url),
    "utf8",
  );
  const verification = workflow.slice(
    workflow.indexOf("- name: Verify deployed agent endpoints"),
    workflow.indexOf("- name: Upload Playwright report"),
  );
  expect(verification).toContain(
    "steps.deploy-production.outcome == 'success'",
  );
  expect(verification).toContain("steps.deploy-preview.outcome == 'success'");
  expect(verification).toContain(
    "pnpm verify:agents https://${{ env.DEPLOYMENT_ALIAS }}",
  );
  expect(verification).toContain(
    "pnpm verify:agents https://${{ env.PRODUCTION_HOSTNAME }}",
  );
  expect(
    workflow.indexOf("- name: Verify advertised production hostname"),
  ).toBeLessThan(
    workflow.indexOf("- name: Create GitHub Production Deployment"),
  );
});
