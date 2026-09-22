import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.resolve("tsx"));
const { build } = require("esbuild");
const generated = new URL(".generated/", import.meta.url);
mkdirSync(generated, { recursive: true });
await build({
  entryPoints: [new URL("benchmark.mjs", import.meta.url).pathname],
  outfile: new URL("benchmark.js", generated).pathname,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
});
const names = process.argv
  .find((arg) => arg.startsWith("--strategies="))
  ?.split("=")[1]
  ?.split(",");
const sizes = process.argv
  .find((arg) => arg.startsWith("--sizes="))
  ?.split("=")[1]
  ?.split(",")
  .map(Number) ?? [250, 1000, 10_000];
const fixtures = sizes.map((size) => [size, false]);
if (!process.argv.includes("--sequential-only"))
  fixtures.push([sizes.at(-1), true]);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const base = process.env.HISTORY_DEMO_URL
    ? new URL(process.env.HISTORY_DEMO_URL).origin
    : "http://localhost:4323";
  await page.route(`${base}/benchmark-runner`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>Yjs benchmark</title>",
    }),
  );
  await page.goto(`${base}/benchmark-runner`);
  const cdp = await page.context().newCDPSession(page);
  const rate = Number(
    process.argv.find((arg) => arg.startsWith("--rate="))?.split("=")[1] ?? 4,
  );
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
  const moduleUrl = `${base}/@fs${resolve("src/own/bear-fit/yjs-history-benchmarks/.generated/benchmark.js")}`;
  const report = {
    environment: {
      date: new Date().toISOString(),
      chromium: browser.version(),
      cpuThrottlingRate: rate,
      timing:
        "JavaScript replay and snapshot extraction only; no DOM rendering, network or paint",
      repeats: 3,
      steps: 24,
    },
    fixtures: [],
  };
  for (const [size, concurrent] of fixtures) {
    const result = await page.evaluate(
      async ({ moduleUrl, size, concurrent, names }) => {
        const { fixture, strategies, workloads, measure } = await import(
          moduleUrl
        );
        const updates = fixture(size, concurrent);
        const measurements = [];
        for (const [workload, targets] of Object.entries(
          workloads(updates.length, 24),
        )) {
          for (const name of names ?? Object.keys(strategies))
            measurements.push({
              workload,
              ...measure(updates, name, targets, 3),
            });
        }
        return {
          name: `${concurrent ? "concurrent-reordered" : "sequential"}-${size}`,
          records: updates.length,
          measurements,
        };
      },
      { moduleUrl, size, concurrent, names },
    );
    report.fixtures.push(result);
    const out =
      process.argv.find((arg) => arg.startsWith("--out="))?.slice(6) ??
      `src/own/bear-fit/yjs-history-benchmarks/results-browser-${rate}x.json`;
    writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
    console.log(result.name);
    for (const row of result.measurements.filter((row) =>
      ["forward", "backward"].includes(row.workload),
    ))
      console.log(
        `${row.workload.padEnd(9)} ${row.strategy.padEnd(16)} setup=${row.setup.medianMs.toFixed(1)}ms first=${row.firstSeek.medianMs.toFixed(1)}ms seek p50=${row.warmSeek.medianMs.toFixed(2)}ms p95=${row.warmSeek.p95Ms.toFixed(2)}ms total=${row.total.medianMs.toFixed(1)}ms`,
      );
  }
} finally {
  await browser.close();
}
