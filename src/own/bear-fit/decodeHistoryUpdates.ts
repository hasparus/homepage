// @filename: src/own/bear-fit/decodeHistoryUpdates.ts
import type { HistoryUpdate } from "./history.js";
// ---cut---
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
