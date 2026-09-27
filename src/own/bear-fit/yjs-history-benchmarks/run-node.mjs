import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { cpus } from "node:os";

import { decodeHistoryUpdates } from "../decodeHistoryUpdates.ts";
import { list, numbers, option } from "./args.mjs";
import { fixture, width } from "./fixtures.mjs";
import { measure, verify, workloads } from "./measure.mjs";
import { strategies } from "./strategies.mjs";

const sizes = numbers("sizes", "250,1000,10000");
const repeats = Number(option("repeats", "9"));
const steps = Number(option("steps", "24"));
const users = Number(option("users", "4"));
const days = Number(option("days", "21"));
const names = list("strategies", Object.keys(strategies).join(","));

const shape = { users, days };
const fixtures = sizes.flatMap((size) => [
  { name: `sequential-${size}`, updates: fixture(size, shape) },
  {
    name: `concurrent-reordered-${size}`,
    updates: fixture(size, { ...shape, concurrent: true }),
  },
]);
const history = option("history", "");
if (history)
  fixtures.unshift({
    name: "local-demo",
    updates: decodeHistoryUpdates(new Uint8Array(readFileSync(history))),
  });

/** Node-only: the browser bundle has no process.memoryUsage. */
function measureHeap(updates, name, collect) {
  collect();
  const before = process.memoryUsage().heapUsed;
  const preview = strategies[name](updates);
  preview.seek(updates.length);
  collect();
  const retainedBytes = process.memoryUsage().heapUsed - before;
  preview.destroy?.();
  return retainedBytes;
}

const report = {
  environment: {
    date: new Date().toISOString(),
    commit: execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    cpu: cpus()[0]?.model,
    yjs: JSON.parse(
      readFileSync(createRequire(import.meta.url).resolve("yjs/package.json")),
    ).version,
    repeats,
    steps,
    users,
    days,
    gcExposed: !!global.gc,
    heapNote:
      "Forced-GC deltas are noisy and can go negative; not a memory comparison.",
  },
  fixtures: [],
};

let rotation = 0;
for (const input of fixtures) {
  console.log(`\n${input.name}: ${input.updates.length} records`);
  const result = {
    name: input.name,
    records: input.updates.length,
    updateBytes: input.updates.reduce(
      (sum, update) => sum + update.value.byteLength,
      0,
    ),
    width: width(input.updates),
    validation: {},
    heap: {},
    measurements: [],
  };
  console.log(
    `width: ${result.width.availabilityKeys} availability keys, ${result.width.nameKeys} names`,
  );
  for (const name of names) {
    const validation = verify(input.updates, name);
    result.validation[name] = validation;
    if (!validation.passed) {
      console.log(`${name}: REJECTED ${JSON.stringify(validation)}`);
      continue;
    }
    console.log(`${name}: verified ${validation.positions} seek positions`);
    if (global.gc) {
      const samples = Array.from({ length: 3 }, () =>
        measureHeap(input.updates, name, global.gc),
      ).sort((a, b) => a - b);
      result.heap[name] = { medianRetainedBytes: samples[1], samples };
    }
  }
  for (const [workload, targets] of Object.entries(
    workloads(input.updates.length, steps),
  )) {
    const offset = rotation++ % names.length;
    for (const name of [...names.slice(offset), ...names.slice(0, offset)]) {
      if (!result.validation[name]?.passed) continue;
      const measurement = {
        workload,
        ...measure(input.updates, name, targets, repeats),
      };
      result.measurements.push(measurement);
      const p95 = measurement.warmSeek.p95Ms;
      console.log(
        `${workload.padEnd(11)} ${name.padEnd(16)} setup=${measurement.setup.medianMs.toFixed(3)}ms first=${measurement.firstSeek.medianMs.toFixed(3)}ms seek p50=${measurement.warmSeek.medianMs.toFixed(3)}ms p95=${p95 === null ? "n/a" : p95.toFixed(3) + "ms"} total=${measurement.total.medianMs.toFixed(2)}ms`,
      );
    }
  }
  report.fixtures.push(result);
  writeFileSync(
    option("out", "src/own/bear-fit/yjs-history-benchmarks/results-node.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
}
