// @filename: src/code-blocks/y-travelling/example.ts
import type * as Party from "partykit/server";
import {
  encodeHistoryUpdates,
  getLevelUpdates,
} from "../y-travelling-server.js";

export default class Server implements Party.Server {
  constructor(public room: Party.Room) {}
  // ---cut---
  async onRequest(request: Party.Request) {
    const url = new URL(request.url);
    if (
      request.method !== "GET" ||
      url.pathname !== `/parties/main/${this.room.id}/history`
    ) {
      return new Response("Not found", { status: 404 });
    }

    const updates = await getLevelUpdates(this.room.storage, this.room.id);
    return new Response(
      encodeHistoryUpdates(
        updates.map((update) => ({
          clock: String(update.key[3] ?? "sv"),
          value: update.value,
        })),
      ) as BodyInit,
      { headers: { "Content-Type": "application/octet-stream" } },
    );
  }
  // ---cut-after---
}
