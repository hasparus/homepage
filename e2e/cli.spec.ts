import { execFile } from "node:child_process";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";
import { run } from "../packages/cli/lib/run.mjs";

const execFileAsync = promisify(execFile);

const base = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4321";

function output() {
  let stdout = "",
    stderr = "";
  return {
    stdout: {
      write: (value: string) => {
        stdout += value;
      },
    },
    stderr: {
      write: (value: string) => {
        stderr += value;
      },
    },
    read: () => ({ stdout, stderr }),
  };
}

test("CLI reads real public endpoints and reports errors without mixing stdout and stderr", async () => {
  for (const args of [["profile"], ["posts"], ["read", "refinement-types"]]) {
    const streams = output();
    const code = await run(args, { baseUrl: base, ...streams });
    const { stdout, stderr } = streams.read();
    expect(code).toBe(0);
    expect(stderr).toBe("");
    if (args[0] === "read") expect(stdout).toMatch(/^# Refinement Types/);
    else expect(JSON.parse(stdout)).toBeDefined();
  }
  const streams = output();
  expect(await run(["read", "../private"], { baseUrl: base, ...streams })).toBe(
    1,
  );
  expect(streams.read().stdout).toBe("");
  expect(streams.read().stderr).toContain("Unknown public article");
});

for (const { name, baseUrl, markdownUrl, pathname } of [
  {
    name: "double-slash canonical path on production",
    baseUrl: "https://haspar.us",
    markdownUrl: "https://haspar.us//external.example/article.md",
    pathname: "//external.example/article.md",
  },
  {
    name: "double-slash canonical path rebased onto preview",
    baseUrl: `${base}/ignored?base=query#base-hash`,
    markdownUrl:
      "https://haspar.us//external.example/article.md?ignored=yes#hash",
    pathname: "//external.example/article.md",
  },
  {
    name: "ordinary canonical article rebased onto preview",
    baseUrl: `${base}/ignored?base=query#base-hash`,
    markdownUrl: "https://haspar.us/article.md?ignored=yes#hash",
    pathname: "/article.md",
  },
]) {
  test(`CLI keeps ${name} on the trusted origin`, async () => {
    const targets: URL[] = [];
    const streams = output();
    const code = await run(["read", "article"], {
      baseUrl,
      ...streams,
      fetchImpl: async (input: URL) => {
        const target = new URL(input);
        targets.push(target);
        if (targets.length === 1) {
          return Response.json({ posts: [{ slug: "article", markdownUrl }] });
        }
        return new Response("# Mock article\n");
      },
    });
    expect(code).toBe(0);
    expect(streams.read()).toEqual({ stdout: "# Mock article\n", stderr: "" });
    expect(targets).toHaveLength(2);
    for (const target of targets) {
      expect(target.origin).toBe(new URL(baseUrl).origin);
      expect(target.search).toBe("");
      expect(target.hash).toBe("");
    }
    expect(targets.map((target) => target.pathname)).toEqual([
      "/api/posts.json",
      pathname,
    ]);
  });
}

for (const markdownUrl of [
  "https://external.example/article.md",
  "https://haspar.us/article.html",
]) {
  test(`CLI rejects invalid index URL ${markdownUrl} without fetching the article`, async () => {
    const targets: string[] = [];
    const streams = output();
    const code = await run(["read", "article"], {
      baseUrl: base,
      ...streams,
      fetchImpl: async (input: URL) => {
        targets.push(input.href);
        return Response.json({ posts: [{ slug: "article", markdownUrl }] });
      },
    });
    expect(code).toBe(1);
    expect(streams.read()).toEqual({
      stdout: "",
      stderr: "Invalid article URL in public index.\n",
    });
    expect(targets).toEqual([`${base}/api/posts.json`]);
  });
}

test("CLI help and invalid syntax retain exit statuses without fetching", async () => {
  for (const args of [
    [],
    ["--help"],
    ["help"],
    ["unknown"],
    ["read"],
    ["posts", "extra"],
    ["read", "article", "extra"],
  ]) {
    const streams = output();
    const help = !args.length || args[0] === "--help" || args[0] === "help";
    const code = await run(args, {
      ...streams,
      fetchImpl: async () => {
        throw new Error("Unexpected fetch");
      },
    });
    expect(code).toBe(help ? 0 : 2);
    if (help) {
      expect(streams.read().stdout).toContain(
        "Usage: hasparus profile | posts | read <slug>",
      );
      expect(streams.read().stderr).toBe("");
    } else {
      expect(streams.read()).toEqual({
        stdout: "",
        stderr: "Invalid command. Use hasparus --help.\n",
      });
    }
  }
});

test("installed CLI symlinks execute help and preserve invalid-command status", async () => {
  const directory = await mkdtemp(join(tmpdir(), "hasparus-cli-bin-"));
  const executable = join(directory, "hasparus");
  try {
    await symlink(
      fileURLToPath(
        new URL("../packages/cli/bin/hasparus.mjs", import.meta.url),
      ),
      executable,
    );
    const help = await execFileAsync(executable, ["--help"]);
    expect(help.stdout).toContain(
      "Usage: hasparus profile | posts | read <slug>",
    );
    expect(help.stderr).toBe("");
    await expect(
      execFileAsync(executable, ["invalid-command"]),
    ).rejects.toMatchObject({
      code: 2,
      stdout: "",
      stderr: "Invalid command. Use hasparus --help.\n",
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("CLI HTTP errors retain status, hints, and stderr-only output", async () => {
  const streams = output();
  const code = await run(["posts"], {
    ...streams,
    fetchImpl: async () =>
      Response.json(
        { error: { message: "Mock unavailable", hint: "Try again" } },
        { status: 503 },
      ),
  });
  expect(code).toBe(1);
  expect(streams.read()).toEqual({
    stdout: "",
    stderr: "HTTP 503: Mock unavailable Try again\n",
  });
});
