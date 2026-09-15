import assert from "node:assert/strict";
import { test } from "node:test";
import { Doc } from "yjs";

import {
  decodeHistoryUpdates,
  fetchHistory,
  type HistoryUpdate,
  replayHistory,
} from "./history";

function encode(updates: HistoryUpdate[]) {
  const records = updates.map(({ clock, value }) => {
    const name = new TextEncoder().encode(clock);
    const record = new Uint8Array(8 + name.length + value.length);
    const view = new DataView(record.buffer);
    view.setUint32(0, name.length);
    view.setUint32(4, value.length);
    record.set(name, 8);
    record.set(value, 8 + name.length);
    return record;
  });
  const result = new Uint8Array(
    records.reduce((size, record) => size + record.length, 0),
  );
  let offset = 0;
  for (const record of records) {
    result.set(record, offset);
    offset += record.length;
  }
  return result;
}

void test("decodes binary records, embedded newlines, UTF-8 clocks and sliced buffers", () => {
  const updates = [
    { clock: "12", value: new Uint8Array([10, 10, 0, 255]) },
    { clock: "clock-α", value: new Uint8Array([0, 1]) },
  ];
  const encoded = encode(updates);
  const padded = new Uint8Array(encoded.length + 6);
  padded.set(encoded, 3);
  assert.deepEqual(decodeHistoryUpdates(padded.subarray(3, -3)), updates);
  assert.deepEqual(decodeHistoryUpdates(new Uint8Array()), []);
});

void test("rejects truncated headers, records, empty fields and invalid UTF-8", () => {
  assert.throws(
    () => decodeHistoryUpdates(new Uint8Array(7)),
    /truncated record header/,
  );
  assert.throws(() => decodeHistoryUpdates(new Uint8Array(8)), /empty field/);
  const bytes = encode([{ clock: "0", value: new Uint8Array([1, 2]) }]);
  assert.throws(
    () => decodeHistoryUpdates(bytes.subarray(0, -1)),
    /truncated record/,
  );
  bytes[8] = 255;
  assert.throws(() => decodeHistoryUpdates(bytes), TypeError);
  new DataView(bytes.buffer).setUint32(0, 4_294_967_295);
  assert.throws(() => decodeHistoryUpdates(bytes), /truncated record/);
});

void test("replays addition and removal prefixes independently of the live document", () => {
  const live = new Doc();
  const updates: HistoryUpdate[] = [];
  live.on("update", (value: Uint8Array) =>
    updates.push({ clock: String(updates.length), value }),
  );
  const map = live.getMap<boolean>("availability");
  const changes: [string, boolean][] = [
    ["demo-you〷2077-09-06", true],
    ["demo-you〷2077-09-07", true],
    ["demo-you〷2077-09-06", false],
  ];
  for (const [date, available] of changes) map.set(date, available);
  const decoded = decodeHistoryUpdates(encode(updates));
  const empty = replayHistory(decoded, 0);
  const first = replayHistory(decoded, 1);
  const latest = replayHistory(decoded, decoded.length);
  try {
    assert.equal(empty.getMap("availability").size, 0);
    assert.equal(
      first.getMap("availability").get("demo-you〷2077-09-06"),
      true,
    );
    assert.equal(
      latest.getMap("availability").get("demo-you〷2077-09-06"),
      false,
    );
    first.getMap("availability").set("demo-you〷2077-09-08", true);
    assert.equal(map.has("demo-you〷2077-09-08"), false);
    assert.equal(updates.length, 3);
  } finally {
    empty.destroy();
    first.destroy();
    latest.destroy();
    live.destroy();
  }
});

void test("rejects invalid replay positions and corrupt Yjs updates", () => {
  for (const count of [-1, 0.5, 1, Number.NaN])
    assert.throws(() => replayHistory([], count), RangeError);
  assert.throws(() =>
    replayHistory([{ clock: "0", value: new Uint8Array([255]) }], 1),
  );
});

void test("fetch uses the actual route, propagates abort signals and rejects HTTP errors", async (context) => {
  const signal = new AbortController().signal;
  context.mock.method(
    globalThis,
    "fetch",
    async (url: string, init: RequestInit) => {
      assert.equal(
        url,
        "https://backend.example/parties/main/demo-room/history",
      );
      assert.equal(init.signal, signal);
      assert.equal(init.cache, "no-store");
      return new Response("unavailable", { status: 503 });
    },
  );
  await assert.rejects(
    fetchHistory("https://backend.example", "demo-room", signal),
    /503/,
  );
});
