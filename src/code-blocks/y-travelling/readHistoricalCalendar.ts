// @filename: src/code-blocks/y-travelling/readHistoricalCalendar.ts
import type { CalendarSnapshot } from "../../own/bear-fit/calendarHistoryModel.js";
import {
  replayHistory,
  type HistoryUpdate,
} from "../../own/bear-fit/history.js";
// ---cut---
export function readHistoricalCalendar(
  updates: readonly HistoryUpdate[],
  count: number,
): CalendarSnapshot {
  const doc = replayHistory(updates, count);
  try {
    return {
      availability: Object.fromEntries(doc.getMap<boolean>("availability")),
      names: Object.fromEntries(doc.getMap<string>("names")),
      event: Object.fromEntries(doc.getMap<string>("event")),
    };
  } finally {
    doc.destroy();
  }
}
