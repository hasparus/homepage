import assert from "node:assert/strict";
import { test } from "node:test";
import { Doc } from "yjs";
import { decodeHistoryUpdates, replayHistory } from "../own/bear-fit/history";
import { encodeHistoryUpdates } from "./y-travelling-server";

void test("the tutorial encoder writes the documented length-prefixed format", () => {
  const encoded = encodeHistoryUpdates([
    { clock: "7", value: new Uint8Array([10, 10, 255]) },
  ]);
  assert.deepEqual(
    encoded,
    new Uint8Array([0, 0, 0, 1, 0, 0, 0, 3, 55, 10, 10, 255]),
  );
  assert.deepEqual(encodeHistoryUpdates([]), new Uint8Array());
});

void test("canonical encoder and demo decoder preserve replayable Yjs history", () => {
  const doc = new Doc();
  const updates: { clock: string; value: Uint8Array }[] = [];
  doc.on("update", (value: Uint8Array) => {
    updates.push({ clock: String(updates.length), value });
  });
  const availability = doc.getMap<boolean>("availability");
  availability.set("demo-you〷2077-09-06", true);
  availability.set("demo-you〷2077-09-06", false);
  const decoded = decodeHistoryUpdates(encodeHistoryUpdates(updates));
  const before = replayHistory(decoded, 1);
  const after = replayHistory(decoded, 2);
  try {
    assert.deepEqual(decoded, updates);
    assert.equal(
      before.getMap("availability").get("demo-you〷2077-09-06"),
      true,
    );
    assert.equal(
      after.getMap("availability").get("demo-you〷2077-09-06"),
      false,
    );
  } finally {
    before.destroy();
    after.destroy();
    doc.destroy();
  }
});

void test("the encoder rejects empty fields", () => {
  assert.throws(
    () => encodeHistoryUpdates([{ clock: "", value: new Uint8Array([1]) }]),
    /missing clock/,
  );
  assert.throws(
    () => encodeHistoryUpdates([{ clock: "0", value: new Uint8Array() }]),
    /missing value/,
  );
});
