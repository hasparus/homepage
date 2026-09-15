import { applyUpdate, Doc } from "yjs";

export interface HistoryUpdate {
  /** Incremental storage clock, not a timestamp. */
  clock: string;
  value: Uint8Array;
}

/** Wire format from bear-fit/app/decodeHistoryUpdates.ts. Lengths are big-endian. */
export function decodeHistoryUpdates(body: Uint8Array): HistoryUpdate[] {
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const view = new DataView(body.buffer, body.byteOffset, body.byteLength);
  const updates: HistoryUpdate[] = [];
  let offset = 0;
  while (offset < body.length) {
    if (body.length - offset < 8)
      throw new Error("Invalid history: truncated record header");
    const clockLength = view.getUint32(offset);
    const valueLength = view.getUint32(offset + 4);
    offset += 8;
    if (!clockLength || !valueLength)
      throw new Error("Invalid history: empty field");
    const clockEnd = offset + clockLength;
    const valueEnd = clockEnd + valueLength;
    if (valueEnd > body.length)
      throw new Error("Invalid history: truncated record");
    updates.push({
      clock: decoder.decode(body.subarray(offset, clockEnd)),
      value: body.slice(clockEnd, valueEnd),
    });
    offset = valueEnd;
  }
  return updates;
}

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

/** Rebuild a prefix into a disposable document. Never apply history to the live doc. */
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
