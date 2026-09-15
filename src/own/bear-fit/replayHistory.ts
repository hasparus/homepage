// @filename: src/own/bear-fit/example.ts
import { applyUpdate, Doc } from "yjs";
import type { HistoryUpdate } from "./history.js";
// ---cut---
export function replayHistory(
  updates: readonly HistoryUpdate[],
  count: number,
): Doc {
  if (!Number.isInteger(count) || count < 0 || count > updates.length)
    throw new RangeError("Invalid history position");
  const doc = new Doc();
  try {
    for (const update of updates.slice(0, count))
      applyUpdate(doc, update.value);
    return doc;
  } catch (error) {
    doc.destroy();
    throw error;
  }
}
