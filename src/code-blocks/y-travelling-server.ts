import type * as Party from "partykit/server";
import { getLevelBulkData } from "y-partykit/storage";

export interface HistoryUpdate {
  clock: string;
  value: Uint8Array;
}

export const HEADER_SIZE = 8;
export const MAX_FIELD_SIZE = 0xffffffff;

export function validateFieldLengths(clockLength: number, valueLength: number) {
  if (clockLength === 0) {
    throw new Error("Invalid history: missing clock");
  }
  if (valueLength === 0) {
    throw new Error("Invalid history: missing value");
  }
  if (clockLength > MAX_FIELD_SIZE || valueLength > MAX_FIELD_SIZE) {
    throw new Error("Invalid history: field too large");
  }
}

export function encodeHistoryUpdates(
  updates: readonly HistoryUpdate[],
): Uint8Array {
  const textEncoder = new TextEncoder();
  const records = updates.map(({ clock, value }) => {
    const encodedClock = textEncoder.encode(clock);
    validateFieldLengths(encodedClock.length, value.length);
    return { clock: encodedClock, value };
  });
  const size = records.reduce(
    (total, record) =>
      total + HEADER_SIZE + record.clock.length + record.value.length,
    0,
  );
  const body = new Uint8Array(size);
  const view = new DataView(body.buffer, body.byteOffset, body.byteLength);
  let offset = 0;
  for (const record of records) {
    view.setUint32(offset, record.clock.length);
    view.setUint32(offset + 4, record.value.length);
    offset += HEADER_SIZE;
    body.set(record.clock, offset);
    offset += record.clock.length;
    body.set(record.value, offset);
    offset += record.value.length;
  }
  return body;
}

export async function getLevelUpdates(
  db: Party.Storage,
  docName: string,
  opts: {
    keys: boolean;
    limit?: number;
    reverse?: boolean;
    values: boolean;
  } = {
    keys: false,
    values: true,
  },
): Promise<Datum[]> {
  return getLevelBulkData(db, {
    gte: createDocumentUpdateKey(docName, 0),
    lt: createDocumentUpdateKey(docName, BINARY_BITS_32),
    ...opts,
  });
}

interface Datum {
  key: StorageKey;
  value: Uint8Array;
}

type StorageKey = DocumentStateVectorKey | DocumentUpdateKey;
type DocumentUpdateKey = ["v1", string, "update", number];
type DocumentStateVectorKey = ["v1_sv", string];

function createDocumentUpdateKey(
  docName: string,
  clock: number,
): DocumentUpdateKey {
  return ["v1", docName, "update", clock];
}

const BINARY_BITS_32 = 0xffffffff;
