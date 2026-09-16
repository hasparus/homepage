import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { Doc, encodeStateAsUpdate } from "yjs";
import type { HistoryUpdate } from "./history";
import { createHistoryPersistenceCheck } from "./historyPersistence";

function calendar(t: TestContext) {
  const doc = new Doc();
  doc.clientID = 1;
  t.after(() => doc.destroy());
  const updates: HistoryUpdate[] = [];
  doc.on("update", (value: Uint8Array) => {
    updates.push({ clock: String(updates.length + 1), value });
  });
  doc.getMap("event").set("id", "room");
  doc.getMap("names").set("reader", "Barney");
  doc.getMap("availability").set("reader/day", true);
  return { doc, updates };
}

function copy(updates: readonly HistoryUpdate[]): HistoryUpdate[] {
  return updates.map(({ clock, value }) => ({
    clock,
    value: new Uint8Array(value),
  }));
}

void test("identical fetched records reuse the reconstruction, including offset byte views", (t) => {
  const { doc, updates } = calendar(t);
  const destroy = t.mock.method(Doc.prototype, "destroy");
  const check = createHistoryPersistenceCheck();
  assert.equal(check(updates, doc), true);
  assert.equal(destroy.mock.callCount(), 1);
  assert.equal(check(copy(updates), doc), true);
  const sliced = updates.map(({ clock, value }) => {
    const buffer = new Uint8Array(value.length + 8);
    buffer.set(value, 4);
    return { clock, value: buffer.subarray(4, 4 + value.length) };
  });
  assert.equal(check(sliced, doc), true);
  assert.equal(destroy.mock.callCount(), 1);
});

void test("cached history is compared with the current live calendar, not the previous verdict", (t) => {
  const { doc, updates } = calendar(t);
  const saved = copy(updates);
  const destroy = t.mock.method(Doc.prototype, "destroy");
  const check = createHistoryPersistenceCheck();
  assert.equal(check(saved, doc), true);
  doc.getMap("names").set("reader", "Slithey");
  assert.equal(check(copy(saved), doc), false);
  assert.equal(check(copy(saved), doc), false);
  doc.getMap("names").set("reader", "Barney");
  assert.equal(check(copy(saved), doc), true);
  assert.equal(destroy.mock.callCount(), 1);
  assert.equal(check(copy(updates), doc), true);
  assert.equal(destroy.mock.callCount(), 2);
});

void test("appends, reordering, duplicate records, changed clocks and truncation invalidate the cache", (t) => {
  const { doc, updates } = calendar(t);
  const destroy = t.mock.method(Doc.prototype, "destroy");
  const check = createHistoryPersistenceCheck();
  const cases: [HistoryUpdate[], boolean][] = [
    [copy(updates), true],
    [[...copy(updates), { ...updates[0]!, clock: "4" }], true],
    [copy(updates).toReversed(), true],
    [
      updates.map((update) => ({ ...update, clock: `new-${update.clock}` })),
      true,
    ],
    [copy(updates).slice(0, -1), false],
    [copy(updates), true],
  ];
  for (const [index, [records, persisted]] of cases.entries()) {
    assert.equal(check(records, doc), persisted);
    assert.equal(check(copy(records), doc), persisted);
    assert.equal(destroy.mock.callCount(), index + 1);
  }
});

void test("changed prefix bytes invalidate history even with identical clocks and last record", (t) => {
  const { doc, updates } = calendar(t);
  const other = new Doc();
  t.after(() => other.destroy());
  other.getMap("names").set("reader", "Ottar");
  const changed = copy(updates);
  changed[1] = { clock: updates[1]!.clock, value: encodeStateAsUpdate(other) };
  const destroy = t.mock.method(Doc.prototype, "destroy");
  const check = createHistoryPersistenceCheck();
  assert.equal(check(updates, doc), true);
  assert.equal(check(changed, doc), false);
  assert.equal(check(copy(changed), doc), false);
  assert.equal(destroy.mock.callCount(), 2);
});

void test("cached records own their bytes and clocks", (t) => {
  const doc = new Doc();
  const other = new Doc();
  doc.clientID = 1;
  other.clientID = 2;
  t.after(() => {
    doc.destroy();
    other.destroy();
  });
  doc.getMap("names").set("reader", "Barney");
  other.getMap("names").set("reader", "Ottar!");
  const records = [{ clock: "1", value: encodeStateAsUpdate(doc) }];
  const replacement = encodeStateAsUpdate(other);
  assert.equal(records[0]!.value.length, replacement.length);
  const destroy = t.mock.method(Doc.prototype, "destroy");
  const check = createHistoryPersistenceCheck();
  assert.equal(check(records, doc), true);
  records[0]!.clock = "reused";
  assert.equal(check(records, doc), true);
  assert.equal(destroy.mock.callCount(), 2);
  records[0]!.value.set(replacement);
  assert.equal(check(records, doc), false);
  assert.equal(destroy.mock.callCount(), 3);
});

void test("failed reconstruction never replaces a valid cache or accepts partial history", (t) => {
  const { doc, updates } = calendar(t);
  const destroy = t.mock.method(Doc.prototype, "destroy");
  const check = createHistoryPersistenceCheck();
  assert.equal(check(updates, doc), true);
  const corrupt = copy(updates);
  corrupt[1]!.value = Uint8Array.of(255);
  assert.throws(() => check(corrupt, doc));
  assert.throws(() => check(corrupt, doc));
  assert.equal(destroy.mock.callCount(), 3);
  assert.equal(check(copy(updates), doc), true);
  assert.equal(destroy.mock.callCount(), 3);
});

void test("delayed dependencies, empty history and separate widget caches stay independent", (t) => {
  const { doc, updates } = calendar(t);
  const empty = new Doc();
  t.after(() => empty.destroy());
  const destroy = t.mock.method(Doc.prototype, "destroy");
  const check = createHistoryPersistenceCheck();
  const otherCheck = createHistoryPersistenceCheck();
  assert.equal(check([], empty), true);
  assert.equal(check([], doc), false);
  assert.equal(destroy.mock.callCount(), 1);
  assert.equal(check(updates.slice(1), doc), false);
  assert.equal(check(copy(updates).slice(1), doc), false);
  assert.equal(destroy.mock.callCount(), 2);
  assert.equal(check([...updates.slice(1), updates[0]!], doc), true);
  assert.equal(destroy.mock.callCount(), 3);
  assert.equal(otherCheck(copy(updates), doc), true);
  assert.equal(destroy.mock.callCount(), 4);
});
