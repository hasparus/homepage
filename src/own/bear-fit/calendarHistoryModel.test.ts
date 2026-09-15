import assert from "node:assert/strict";
import { test } from "node:test";
import { Doc } from "yjs";
import {
  calendarIsEditable,
  type CalendarHistoryState,
  type CalendarSnapshot,
  displayedCalendar,
  historyWindowStart,
  initialCalendarHistoryState,
  MAX_PAST_VERSIONS,
  timelinePosition,
  transitionCalendarHistory as transition,
  visibleHistory,
} from "./calendarHistoryModel";
import { type HistoryUpdate, replayHistory } from "./history";

const snapshot = (available: boolean): CalendarSnapshot => ({
  event: { id: "blog-event" },
  availability: { "barney〷2077-09-06": available },
  names: { barney: "Barney" },
});
const records = (count: number): HistoryUpdate[] =>
  Array.from({ length: count }, (_, index) => ({
    clock: String(index),
    value: new Uint8Array([index % 256]),
  }));
function ready(count = 3): CalendarHistoryState {
  return transition(
    transition(initialCalendarHistoryState(), {
      type: "CONNECTED",
      snapshot: snapshot(true),
    }),
    { type: "HISTORY_RECEIVED", updates: records(count) },
  );
}

void test("starts in the present and follows the newest history position", () => {
  const initial = initialCalendarHistoryState();
  assert.equal(initial.timeline.kind, "present");
  assert.equal(timelinePosition(initial), 0);
  assert.equal(calendarIsEditable(initial), false);
  const connected = transition(initial, {
    type: "CONNECTED",
    snapshot: snapshot(true),
  });
  assert.equal(calendarIsEditable(connected), true);
  const loaded = transition(connected, {
    type: "HISTORY_RECEIVED",
    updates: records(3),
  });
  assert.equal(timelinePosition(loaded), 3);
  assert.equal(displayedCalendar(loaded), connected.present);
  assert.equal(initial.updates.length, 0);
  const empty = transition(loaded, {
    type: "CONNECTED",
    snapshot: initial.present,
  });
  assert.equal(calendarIsEditable(empty), false);
});

void test("past snapshot and clock move together; live changes do not replace the preview", () => {
  const present = ready();
  const past = snapshot(false);
  const selected = transition(present, {
    type: "VIEW_PAST",
    clock: "1",
    snapshot: past,
  });
  assert.equal(calendarIsEditable(selected), false);
  assert.equal(timelinePosition(selected), 1);
  assert.equal(displayedCalendar(selected), past);
  const latest = snapshot(true);
  const changed = transition(selected, {
    type: "DOCUMENT_CHANGED",
    snapshot: latest,
  });
  assert.equal(displayedCalendar(changed), past);
  const refreshed = transition(changed, {
    type: "HISTORY_RECEIVED",
    updates: records(4),
  });
  assert.equal(refreshed.timeline, selected.timeline);
  assert.equal(timelinePosition(refreshed), 1);
  const returned = transition(refreshed, { type: "VIEW_PRESENT" });
  assert.deepEqual(returned.timeline, { kind: "present" });
  assert.equal(displayedCalendar(returned), latest);
  assert.equal(timelinePosition(returned), 4);
  assert.equal(calendarIsEditable(returned), true);
});

void test("connection transitions clear old connection failures without changing the timeline", () => {
  const selected = transition(ready(), {
    type: "VIEW_PAST",
    clock: "1",
    snapshot: snapshot(false),
  });
  const offline = transition(selected, {
    type: "DISCONNECTED",
    message: "offline",
  });
  assert.deepEqual(offline.connection, { kind: "offline", message: "offline" });
  assert.equal(calendarIsEditable(offline), false);
  const connecting = transition(offline, { type: "CONNECT" });
  assert.deepEqual(connecting.connection, { kind: "connecting" });
  assert.equal(connecting.timeline, selected.timeline);
  const connected = transition(connecting, {
    type: "CONNECTED",
    snapshot: snapshot(true),
  });
  assert.deepEqual(connected.connection, { kind: "connected" });
  assert.equal(connected.timeline, selected.timeline);
  assert.equal(calendarIsEditable(connected), false);
  const returnedOffline = transition(offline, { type: "VIEW_PRESENT" });
  assert.equal(calendarIsEditable(returnedOffline), false);
});

void test("compaction keeps the snapshot even when clocks are reused or disappear", () => {
  const selected = transition(ready(), {
    type: "VIEW_PAST",
    clock: "1",
    snapshot: snapshot(false),
  });
  for (const updates of [
    [],
    records(3).slice(1),
    [{ clock: "0", value: new Uint8Array([99]) }, ...records(3).slice(1)],
  ]) {
    const compacted = transition(selected, {
      type: "HISTORY_RECEIVED",
      updates,
    });
    assert.equal(compacted.timeline.kind, "compacted-past");
    assert.equal(displayedCalendar(compacted), displayedCalendar(selected));
    assert.equal(calendarIsEditable(compacted), false);
    const receivedAgain = transition(compacted, {
      type: "HISTORY_RECEIVED",
      updates: records(4),
    });
    assert.equal(receivedAgain.timeline, compacted.timeline);
    assert.equal(
      transition(compacted, { type: "VIEW_PRESENT" }).timeline.kind,
      "present",
    );
  }
});

void test("errors preserve the visible document and valid history; success clears them", () => {
  const selected = transition(ready(), {
    type: "VIEW_PAST",
    clock: "1",
    snapshot: snapshot(false),
  });
  for (const type of ["HISTORY_FAILED", "PREVIEW_FAILED"] as const) {
    const failed = transition(selected, { type, message: "failed" });
    assert.equal(failed.timeline, selected.timeline);
    assert.equal(failed.updates, selected.updates);
    assert.equal(failed.error, "failed");
    assert.equal(
      transition(failed, { type: "HISTORY_RECEIVED", updates: records(3) })
        .error,
      null,
    );
  }
  assert.equal(
    transition(selected, {
      type: "VIEW_PAST",
      clock: "missing",
      snapshot: snapshot(true),
    }),
    selected,
  );
});

void test("offers at most 250 past versions and preserves previews that age out of the window", () => {
  for (const count of [0, 1, 249, 250, 251, 300]) {
    const state = ready(count);
    assert.equal(
      visibleHistory(state).length,
      Math.min(count, MAX_PAST_VERSIONS),
    );
    assert.equal(timelinePosition(state), Math.min(count, MAX_PAST_VERSIONS));
    assert.equal(
      historyWindowStart(state),
      Math.max(0, count - MAX_PAST_VERSIONS),
    );
  }
  const state = ready(300);
  assert.equal(visibleHistory(state)[0]!.clock, "50");
  assert.equal(
    transition(state, {
      type: "VIEW_PAST",
      clock: "49",
      snapshot: snapshot(false),
    }),
    state,
  );
  const selected = transition(state, {
    type: "VIEW_PAST",
    clock: "50",
    snapshot: snapshot(false),
  });
  assert.equal(timelinePosition(selected), 0);
  const aged = transition(selected, {
    type: "HISTORY_RECEIVED",
    updates: records(301),
  });
  assert.equal(aged.timeline.kind, "outside-window-past");
  assert.equal(displayedCalendar(aged), displayedCalendar(selected));
  assert.equal(visibleHistory(aged).length, 250);
  const present = transition(aged, { type: "VIEW_PRESENT" });
  assert.equal(timelinePosition(present), 250);
  assert.equal(calendarIsEditable(present), true);
});

void test("window positions still replay the earlier prefix needed by Yjs", () => {
  const doc = new Doc();
  const updates: HistoryUpdate[] = [];
  doc.on("update", (value: Uint8Array) =>
    updates.push({ clock: String(updates.length), value }),
  );
  doc.getMap("data").set("before-window", "keep me");
  for (let i = 0; i < 300; i++) doc.getMap("data").set("counter", i);
  const state = transition(initialCalendarHistoryState(), {
    type: "HISTORY_RECEIVED",
    updates,
  });
  const preview = replayHistory(state.updates, historyWindowStart(state) + 1);
  try {
    assert.equal(visibleHistory(state).length, 250);
    assert.equal(preview.getMap("data").get("before-window"), "keep me");
    assert.equal(preview.getMap("data").get("counter"), 50);
  } finally {
    preview.destroy();
    doc.destroy();
  }
});
