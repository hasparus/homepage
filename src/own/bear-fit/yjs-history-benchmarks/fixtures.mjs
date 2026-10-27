import * as Y from "yjs";

/** How many versions the slider can reach. */
export const WINDOW = 250;

/**
 * The state the caches are built from: everything before it is replayed once,
 * up front. `cacheBase` is inside the cache, `windowStart` is the first
 * position a timed workload visits. They differ by one on purpose, so the
 * measured seeks stay within the cached window while `verify` still checks the
 * base, where `article-cache` falls back to a naive replay.
 */
export const cacheBase = (length) => Math.max(0, length - WINDOW);
export const windowStart = (length) => Math.max(1, length - WINDOW + 1);

const MAPS = ["availability", "names", "event"];
const USERS = ["barney", "slithey", "ruf", "ottar"];
const FIRST_DAY = Date.UTC(2077, 8, 6);
const DAY_MS = 86_400_000;

export function calendar(doc) {
  return {
    availability: Object.fromEntries(doc.getMap("availability")),
    names: Object.fromEntries(doc.getMap("names")),
    event: Object.fromEntries(doc.getMap("event")),
  };
}

export function canonical(value) {
  return JSON.stringify(
    MAPS.map((name) =>
      Object.entries(value[name]).sort(([a], [b]) => a.localeCompare(b)),
    ),
  );
}

export function rng(seed) {
  let state = Math.trunc(seed);
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
}

const dayKey = (offset) =>
  new Date(FIRST_DAY + offset * DAY_MS).toISOString().slice(0, 10);

function participants(count) {
  if (count <= USERS.length) return USERS.slice(0, count);
  return [
    ...USERS,
    ...Array.from({ length: count - USERS.length }, (_, i) => `guest-${i + 1}`),
  ];
}

/**
 * Generated history. `users` x `days` sets how wide the document gets, which
 * is what the caches actually pay for; `count` only sets how long the log is.
 */
export function fixture(count, options = false) {
  const {
    concurrent = false,
    users = 4,
    days = 21,
  } = typeof options === "boolean" ? { concurrent: options } : options;
  const people = participants(users);
  const random = rng(0x5e_ed);
  const base = new Y.Doc();
  base.clientID = 100;
  base.transact(() => {
    for (const name of people)
      base.getMap("names").set(`blog-reader-${name}`, name);
    for (const [key, value] of Object.entries({
      id: "benchmark",
      name: "shooting a viking movie",
      startDate: dayKey(0),
      endDate: dayKey(days - 1),
    }))
      base.getMap("event").set(key, value);
  });
  const initial = Y.encodeStateAsUpdate(base);
  const clients = Array.from({ length: concurrent ? 4 : 1 }, (_, index) => {
    const doc = new Y.Doc();
    doc.clientID = index + 1;
    Y.applyUpdate(doc, initial);
    return doc;
  });
  const values = [initial];
  for (const doc of clients) doc.on("update", (update) => values.push(update));
  while (values.length < count) {
    const doc = clients[Math.floor(random() * clients.length)];
    const user = people[Math.floor(random() * people.length)];
    const key = `blog-reader-${user}〷${dayKey(Math.floor(random() * days))}`;
    const map = doc.getMap("availability");
    if (map.has(key)) map.delete(key);
    else map.set(key, true);
  }
  if (concurrent) {
    for (let start = 1; start < values.length; start += 13) {
      const end = Math.min(start + 13, values.length);
      for (let index = end - 1; index > start; index--) {
        const target = start + Math.floor(random() * (index - start + 1));
        [values[index], values[target]] = [values[target], values[index]];
      }
    }
    values.splice(Math.floor(values.length / 2), 0, values[1]);
  }
  for (const doc of clients) doc.destroy();
  base.destroy();
  return values.map((value, index) => ({ clock: String(index + 1), value }));
}

/** How wide the document a fixture produces actually is. */
export function width(updates) {
  const doc = new Y.Doc();
  try {
    for (const update of updates) Y.applyUpdate(doc, update.value);
    const state = calendar(doc);
    return {
      availabilityKeys: Object.keys(state.availability).length,
      nameKeys: Object.keys(state.names).length,
      eventKeys: Object.keys(state.event).length,
    };
  } finally {
    doc.destroy();
  }
}
