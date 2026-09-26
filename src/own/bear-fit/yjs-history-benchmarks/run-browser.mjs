import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

import { flag, numbers, option } from "./args.mjs";

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

const names = option("strategies", "")
  ? option("strategies", "").split(",")
  : null;
const sizes = numbers("sizes", "250,1000,10000");
const repeats = Number(option("repeats", "9"));
const steps = Number(option("steps", "24"));
const users = Number(option("users", "4"));
const days = Number(option("days", "21"));
const rate = Number(option("rate", "4"));

const fixtures = sizes.map((size) => [size, false]);
if (!flag("sequential-only")) fixtures.push([sizes.at(-1), true]);

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
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
  const moduleUrl = `${base}/@fs${resolve("src/own/bear-fit/yjs-history-benchmarks/.generated/benchmark.js")}`;
  const report = {
    environment: {
      date: new Date().toISOString(),
      commit: execFileSync("git", ["rev-parse", "--short", "HEAD"], {
        encoding: "utf8",
      }).trim(),
      chromium: browser.version(),
      cpuThrottlingRate: rate,
      timing:
        "JavaScript replay and snapshot extraction only; no DOM rendering, network or paint",
      timerNote:
        "performance.now() is clamped to 100us without cross-origin isolation, so sub-0.1ms seeks read as 0.",
      repeats,
      steps,
      users,
      days,
    },
    fixtures: [],
  };
  let rotation = 0;
  for (const [size, concurrent] of fixtures) {
    const result = await page.evaluate(
      async ({
        moduleUrl,
        size,
        concurrent,
        names,
        repeats,
        steps,
        users,
        days,
        rotation,
      }) => {
        const { fixture, strategies, width, workloads, measure } = await import(
          moduleUrl
        );
        const updates = fixture(size, { concurrent, users, days });
        const order = names ?? Object.keys(strategies);
        const measurements = [];
        let turn = rotation;
        for (const [workload, targets] of Object.entries(
          workloads(updates.length, steps),
        )) {
          const offset = turn++ % order.length;
          for (const name of [
            ...order.slice(offset),
            ...order.slice(0, offset),
          ])
            measurements.push({
              workload,
              ...measure(updates, name, targets, repeats),
            });
        }
        return {
          name: `${concurrent ? "concurrent-reordered" : "sequential"}-${size}`,
          records: updates.length,
          width: width(updates),
          measurements,
          rotations: turn - rotation,
        };
      },
      {
        moduleUrl,
        size,
        concurrent,
        names,
        repeats,
        steps,
        users,
        days,
        rotation,
      },
    );
    rotation += result.rotations;
    delete result.rotations;
    report.fixtures.push(result);
    writeFileSync(
      option(
        "out",
        `src/own/bear-fit/yjs-history-benchmarks/results-browser-${rate}x.json`,
      ),
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(`${result.name}: ${result.width.availabilityKeys} keys`);
    for (const row of result.measurements.filter((row) =>
      ["forward", "backward"].includes(row.workload),
    ))
      console.log(
        `${row.workload.padEnd(9)} ${row.strategy.padEnd(16)} setup=${row.setup.medianMs.toFixed(1)}ms first=${row.firstSeek.medianMs.toFixed(1)}ms seek p50=${row.warmSeek.medianMs.toFixed(2)}ms total=${row.total.medianMs.toFixed(1)}ms`,
      );
  }
} finally {
  await browser.close();
}
