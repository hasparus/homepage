import { readFileSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { execFileSync } from "node:child_process";
import { decodeHistoryUpdates } from "../../src/own/bear-fit/decodeHistoryUpdates.ts";
import { fixture, strategies, verify, measure, measureHeap, workloads } from "./benchmark.mjs";

function option(name, fallback) {
  return process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
}
const sizes = option("sizes", "250,1000,10000").split(",").map(Number);
const repeats = Number(option("repeats", "3"));
const steps = Number(option("steps", "24"));
const names = option("strategies", Object.keys(strategies).join(",")).split(",");
const fixtures = sizes.flatMap((size) => [
  { name: `sequential-${size}`, updates: fixture(size) },
  { name: `concurrent-reordered-${size}`, updates: fixture(size, true) },
]);
const history = option("history", "");
if (history) fixtures.unshift({ name: "local-demo", updates: decodeHistoryUpdates(new Uint8Array(readFileSync(history))) });

const report = {
  environment: { date: new Date().toISOString(), commit: execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim(), node: process.version, platform: process.platform, arch: process.arch, cpu: cpus()[0]?.model, yjs: JSON.parse(readFileSync(new URL("../../node_modules/yjs/package.json", import.meta.url))).version, repeats, steps, gcExposed: !!global.gc },
  fixtures: [],
};
for (const input of fixtures) {
  console.log(`\n${input.name}: ${input.updates.length} records`);
  const result = { name: input.name, records: input.updates.length, updateBytes: input.updates.reduce((sum, update) => sum + update.value.byteLength, 0), validation: {}, heap: {}, measurements: [] };
  for (const name of names) {
    const validation = verify(input.updates, name);
    result.validation[name] = validation;
    if (!validation.passed) { console.log(`${name}: REJECTED ${JSON.stringify(validation)}`); continue; }
    console.log(`${name}: verified ${validation.positions} seek positions`);
    if (global.gc) {
      const samples = Array.from({ length: 3 }, () => measureHeap(input.updates, name, global.gc)).sort((a, b) => a - b);
      result.heap[name] = { medianRetainedBytes: samples[1], samples };
    }
  }
  for (const [workload, targets] of Object.entries(workloads(input.updates.length, steps))) {
    const rotated = names.slice(Object.keys(report.fixtures).length % names.length).concat(names.slice(0, Object.keys(report.fixtures).length % names.length));
    for (const name of rotated) {
      if (!result.validation[name]?.passed) continue;
      const measurement = { workload, ...measure(input.updates, name, targets, repeats) };
      result.measurements.push(measurement);
      console.log(`${workload.padEnd(11)} ${name.padEnd(16)} setup=${measurement.setup.medianMs.toFixed(3)}ms first=${measurement.firstSeek.medianMs.toFixed(3)}ms seek p50=${measurement.warmSeek.medianMs.toFixed(3)}ms p95=${measurement.warmSeek.p95Ms.toFixed(3)}ms total=${measurement.total.medianMs.toFixed(2)}ms`);
    }
  }
  report.fixtures.push(result);
  writeFileSync(option("out", "src/own/bear-fit/yjs-history-benchmarks/results-node.json"), JSON.stringify(report, null, 2) + "\n");
}
