import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { createHistoryPersistenceCheck } from "../../src/own/bear-fit/historyPersistence.ts";
import { replayHistory } from "../../src/own/bear-fit/replayHistory.ts";
import { calendar, fixture } from "./benchmark.mjs";

function option(name, fallback) {
  return process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
}
const sizes = option("sizes", "250,1000,10000").split(",").map(Number);
const repeats = Number(option("repeats", "9"));
const warmups = 2;
const copy = (updates) => updates.map(({ clock, value }) => ({ clock, value: value.slice() }));
function fingerprint(doc) {
  const state = calendar(doc);
  return JSON.stringify([state.availability, state.names, state.event].map((map) =>
    Object.entries(map).sort(([a], [b]) => a.localeCompare(b))));
}
function originalCheck(updates, live) {
  const checked = replayHistory(updates, updates.length);
  try { return fingerprint(checked) === fingerprint(live); }
  finally { checked.destroy(); }
}
function summarize(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  return { medianMs: sorted[Math.floor(sorted.length / 2)], minMs: sorted[0], maxMs: sorted.at(-1), samplesMs: samples };
}
const report = {
  environment: {
    date: new Date().toISOString(),
    commit: execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim(),
    node: process.version, platform: process.platform, arch: process.arch, cpu: cpus()[0]?.model,
    yjs: JSON.parse(readFileSync(new URL("../../node_modules/yjs/package.json", import.meta.url))).version,
    repeats, warmups, gcExposed: !!global.gc,
  },
  scope: "JavaScript validation only: original full replay versus the actual widget check. Includes byte comparison, live-calendar fingerprinting, and owned record copies on misses. Excludes fetch, decode, model transitions, rendering, and fixture/response-copy preparation. Each response has freshly allocated records. Priming is outside identical/changed-response timing and represented by firstResponse. Synthetic logs, not observed production retry frequency or browser measurements.",
  fixtures: [],
};
for (const count of sizes) for (const concurrent of [false, true]) {
  const updates = fixture(count, concurrent);
  const live = replayHistory(updates, updates.length);
  const previous = updates.slice(0, -1);
  const samples = { original: [], firstResponse: [], identicalResponse: [], changedResponse: [] };
  const unchanged = createHistoryPersistenceCheck();
  assert.equal(unchanged(copy(updates), live), true);
  try {
    const names = Object.keys(samples);
    for (let iteration = -warmups; iteration < repeats; iteration++) {
      const offset = (iteration + warmups) % names.length;
      for (const name of [...names.slice(offset), ...names.slice(0, offset)]) {
        const response = copy(updates);
        let check;
        if (name === "original") check = originalCheck;
        else if (name === "identicalResponse") check = unchanged;
        else {
          check = createHistoryPersistenceCheck();
          if (name === "changedResponse") check(copy(previous), live);
        }
        global.gc?.();
        const start = performance.now();
        const persisted = check(response, live);
        const elapsed = performance.now() - start;
        assert.equal(persisted, true, `${name}: differs from full replay`);
        if (iteration >= 0) samples[name].push(elapsed);
      }
    }
    const result = {
      name: `${concurrent ? "concurrent-reordered" : "sequential"}-${count}`,
      records: updates.length,
      cachedUpdateBytes: updates.reduce((sum, update) => sum + update.value.byteLength, 0),
      measurements: Object.fromEntries(Object.entries(samples).map(([name, values]) => [name, summarize(values)])),
    };
    report.fixtures.push(result);
    console.log(result.name, Object.fromEntries(Object.entries(result.measurements).map(([name, stats]) => [name, `${stats.medianMs.toFixed(3)} ms`])));
  } finally { live.destroy(); }
}
writeFileSync(option("out", "src/own/bear-fit/yjs-history-benchmarks/results-validation-node.json"), JSON.stringify(report, null, 2) + "\n");
