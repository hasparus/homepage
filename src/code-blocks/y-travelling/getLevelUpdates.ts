// @filename: src/code-blocks/y-travelling/getLevelUpdates.ts
import type * as Party from "partykit/server";
import { getLevelBulkData } from "y-partykit/storage";
// ---cut---
export async function getLevelUpdates(db: Party.Storage, docName: string) {
  return getLevelBulkData(db, {
    gte: ["v1", docName, "update", 0],
    lt: ["v1", docName, "update", 0xffffffff],
    keys: false,
    values: true,
  });
}
