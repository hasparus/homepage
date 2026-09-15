// @filename: src/own/bear-fit/fetchHistory.ts
import { decodeHistoryUpdates } from "./decodeHistoryUpdates.js";
import type { HistoryUpdate } from "./history.js";
// ---cut---
export async function fetchHistory(
  server: string,
  room: string,
  signal: AbortSignal,
): Promise<HistoryUpdate[]> {
  const response = await fetch(
    `${server}/parties/main/${encodeURIComponent(room)}/history`,
    { signal, cache: "no-store" },
  );
  if (!response.ok)
    throw new Error(`History request failed (${response.status})`);
  return decodeHistoryUpdates(new Uint8Array(await response.arrayBuffer()));
}
