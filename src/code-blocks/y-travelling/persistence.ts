// @filename: src/code-blocks/y-travelling/persistence.ts
import { onConnect } from "y-partykit";
import type * as Party from "partykit/server";
// ---cut---
export default class Server implements Party.Server {
  constructor(public room: Party.Room) {}

  onConnect(connection: Party.Connection) {
    return onConnect(connection, this.room, {
      persist: { mode: "history" },
    });
  }
}
