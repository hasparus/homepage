import assert from "node:assert/strict";
import { test } from "node:test";
import { applyUpdate, Doc, encodeStateAsUpdate } from "yjs";
import { MAX_PAST_VERSIONS } from "../../own/bear-fit/calendarHistoryModel";
import type { HistoryUpdate } from "../../own/bear-fit/history";
import { cacheCalendarHistory } from "./cacheCalendarHistory";
import { readHistoricalCalendar } from "./readHistoricalCalendar";

function records(values: Uint8Array[]): HistoryUpdate[] {
  return values.map((value, index) => ({ clock: String(index), value }));
}

void test("cached versions match naive replay and retain the prefix outside the window", () => {
  const doc = new Doc();
  const values: Uint8Array[] = [];
  doc.on("update", (update: Uint8Array) => values.push(update));
  doc.transact(() => {
    doc.getMap("names").set("barney", "Barney");
    doc.getMap("event").set("name", "shooting a viking movie");
  });
  for (let index = 0; index < 320; index++) {
    const map = doc.getMap("availability");
    const key = `barney〷${index % 21}`;
    if (map.has(key)) map.delete(key);
    else map.set(key, true);
  }
  doc.destroy();
  const updates = records(values);
  const cached = cacheCalendarHistory(updates);
  assert.equal(cached.length, MAX_PAST_VERSIONS);
  const start = updates.length - cached.length;
  for (const [index, version] of cached.entries()) {
    assert.equal(version.clock, updates[start + index]!.clock);
    assert.deepEqual(
      version.snapshot,
      readHistoricalCalendar(updates, start + index + 1),
    );
    assert.equal(version.snapshot.names.barney, "Barney");
  }
  assert.notEqual(
    cached[0]!.snapshot.availability,
    cached[1]!.snapshot.availability,
  );
});

void test("cached versions match replay for delayed deletes, concurrent inserts and duplicates", () => {
  const left = new Doc();
  const right = new Doc();
  left.getMap("event").set("id", "test");
  const base = encodeStateAsUpdate(left);
  applyUpdate(right, base);
  const leftUpdates: Uint8Array[] = [];
  const rightUpdates: Uint8Array[] = [];
  left.on("update", (update: Uint8Array) => leftUpdates.push(update));
  right.on("update", (update: Uint8Array) => rightUpdates.push(update));
  left.getMap("availability").set("day", true);
  left.getMap("availability").delete("day");
  right.getMap("availability").set("day", true);
  right.getMap("availability").set("other", true);
  const updates = records([
    base,
    leftUpdates[1]!,
    rightUpdates[1]!,
    leftUpdates[0]!,
    rightUpdates[0]!,
    rightUpdates[0]!,
  ]);
  left.destroy();
  right.destroy();
  for (const [index, version] of cacheCalendarHistory(updates).entries()) {
    assert.deepEqual(
      version.snapshot,
      readHistoricalCalendar(updates, index + 1),
    );
  }
});

void test("empty history has no cached versions and corrupt updates do not return a partial cache", () => {
  assert.deepEqual(cacheCalendarHistory([]), []);
  const doc = new Doc();
  doc.getMap("availability").set("day", true);
  const updates = records([encodeStateAsUpdate(doc), Uint8Array.of(255)]);
  doc.destroy();
  assert.throws(() => cacheCalendarHistory(updates));
});
