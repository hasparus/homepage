import * as Y from "yjs";

import { cacheCalendarHistory } from "../../../code-blocks/y-travelling/cacheCalendarHistory.ts";
import { replayHistory } from "../replayHistory.ts";
import { cacheBase, calendar } from "./fixtures.mjs";

function applyRange(doc, updates, from, to) {
  doc.transact(() => {
    for (let index = from; index < to; index++)
      Y.applyUpdate(doc, updates[index].value);
  });
}

function readAndDestroy(doc) {
  try {
    return calendar(doc);
  } finally {
    doc.destroy();
  }
}

export const strategies = {
  fresh(updates) {
    return {
      seek(count) {
        const doc = new Y.Doc();
        for (const update of updates.slice(0, count))
          Y.applyUpdate(doc, update.value);
        return readAndDestroy(doc);
      },
    };
  },
  "fresh-batched"(updates) {
    return {
      seek: (count) => readAndDestroy(replayHistory(updates, count)),
    };
  },
  incremental(updates) {
    let doc = new Y.Doc();
    let position = 0;
    return {
      seek(count) {
        if (count < position) {
          doc.destroy();
          doc = new Y.Doc();
          position = 0;
        }
        applyRange(doc, updates, position, count);
        position = count;
        return calendar(doc);
      },
      destroy() {
        doc.destroy();
      },
    };
  },
  checkpoints(updates) {
    const start = cacheBase(updates.length);
    const checkpoints = [];
    const build = new Y.Doc();
    applyRange(build, updates, 0, start);
    checkpoints.push({ count: start, value: Y.encodeStateAsUpdate(build) });
    for (let index = start; index < updates.length; index++) {
      Y.applyUpdate(build, updates[index].value);
      if ((index + 1 - start) % 32 === 0)
        checkpoints.push({
          count: index + 1,
          value: Y.encodeStateAsUpdate(build),
        });
    }
    build.destroy();
    let doc = new Y.Doc();
    let position = 0;
    return {
      get serializedCacheBytes() {
        return checkpoints.reduce(
          (sum, checkpoint) => sum + checkpoint.value.byteLength,
          0,
        );
      },
      seek(count) {
        const checkpoint = checkpoints.findLast(
          (candidate) => candidate.count <= count,
        );
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
      destroy() {
        doc.destroy();
      },
    };
  },
  "calendar-cache"(updates) {
    const start = cacheBase(updates.length);
    const snapshots = [];
    const doc = new Y.Doc();
    try {
      applyRange(doc, updates, 0, start);
      snapshots.push(calendar(doc));
      for (let index = start; index < updates.length; index++) {
        Y.applyUpdate(doc, updates[index].value);
        snapshots.push(calendar(doc));
      }
    } finally {
      doc.destroy();
    }
    return {
      get serializedCacheBytes() {
        return new TextEncoder().encode(JSON.stringify(snapshots)).byteLength;
      },
      seek(count) {
        const snapshot = snapshots[count - start];
        if (!snapshot) throw new RangeError("Outside snapshot window");
        return snapshot;
      },
    };
  },
  "article-cache"(updates) {
    const versions = cacheCalendarHistory(updates);
    const start = updates.length - versions.length;
    return {
      get serializedCacheBytes() {
        return new TextEncoder().encode(JSON.stringify(versions)).byteLength;
      },
      seek(count) {
        if (count === start)
          return readAndDestroy(replayHistory(updates, count));
        const version = versions[count - start - 1];
        if (!version) throw new RangeError("Outside snapshot window");
        return version.snapshot;
      },
    };
  },
  "yjs-snapshots"(updates) {
    const start = cacheBase(updates.length);
    const doc = new Y.Doc({ gc: false });
    const snapshots = [];
    applyRange(doc, updates, 0, start);
    snapshots.push(Y.snapshot(doc));
    for (let index = start; index < updates.length; index++) {
      Y.applyUpdate(doc, updates[index].value);
      snapshots.push(Y.snapshot(doc));
    }
    return {
      get serializedCacheBytes() {
        return (
          Y.encodeStateAsUpdate(doc).byteLength +
          snapshots.reduce(
            (sum, snapshot) => sum + Y.encodeSnapshot(snapshot).byteLength,
            0,
          )
        );
      },
      seek(count) {
        const snapshot = snapshots[count - start];
        if (!snapshot) throw new RangeError("Outside snapshot window");
        return readAndDestroy(Y.createDocFromSnapshot(doc, snapshot));
      },
      destroy() {
        doc.destroy();
      },
    };
  },
};
