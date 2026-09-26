import * as Y from "yjs";

import {
  cacheBase,
  calendar,
  canonical,
  rng,
  windowStart,
} from "./fixtures.mjs";
import { strategies } from "./strategies.mjs";

/** p95 needs more samples than a handful to mean anything. */
const P95_MINIMUM_SAMPLES = 20;

export function workloads(length, steps = 32) {
  const start = windowStart(length);
  const nearEnd = Math.max(start, length - steps + 1);
  const random = rng(0x12_34);
  return {
    forward: Array.from({ length: steps }, (_, index) =>
      Math.min(length, nearEnd + index),
    ),
    backward: Array.from({ length: steps }, (_, index) =>
      Math.max(start, length - index),
    ),
    alternating: Array.from(
      { length: steps },
      (_, index) => length - (index % 2),
    ),
    random: Array.from(
      { length: steps },
      () => start + Math.floor(random() * (length - start + 1)),
    ),
  };
}

export function expectedStates(updates) {
  const start = cacheBase(updates.length);
  const expected = new Map();
  const doc = new Y.Doc();
  if (start === 0) expected.set(0, canonical(calendar(doc)));
  try {
    for (const [index, update] of updates.entries()) {
      Y.applyUpdate(doc, update.value);
      if (index + 1 >= start) expected.set(index + 1, canonical(calendar(doc)));
    }
  } finally {
    doc.destroy();
  }
  return expected;
}

/**
 * Short histories are checked at every reachable position, forwards and back,
 * plus random seeks. Long ones would take too long, so they get the base
 * position and the seeks the timed workloads use.
 */
export function verificationTargets(updates, reachable) {
  const base = cacheBase(updates.length);
  if (updates.length > 1000)
    return [base, ...Object.values(workloads(updates.length, 16)).flat()];
  const random = rng(0xf0_0d);
  return [
    ...reachable,
    ...reachable.toReversed(),
    ...Array.from(
      { length: 128 },
      () => base + Math.floor(random() * (updates.length - base + 1)),
    ),
  ];
}

function noop() {
  // stateless strategies have nothing to release
}

const build = (strategy, updates) => {
  const preview = (
    typeof strategy === "function" ? strategy : strategies[strategy]
  )(updates);
  return { destroy: noop, ...preview };
};

export function verify(updates, strategy) {
  const expected = expectedStates(updates);
  const targets = verificationTargets(updates, [...expected.keys()]);
  const preview = build(strategy, updates);
  try {
    for (const count of targets) {
      const actual = canonical(preview.seek(count));
      if (actual !== expected.get(count))
        return { passed: false, count, expected: expected.get(count), actual };
    }
    return { passed: true, positions: targets.length };
  } catch (error) {
    return { passed: false, error: String(error) };
  } finally {
    preview.destroy();
  }
}

function quantile(values, fraction) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[
    Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))
  ];
}

/** p95 is null rather than a relabelled maximum when samples are too few. */
function stats(values) {
  return {
    medianMs: quantile(values, 0.5),
    p95Ms: values.length >= P95_MINIMUM_SAMPLES ? quantile(values, 0.95) : null,
    maxMs: Math.max(...values),
    samples: values.length,
  };
}

export function measure(updates, strategy, targets, repeats = 9) {
  const warm = build(strategy, updates);
  for (const count of targets.slice(0, 8)) warm.seek(count);
  warm.destroy();
  const setup = [],
    first = [],
    warmSeeks = [],
    totals = [],
    teardown = [];
  let cacheBytes = null;
  let checksum = 0;
  for (let repeat = 0; repeat < repeats; repeat++) {
    const start = performance.now();
    const preview = build(strategy, updates);
    setup.push(performance.now() - start);
    for (const [index, count] of targets.entries()) {
      const before = performance.now();
      const snapshot = preview.seek(count);
      const elapsed = performance.now() - before;
      (index === 0 ? first : warmSeeks).push(elapsed);
      checksum += Object.keys(snapshot.availability).length;
    }
    totals.push(performance.now() - start);
    cacheBytes = preview.serializedCacheBytes ?? null;
    const before = performance.now();
    preview.destroy();
    teardown.push(performance.now() - before);
  }
  return {
    strategy: typeof strategy === "function" ? strategy.name : strategy,
    setup: stats(setup),
    firstSeek: stats(first),
    warmSeek: stats(warmSeeks),
    total: stats(totals),
    teardown: stats(teardown),
    serializedCacheBytes: cacheBytes,
    checksum,
  };
}
