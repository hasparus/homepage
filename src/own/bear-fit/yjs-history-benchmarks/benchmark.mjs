import * as Y from "yjs";
import { replayHistory } from "../../src/own/bear-fit/replayHistory.ts";
import { cacheCalendarHistory } from "../../src/code-blocks/y-travelling/cacheCalendarHistory.ts";

export const WINDOW = 250;
const MAPS = ["availability", "names", "event"];
const USERS = ["barney", "slithey", "ruf", "ottar"];

export function calendar(doc) {
  return {
    availability: Object.fromEntries(doc.getMap("availability")),
    names: Object.fromEntries(doc.getMap("names")),
    event: Object.fromEntries(doc.getMap("event")),
  };
}

function canonical(value) {
  return JSON.stringify(MAPS.map((name) => Object.entries(value[name]).sort(([a], [b]) => a.localeCompare(b))));
}

function rng(seed) {
  let state = seed | 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

export function fixture(count, concurrent = false) {
  const random = rng(0x5eed);
  const base = new Y.Doc();
  base.clientID = 100;
  base.transact(() => {
    for (const name of USERS) base.getMap("names").set(`blog-reader-${name}`, name);
    for (const [key, value] of Object.entries({ id: "benchmark", name: "shooting a viking movie", startDate: "2077-09-06", endDate: "2077-09-26" })) base.getMap("event").set(key, value);
  });
  const initial = Y.encodeStateAsUpdate(base);
  const clients = Array.from({ length: concurrent ? 4 : 1 }, (_, index) => {
    const doc = new Y.Doc();
    doc.clientID = index + 1;
    Y.applyUpdate(doc, initial);
    return doc;
  });
  const values = [initial];
  for (const doc of clients) doc.on("update", (update) => values.push(update));
  while (values.length < count) {
    const doc = clients[Math.floor(random() * clients.length)];
    const user = USERS[Math.floor(random() * USERS.length)];
    const day = 6 + Math.floor(random() * 21);
    const key = `blog-reader-${user}〷2077-09-${String(day).padStart(2, "0")}`;
    const map = doc.getMap("availability");
    if (map.has(key)) map.delete(key);
    else map.set(key, true);
  }
  if (concurrent) {
    for (let start = 1; start < values.length; start += 13) {
      const end = Math.min(start + 13, values.length);
      for (let index = end - 1; index > start; index--) {
        const target = start + Math.floor(random() * (index - start + 1));
        [values[index], values[target]] = [values[target], values[index]];
      }
    }
    values.splice(Math.floor(values.length / 2), 0, values[1]);
  }
  for (const doc of clients) doc.destroy();
  base.destroy();
  return values.map((value, index) => ({ clock: String(index + 1), value }));
}

function applyRange(doc, updates, from, to) {
  doc.transact(() => {
    for (let index = from; index < to; index++) Y.applyUpdate(doc, updates[index].value);
  });
}

function readAndDestroy(doc) {
  try { return calendar(doc); }
  finally { doc.destroy(); }
}

export const strategies = {
  fresh(updates) {
    return {
      seek: (count) => readAndDestroy(replayHistory(updates, count)),
      destroy() {},
    };
  },
  "fresh-batched"(updates) {
    return {
      seek(count) {
        const doc = new Y.Doc();
        try { applyRange(doc, updates, 0, count); return calendar(doc); }
        finally { doc.destroy(); }
      },
      destroy() {},
    };
  },
  incremental(updates) {
    let doc = new Y.Doc();
    let position = 0;
    return {
      seek(count) {
        if (count < position) { doc.destroy(); doc = new Y.Doc(); position = 0; }
        applyRange(doc, updates, position, count);
        position = count;
        return calendar(doc);
      },
      destroy() { doc.destroy(); },
    };
  },
  checkpoints(updates) {
    const start = Math.max(0, updates.length - WINDOW);
    const checkpoints = [];
    const build = new Y.Doc();
    applyRange(build, updates, 0, start);
    checkpoints.push({ count: start, value: Y.encodeStateAsUpdate(build) });
    for (let index = start; index < updates.length; index++) {
      Y.applyUpdate(build, updates[index].value);
      if ((index + 1 - start) % 32 === 0) checkpoints.push({ count: index + 1, value: Y.encodeStateAsUpdate(build) });
    }
    build.destroy();
    let doc = new Y.Doc();
    let position = 0;
    return {
      get serializedCacheBytes() { return checkpoints.reduce((sum, checkpoint) => sum + checkpoint.value.byteLength, 0); },
      seek(count) {
        const checkpoint = checkpoints.findLast((candidate) => candidate.count <= count);
        if (!checkpoint) throw new RangeError("Outside checkpoint window");
        if (count < position || position < checkpoint.count) {
          doc.destroy();
          doc = new Y.Doc();
          Y.applyUpdate(doc, checkpoint.value);
          position = checkpoint.count;
        }
        applyRange(doc, updates, position, count);
        position = count;
        return calendar(doc);
      },
      destroy() { doc.destroy(); },
    };
  },
  "calendar-cache"(updates) {
    const start = Math.max(0, updates.length - WINDOW);
    const snapshots = [];
    const doc = new Y.Doc();
    try {
      applyRange(doc, updates, 0, start);
      snapshots.push(calendar(doc));
      for (let index = start; index < updates.length; index++) {
        Y.applyUpdate(doc, updates[index].value);
        snapshots.push(calendar(doc));
      }
    } finally { doc.destroy(); }
    return {
      get serializedCacheBytes() { return new TextEncoder().encode(JSON.stringify(snapshots)).byteLength; },
      seek(count) {
        const snapshot = snapshots[count - start];
        if (!snapshot) throw new RangeError("Outside snapshot window");
        return snapshot;
      },
      destroy() {},
    };
  },
  "article-cache"(updates) {
    const versions = cacheCalendarHistory(updates);
    const start = updates.length - versions.length;
    return {
      get serializedCacheBytes() { return new TextEncoder().encode(JSON.stringify(versions)).byteLength; },
      seek(count) {
        if (count === start) return readAndDestroy(replayHistory(updates, count));
        const version = versions[count - start - 1];
        if (!version) throw new RangeError("Outside snapshot window");
        return version.snapshot;
      },
      destroy() {},
    };
  },
  "yjs-snapshots"(updates) {
    const start = Math.max(0, updates.length - WINDOW);
    const doc = new Y.Doc({ gc: false });
    const snapshots = [];
    applyRange(doc, updates, 0, start);
    snapshots.push(Y.snapshot(doc));
    for (let index = start; index < updates.length; index++) {
      Y.applyUpdate(doc, updates[index].value);
      snapshots.push(Y.snapshot(doc));
    }
    return {
      get serializedCacheBytes() { return Y.encodeStateAsUpdate(doc).byteLength + snapshots.reduce((sum, snapshot) => sum + Y.encodeSnapshot(snapshot).byteLength, 0); },
      seek(count) {
        const snapshot = snapshots[count - start];
        if (!snapshot) throw new RangeError("Outside snapshot window");
        return readAndDestroy(Y.createDocFromSnapshot(doc, snapshot));
      },
      destroy() { doc.destroy(); },
    };
  },
};

export function workloads(length, steps = 32) {
  const start = Math.max(1, length - WINDOW + 1);
  const nearEnd = Math.max(start, length - steps + 1);
  const random = rng(0x1234);
  return {
    forward: Array.from({ length: steps }, (_, index) => Math.min(length, nearEnd + index)),
    backward: Array.from({ length: steps }, (_, index) => Math.max(start, length - index)),
    alternating: Array.from({ length: steps }, (_, index) => length - index % 2),
    random: Array.from({ length: steps }, () => start + Math.floor(random() * (length - start + 1))),
  };
}

export function expectedStates(updates) {
  const start = Math.max(0, updates.length - WINDOW);
  const expected = new Map();
  const doc = new Y.Doc();
  if (start === 0) expected.set(0, canonical(calendar(doc)));
  try {
    for (let index = 0; index < updates.length; index++) {
      Y.applyUpdate(doc, updates[index].value);
      if (index + 1 >= start) expected.set(index + 1, canonical(calendar(doc)));
    }
  } finally { doc.destroy(); }
  return expected;
}

export function verify(updates, name) {
  const expected = expectedStates(updates);
  const minimum = Math.max(0, updates.length - WINDOW);
  const all = Array.from(expected.keys());
  const random = rng(0xf00d);
  const targets = updates.length > 1000
    ? [minimum, ...Object.values(workloads(updates.length, 16)).flat()]
    : [...all, ...all.toReversed(), ...Array.from({ length: 128 }, () => minimum + Math.floor(random() * (updates.length - minimum + 1)))];
  const preview = strategies[name](updates);
  try {
    for (const count of targets) {
      const actual = canonical(preview.seek(count));
      if (actual !== expected.get(count)) return { passed: false, count, expected: expected.get(count), actual };
    }
    return { passed: true, positions: targets.length };
  } catch (error) { return { passed: false, error: String(error) }; }
  finally { preview.destroy(); }
}

function quantile(values, fraction) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
}

function stats(values) {
  return { medianMs: quantile(values, 0.5), p95Ms: quantile(values, 0.95), maxMs: Math.max(...values) };
}

export function measure(updates, name, targets, repeats = 3) {
  const factory = strategies[name];
  const warm = factory(updates);
  for (const count of targets.slice(0, 8)) warm.seek(count);
  warm.destroy();
  const setup = [], first = [], warmSeeks = [], totals = [], teardown = [];
  let cacheBytes = 0;
  let checksum = 0;
  for (let repeat = 0; repeat < repeats; repeat++) {
    const start = performance.now();
    const preview = factory(updates);
    setup.push(performance.now() - start);
    for (const [index, count] of targets.entries()) {
      const before = performance.now();
      const snapshot = preview.seek(count);
      const elapsed = performance.now() - before;
      (index === 0 ? first : warmSeeks).push(elapsed);
      checksum += Object.keys(snapshot.availability).length;
    }
    totals.push(performance.now() - start);
    cacheBytes = preview.serializedCacheBytes ?? 0;
    const before = performance.now();
    preview.destroy();
    teardown.push(performance.now() - before);
  }
  return { strategy: name, setup: stats(setup), firstSeek: stats(first), warmSeek: stats(warmSeeks), total: stats(totals), teardown: stats(teardown), serializedCacheBytes: cacheBytes, checksum, samples: warmSeeks.length };
}

export function measureHeap(updates, name, collect) {
  collect();
  const before = process.memoryUsage().heapUsed;
  const preview = strategies[name](updates);
  preview.seek(updates.length);
  collect();
  const retainedBytes = process.memoryUsage().heapUsed - before;
  preview.destroy();
  return retainedBytes;
}
