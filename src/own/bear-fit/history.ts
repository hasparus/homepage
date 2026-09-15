export { decodeHistoryUpdates } from "./decodeHistoryUpdates.js";
export { fetchHistory } from "./fetchHistory.js";
export { replayHistory } from "./replayHistory.js";

export interface HistoryUpdate {
  /** Incremental storage clock, not a timestamp. */
  clock: string;
  value: Uint8Array;
}
