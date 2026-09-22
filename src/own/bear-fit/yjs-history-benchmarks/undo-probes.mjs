import { writeFileSync } from "node:fs";
import * as Y from "yjs";

import { option } from "./args.mjs";
import { calendar, fixture } from "./fixtures.mjs";
import { measure, verify, workloads } from "./measure.mjs";

const repeats = Number(option("repeats", "9"));

function undoPreview(updates, ignoreRemoteMapChanges = false) {
  const doc = new Y.Doc();
  const manager = new Y.UndoManager(
    [doc.getMap("availability"), doc.getMap("names"), doc.getMap("event")],
    {
      captureTimeout: 0,
      trackedOrigins: new Set(["history"]),
      ignoreRemoteMapChanges,
    },
  );
  const stackSizes = [0];
  for (const update of updates) {
    Y.applyUpdate(doc, update.value, "history");
    manager.stopCapturing();
    stackSizes.push(manager.undoStack.length);
  }
  return {
    seek(count) {
      const target = stackSizes[count];
      while (manager.undoStack.length > target) {
        const before = manager.undoStack.length;
        manager.undo();
        if (
          manager.undoStack.length >= before ||
          manager.undoStack.length < target
        )
          throw new Error(
            `Undo skipped requested history boundary ${count}: stack ${before} -> ${manager.undoStack.length}, wanted ${target}`,
          );
      }
      while (manager.undoStack.length < target) {
        const before = manager.undoStack.length;
        manager.redo();
        if (
          manager.undoStack.length <= before ||
          manager.undoStack.length > target
        )
          throw new Error(
            `Redo skipped requested history boundary ${count}: stack ${before} -> ${manager.undoStack.length}, wanted ${target}`,
          );
      }
      return calendar(doc);
    },
    destroy() {
      manager.destroy();
      doc.destroy();
    },
  };
}
/** Local to this probe: the shared registry stays untouched. */
const variants = {
  "undo-redo": (updates) => undoPreview(updates),
  "undo-redo-ignore-remote": (updates) => undoPreview(updates, true),
};

const source = new Y.Doc();
source.clientID = 1;
const updates = [];
source.on("update", (value) => updates.push(value));
source.getMap("availability").set("day", true);
source.getMap("availability").delete("day");
const preview = new Y.Doc();
const undo = new Y.UndoManager(preview.getMap("availability"), {
  captureTimeout: 0,
  trackedOrigins: new Set(["history"]),
});
for (const update of updates) Y.applyUpdate(preview, update, "history");
const afterDelete = calendar(preview).availability;
undo.undo();
const afterUndo = calendar(preview).availability;
Y.applyUpdate(preview, updates[1], "history");
const afterReapplyingOriginalDelete = calendar(preview).availability;
const counterexample = {
  afterDelete,
  afterUndo,
  afterReapplyingOriginalDelete,
  expectedAfterReapply: afterDelete,
  updateByteArrays: updates.map((value) => [...value]),
};
undo.destroy();
preview.destroy();
source.destroy();
console.log(
  "Undo then apply original deletion:",
  JSON.stringify(counterexample),
);

const validation = [];
for (const size of [8, 32, 250]) {
  for (const concurrent of [false, true]) {
    const input = fixture(size, concurrent);
    for (const name of Object.keys(variants)) {
      const result = {
        strategy: name,
        fixture: `${concurrent ? "concurrent-reordered" : "sequential"}-${size}`,
        ...verify(input, variants[name]),
      };
      validation.push(result);
      console.log(JSON.stringify(result));
    }
  }
}
const timings = [];
for (const size of [250, 1000, 10_000]) {
  const input = fixture(size);
  for (const name of Object.keys(variants)) {
    const check = verify(input, variants[name]);
    if (!check.passed) continue;
    for (const [workload, targets] of Object.entries(
      workloads(input.length, 24),
    ))
      timings.push({
        size,
        workload,
        strategy: name,
        ...measure(input, variants[name], targets, repeats),
      });
  }
}
writeFileSync(
  option("out", "src/own/bear-fit/yjs-history-benchmarks/results-undo.json"),
  JSON.stringify(
    { counterexample, validation, performance: timings },
    null,
    2,
  ) + "\n",
);
