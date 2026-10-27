import { execFile } from "node:child_process";
import { createServer } from "node:http";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const project = fileURLToPath(new URL("../", import.meta.url));
const animation = "/content/tiny-alternative-to-storybook/ui-examples.gif";

test("the recovered animation is served intact with valid dimensions", async ({
  page,
  request,
}) => {
  await page.goto("/tiny-alternative-to-storybook/");
  const image = page.getByRole("img", {
    name: "Scrolling through UI examples page",
  });
  await expect(image).toHaveAttribute("src", animation);
  await expect(image).toHaveAttribute("width", "920");
  await expect(image).toHaveAttribute("height", "460");
  const response = await request.get(animation);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^image\/gif/);
  const bytes = await response.body();
  expect(bytes).toEqual(await readFile(join(project, "public", animation)));
  const metadata = await sharp(bytes, { animated: true }).metadata();
  expect(metadata.pages).toBe(69);
  expect(metadata.loop).toBe(0);
});

test("remote HTTP and decoding failures fail real Astro builds, including raw images", async () => {
  test.setTimeout(180_000);
  const root = await mkdtemp(join(tmpdir(), "hasparus-image-build-"));
  const valid = await readFile(join(project, "public/og.png"));
  let status = 200;
  let body = valid;
  let requests = 0;
  const server = createServer((_request, response) => {
    requests++;
    response.writeHead(status);
    response.end(body);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Missing fixture server port");
  try {
    await mkdir(join(root, "src/lib/prose"), { recursive: true });
    await mkdir(join(root, "src/pages"), { recursive: true });
    await symlink(
      join(project, "node_modules"),
      join(root, "node_modules"),
      "dir",
    );
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ type: "module" }),
    );
    for (const file of ["Image.astro", "Image.css", "fetchRemoteImage.ts"]) {
      await copyFile(
        join(project, "src/lib/prose", file),
        join(root, "src/lib/prose", file),
      );
    }
    for (const scenario of [
      { status: 200, body: valid, raw: false, failure: undefined },
      {
        status: 503,
        body: Buffer.from("offline"),
        raw: false,
        failure: "HTTP 503",
      },
      {
        status: 200,
        body: Buffer.from("<html>not an image</html>"),
        raw: false,
        failure: "unsupported image format",
      },
      {
        status: 503,
        body: Buffer.from("offline"),
        raw: true,
        failure: "HTTP 503",
      },
      {
        status: 200,
        body: Buffer.from("<html>not an image</html>"),
        raw: true,
        failure: "unsupported image format",
      },
    ]) {
      status = scenario.status;
      body = scenario.body;
      requests = 0;
      const src = `http://127.0.0.1:${address.port}/image${scenario.raw ? "?raw=1" : ""}`;
      await writeFile(
        join(root, "src/pages/index.astro"),
        `---\nimport Image from "../lib/prose/Image.astro";\n---\n<Image src=${JSON.stringify(src)} alt="fixture" />\n`,
      );
      const result = await execFileAsync("pnpm", ["exec", "astro", "build"], {
        cwd: root,
        env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
        timeout: 30_000,
      }).then(
        ({ stdout, stderr }) => ({ code: 0, output: stdout + stderr }),
        (
          error: Error & { code?: number; stdout?: string; stderr?: string },
        ) => ({
          code: error.code,
          output: (error.stdout || "") + (error.stderr || ""),
        }),
      );
      expect(requests, result.output).toBeGreaterThan(0);
      if (scenario.failure) {
        expect(result.code).toBe(1);
        expect(result.output).toContain(scenario.failure);
      } else expect(result.code, result.output).toBe(0);
    }
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await rm(root, { recursive: true, force: true });
  }
});
