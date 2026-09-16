import type { Doc } from "yjs";
import type { HistoryUpdate } from "./history";
import { replayHistory } from "./replayHistory";

function calendarFingerprint(doc: Doc): string {
  return JSON.stringify(
    ["availability", "names", "event"].map((name) =>
      [...doc.getMap(name)].sort(([a], [b]) => a.localeCompare(b)),
    ),
  );
}

function sameHistory(
  previous: readonly HistoryUpdate[],
  next: readonly HistoryUpdate[],
): boolean {
  if (previous.length !== next.length) return false;
  for (const [index, a] of previous.entries()) {
    const b = next[index]!;
    if (a.clock !== b.clock || a.value.length !== b.value.length) return false;
    for (let byte = 0; byte < a.value.length; byte++) {
      if (a.value[byte] !== b.value[byte]) return false;
    }
  }
  return true;
}

export function createHistoryPersistenceCheck() {
  let cached:
    { updates: readonly HistoryUpdate[]; fingerprint: string } | undefined;

  return (updates: readonly HistoryUpdate[], live: Doc): boolean => {
    if (!cached || !sameHistory(cached.updates, updates)) {
      const checked = replayHistory(updates, updates.length);
      try {
        cached = {
          updates: updates.map(({ clock, value }) => ({
            clock,
            value: new Uint8Array(value),
          })),
          fingerprint: calendarFingerprint(checked),
        };
      } finally {
        checked.destroy();
      }
    }
    return cached.fingerprint === calendarFingerprint(live);
  };
}
