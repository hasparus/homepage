// @filename: src/code-blocks/y-travelling/example.ts
import { applyUpdate, Doc } from "yjs";
import { MAX_PAST_VERSIONS } from "../../own/bear-fit/calendarHistoryModel.js";
import type { HistoryUpdate } from "../../own/bear-fit/history.js";

// ---cut---
export function cacheCalendarHistory(updates: readonly HistoryUpdate[]) {
  const doc = new Doc();
  const start = Math.max(0, updates.length - MAX_PAST_VERSIONS);
  try {
    doc.transact(() => {
      for (const update of updates.slice(0, start))
        applyUpdate(doc, update.value);
    });
    return updates.slice(start).map(({ clock, value }) => {
      applyUpdate(doc, value);
      return {
        clock,
        snapshot: {
          availability: Object.fromEntries(doc.getMap<boolean>("availability")),
          names: Object.fromEntries(doc.getMap<string>("names")),
          event: Object.fromEntries(doc.getMap<string>("event")),
        },
      };
    });
  } finally {
    doc.destroy();
  }
}
