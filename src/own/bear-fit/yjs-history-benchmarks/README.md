# Yjs history replay benchmarks

The y-travelling post claims that replaying a whole update log on every slider
move gets slow, and that caching plain calendar states fixes it. These are the
measurements behind that claim. The work is done; nothing here is a plan.

Audited at `e1bf29d` against Yjs 13.6.24, with the article comparison rerun at
`f8286b9`. Hardware throughout is an M1 Pro on darwin arm64, Node 24.13.0.

## What the post quotes

The post gives three numbers: about 59 ms per backward step, 24 ms to build the
cache, and below 0.1 ms for a cached lookup. They come from
`results-article-browser.json`, at 10,000 sequential records in headless
Chromium under 4x CPU throttling. The unrounded medians are 59.4 ms for naive
replay, 24.3 ms for cache construction, and below the timer's useful resolution
for lookups.

That last one is not zero work. It is work too small for the browser's clock to
separate from noise, and the post should not be read as claiming otherwise.

The benchmarked file is `src/code-blocks/y-travelling/cacheCalendarHistory.ts`,
the same file the post imports into its code block. Earlier runs measured a
separate implementation of the same algorithm; this one does not.

## Strategies

Six ways to show an old version, all at 10,000 sequential records, medians from
the browser run. Setup is counted, not hidden.

| Strategy                                 |   Setup | First backward seek | Further backward | Further forward |
| ---------------------------------------- | ------: | ------------------: | ---------------: | --------------: |
| Fresh replay, as the demo does it        | <0.1 ms |             60.8 ms |          60.9 ms |         60.3 ms |
| Fresh replay in one transaction          | <0.1 ms |             17.7 ms |          17.8 ms |         17.6 ms |
| Reuse document forward, rebuild backward | <0.1 ms |             16.9 ms |          17.6 ms |         <0.1 ms |
| Encoded checkpoints every 32 records     | 28.9 ms |              4.6 ms |           4.4 ms |         <0.1 ms |
| Cache plain calendar states              | 24.2 ms |             <0.1 ms |          <0.1 ms |         <0.1 ms |
| Yjs snapshots with `gc: false`           | 28.6 ms |              9.2 ms |           8.1 ms |          8.1 ms |

Batching the existing replay loop inside one `doc.transact` is the small change:
it keeps the helper stateless and still cuts the 10,000-record sequential case
by about 3.4x. Caching the last 250 calendar states is the change that makes
scrubbing smooth in both directions.

Neither generalises. This calendar holds three small maps and the previews are
read-only. An editor that needs a live `Y.Doc` for every preview gets nothing
from either.

## Where it stops mattering

At 250 records the current implementation's backward median is 1.9 ms, and at
1,000 it is 6.3 ms. Only at 10,000 does even the batched version threaten a 16.7
ms frame, and that is before anything renders.

The real demo held one stored record and 332 update bytes when I sampled it.
There is no performance problem at that size. Everything above is a scaling test
against generated history.

The adversarial fixture is worse than the sequential one. Four clients editing
independently, groups of 13 updates reordered, one duplicate inserted: at 10,001
records, fresh backward replay took 191.4 ms and checkpoints 6.9 ms, while
cached lookup stayed below 0.1 ms. Building that cache took 164.4 ms. Moving
work out of the slider handler does not delete it. A rebuild that large should
yield between batches or run off the main thread.

The 251 cached states serialise to roughly 469-472 KB as JSON in the
10,000-record fixtures. That is JSON size, not heap. Forced-GC heap sampling was
noisy enough to produce negative deltas for some strategies, so I am not
reporting memory comparisons at all. Yjs snapshots also pin an uncollected
document, which their small encoded size hides.

## Applying an old update does not rewind anything

`undo-probes.mjs` demonstrates the trap directly:

1. Apply an update that marks a day available.
2. Apply an update that deletes the mark.
3. Undo the deletion. The mark comes back.
4. Apply the original deletion update again. The mark stays.

Undo writes new CRDT operations. It does not rewind the operation history. The
document already knows that deletion, so replaying its bytes deletes nothing.
This is why bear-fit restores a version by reading its application data and
writing it into the live document as a fresh change.

Driving history through `UndoManager` alone looked attractive: after 27-43 ms of
setup, backward undo cost about 0.01 ms in Node at 10,000 sequential records.
Both variants then produced wrong calendars on the reordered fixture. The
default first differed at prefix 9, and `ignoreRemoteMapChanges: true` at
prefix 36. Fast and wrong, so both are rejected. Counterexamples are in
`results-undo.json`.

Native `Y.snapshot` and `Y.createDocFromSnapshot` passed every sampled state,
reordered fixture included. They need `gc: false` on the source and still build
a document per snapshot, which is why they lose to caching plain data here.

## Validating persistence, not previews

A separate cache, implemented at `f8286b9` in
`src/own/bear-fit/historyPersistence.ts`, avoids re-replaying a history response
that has not changed. Each widget keeps the last successfully reconstructed log
and its calendar fingerprint. The clocks and bytes must match exactly, in order,
before that fingerprint is reused, and the live calendar is re-fingerprinted on
every check, so a stale "caught up" verdict can never be reused.

`run-validation.mjs` compares the original check against the shipped helper.
Nine samples per case after two warm-up rounds, case order rotated, garbage
collected outside the timed section. Medians, from
`results-validation-node.json`:

| Generated history                   | Original check | New first response | Identical response | Changed response |
| ----------------------------------- | -------------: | -----------------: | -----------------: | ---------------: |
| 250 sequential records              |        1.66 ms |            1.59 ms |            0.14 ms |          1.60 ms |
| 251 reordered/concurrent records    |        6.25 ms |            6.60 ms |            0.17 ms |          6.85 ms |
| 1,000 sequential records            |        5.28 ms |            5.32 ms |            0.15 ms |          5.34 ms |
| 1,001 reordered/concurrent records  |       16.36 ms |           17.87 ms |            0.18 ms |         17.71 ms |
| 10,000 sequential records           |       25.09 ms |           27.10 ms |            0.38 ms |         26.36 ms |
| 10,001 reordered/concurrent records |       63.74 ms |           67.74 ms |            0.35 ms |         70.84 ms |

An identical response gets cheap. A changed one gets slightly more expensive
than before, which is the trade. The cache owns copies of the records, so a
caller mutating its own arrays cannot make changed history look unchanged.
Changed or appended history replays in full and only replaces the cache after
the replay succeeds. Temporary documents are destroyed, errors included.

Timings cover comparison, replay and copying on a miss, and fingerprinting the
live calendar. They exclude fetching, decoding, model work, rendering and
fixture preparation. Synthetic Node numbers, not browser responsiveness, and no
evidence at all about how often production actually sends duplicate responses.

The retained cache holds 98,523 update bytes for the 10,000-record sequential
fixture and 108,429 for the reordered one, plus record objects, typed-array
overhead, clocks and the fingerprint. Again: not heap measurements. One history
is cached and no `Y.Doc` is kept alive.

## What the original audit found in the demo

| Finding                                                      | Evidence                                                    | Impact                                                                                                                            |
| ------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Every slider event replays its whole prefix                  | `CalendarHistoryDemo.tsx:283-306`, `replayHistory.ts:11-15` | Main-thread work grows with total retained history, despite a 250-version UI window                                               |
| Refresh revalidates by replaying the fetched log again       | `CalendarHistoryDemo.tsx:164-209`                           | Every refresh and storage-lag retry repeats the same replay                                                                       |
| Cached history needs identity stronger than clocks or length | `calendarHistoryModel.ts:53-74,94-112`                      | Compaction can change bytes while reusing clocks, so a stale cache could show the wrong version or apply a tail to the wrong base |

These come straight from the cited code and the experiments above. No server or
network throughput was measured, and nothing outside these components was
reviewed.

## Reproducing

Run from the repository root. Nothing here writes to production or needs extra
dependencies.

```sh
# the article comparison
node --expose-gc --import tsx src/own/bear-fit/yjs-history-benchmarks/run-node.mjs \
  --sizes=250,1000,10000 --strategies=article-cache \
  --out=src/own/bear-fit/yjs-history-benchmarks/results-article-node.json

node src/own/bear-fit/yjs-history-benchmarks/run-browser.mjs --rate=4 --sizes=10000 \
  --sequential-only --strategies=fresh,article-cache \
  --out=src/own/bear-fit/yjs-history-benchmarks/results-article-browser.json

# the full strategy comparison
node --expose-gc --import tsx src/own/bear-fit/yjs-history-benchmarks/run-node.mjs \
  --sizes=250,1000 --steps=24 --repeats=3 \
  --out=src/own/bear-fit/yjs-history-benchmarks/results-node-small.json

node --expose-gc --import tsx src/own/bear-fit/yjs-history-benchmarks/run-node.mjs \
  --sizes=10000 --steps=24 --repeats=3 \
  --out=src/own/bear-fit/yjs-history-benchmarks/results-node-large.json

node --import tsx src/own/bear-fit/yjs-history-benchmarks/undo-probes.mjs

node --expose-gc --import tsx src/own/bear-fit/yjs-history-benchmarks/run-validation.mjs

# needs the Astro dev server on port 4323
node src/own/bear-fit/yjs-history-benchmarks/run-browser.mjs --rate=4
```

The browser runner serves an empty page through Playwright interception and
imports a temporary bundle of `benchmark.mjs`. It never touches the live
calendar. Set `HISTORY_DEMO_URL` to point at a different local origin.

Fixtures model four participants over 21 days. Each run does 24 seeks and three
repetitions after a warm-up, reporting setup, first seek and later seeks
separately, across forward, backward, alternating and random paths within the
last 250 versions. Expected states come from replaying updates one at a time.
Validation visits every window position up to 1,000 records and 65 positions per
strategy beyond that. Passing these fixtures is evidence, not proof for
arbitrary Yjs types or logs.

The browser numbers exclude DOM updates, paint, HTTP latency and WebSocket work.
A 4x CPU throttle in headless Chromium is not a phone.
