# Yjs history replay benchmarks

Numbers behind the [y-travelling] post. M1 Pro, Node 24.13.0, Yjs 13.6.24.
Browser runs are headless Chromium with 4x CPU throttling.

My first run of the article comparison overlapped a Node benchmark and gave 96
ms and 59 ms for two workloads that do the same work. Everything below is from
reruns with the machine to myself. Run the phases one at a time.

## Strategies

10,000 updates, backward seeks through the last 250 versions, Chromium, medians
of 9 repeats.

| Strategy                            |   Setup |    Seek |
| ----------------------------------- | ------: | ------: |
| Replay updates one by one           |       0 | 61.3 ms |
| `replayHistory`, one `doc.transact` |       0 | 17.2 ms |
| Reuse the doc forward, rebuild back |  0.1 ms | 17.3 ms |
| Encoded checkpoint every 32 updates | 26.8 ms |  4.4 ms |
| Cache 250 plain calendar states     | 30.8 ms | <0.1 ms |
| The post's `cacheCalendarHistory`   | 31.1 ms | <0.1 ms |
| Yjs snapshots with `gc: false`      | 31.5 ms |  8.1 ms |

The browser can't time anything under 0.1 ms. Node says a cached seek is about
80 ns.

The transaction is the cheap win, 3.6x. The cache is the one that makes the
slider smooth.

## Width

The cache stores 250 copies of the calendar, so it pays for how wide the
calendar is. Log length barely changes its size. Node, 10,000 updates:

| Calendar            |  Keys |   Checkpoints | Plain states cache | Yjs snapshots |
| ------------------- | ----: | ------------: | -----------------: | ------------: |
| 4 people, 3 weeks   |    41 |  8 ms, 228 KB |       9 ms, 469 KB |  10 ms, 53 KB |
| 12 people, 2 months |   355 |  9 ms, 469 KB |      30 ms, 3.7 MB | 10 ms, 205 KB |
| 40 people, a year   | 5,501 | 29 ms, 2.9 MB |      583 ms, 56 MB | 30 ms, 1.4 MB |

A big real bear-fit calendar is 12 people over two months. The cache is fine
there. At a year with 40 people, use checkpoints.

The 12-person run happened with some other load on the machine, so its timings
are a bit pessimistic.

## Length

Node, backward seek:

| Updates | One by one | `replayHistory` | Cache build |
| ------: | ---------: | --------------: | ----------: |
|  10,000 |    16.8 ms |          5.0 ms |      9.9 ms |
|  50,000 |    85.9 ms |         28.5 ms |     32.7 ms |

At 50,000 `replayHistory` drops frames, so that's where the cache earns its
keep. With four clients editing out of order it's worse: 197 ms one by one, 125
ms to build the cache.

The real demo had one stored update, 332 bytes. Everything here is generated.

## Undo doesn't rewind

`undo-probes.mjs`:

1. Mark a day available.
2. Delete the mark.
3. Undo the delete. The mark is back.
4. Apply the original delete update again. The mark stays.

Undo writes new operations. The doc has already seen that delete, so replaying
it does nothing. That's why bear-fit restores a version by writing its data as a
new change.

Scrubbing with `UndoManager` was fast, about 0.01 ms a step, and wrong on
reordered updates: off from update 9, or update 36 with
`ignoreRemoteMapChanges`. Counterexamples are in `results-undo.json`.

## Persistence check

`historyPersistence.ts` skips re-replaying a history response it has already
seen. Identical responses drop to 0.14-0.38 ms. Changed ones cost about what
they did before, sometimes a bit more. Numbers in
`results-validation-node.json`.

## Caveats

- 4x throttling isn't a phone.
- Cache sizes are JSON bytes, not heap. The forced-GC heap numbers in the JSON
  are noise, some of them negative.
- Passing the generated histories is evidence, not proof for every Yjs log.

## Running

From the repo root. The browser runs need the Astro dev server on port 4323.

```sh
B=src/own/bear-fit/yjs-history-benchmarks

node --expose-gc --import tsx $B/run-node.mjs --sizes=250,1000,10000 \
  --strategies=fresh,article-cache --out=$B/results-article-node.json
node $B/run-browser.mjs --sizes=10000 --sequential-only \
  --strategies=fresh,article-cache --out=$B/results-article-browser.json
node $B/run-browser.mjs --out=$B/results-browser-4x.json

node --expose-gc --import tsx $B/run-node.mjs --sizes=10000,50000 \
  --out=$B/results-node-large.json
node --expose-gc --import tsx $B/run-node.mjs --sizes=10000 --users=12 \
  --days=61 --out=$B/results-width-bear-fit.json
node --expose-gc --import tsx $B/run-node.mjs --sizes=10000 --users=40 \
  --days=365 --out=$B/results-width-sweep.json

node --import tsx $B/undo-probes.mjs
node --expose-gc --import tsx $B/run-validation.mjs
```

[y-travelling]: ../../../../posts/y-travelling.mdx
