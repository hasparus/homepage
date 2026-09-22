# Yjs history replay performance audit

Originally audited at `e1bf29d`, using Yjs 13.6.24. The article includes a
typed, tested optimization example alongside the naive version. The live demo
still replays each slider selection; it now caches persistence-validation
results for identical history responses.

## Live validation follow-up

Implemented against `f8286b9` in `src/own/bear-fit/historyPersistence.ts`. Each
widget owns one cache of the last successfully reconstructed log and its
calendar fingerprint. Exact ordered clocks and bytes must match before that
fingerprint can be reused. Every check still fingerprints the current live
calendar: the previous caught-up verdict is never reused.

The cache owns copies of the records, so later caller mutations cannot make
changed history look identical. Changed or appended history gets a full replay
and replaces the cache only after successful reconstruction. Temporary documents
are destroyed, including on errors. Fetching, retries, model transitions, and
slider replay are unchanged. This is not an incremental replay head or a preview
cache.

`run-validation.mjs` compares the original validation code with the actual new
helper. Node 24.13.0, Apple M1 Pro, darwin arm64, Yjs 13.6.24; nine samples per
case after two warm-up rounds, rotating case order and collecting garbage
outside the timed work. Results in `results-validation-node.json` are medians:

| Generated history                   | Original check | New first response | Identical response | Changed response |
| ----------------------------------- | -------------: | -----------------: | -----------------: | ---------------: |
| 250 sequential records              |        1.66 ms |            1.59 ms |            0.14 ms |          1.60 ms |
| 251 reordered/concurrent records    |        6.25 ms |            6.60 ms |            0.17 ms |          6.85 ms |
| 1,000 sequential records            |        5.28 ms |            5.32 ms |            0.15 ms |          5.34 ms |
| 1,001 reordered/concurrent records  |       16.36 ms |           17.87 ms |            0.18 ms |         17.71 ms |
| 10,000 sequential records           |       25.09 ms |           27.10 ms |            0.38 ms |         26.36 ms |
| 10,001 reordered/concurrent records |       63.74 ms |           67.74 ms |            0.35 ms |         70.84 ms |

The first-response column includes reconstruction and owned-copy setup.
Identical/changed cases start with a populated cache; changed means appending
the fixture's last record. Incoming records are freshly allocated before timing.
Measurements include comparison, replay/copying on misses, and live-calendar
fingerprinting, but exclude fetching, decoding, model work, rendering, and
fixture preparation. These are synthetic Node measurements, not browser
responsiveness or production duplicate-response rates. Changed responses can be
slower than before.

The extra retained cache contains 98,523 update bytes for the 10,000-record
sequential fixture and 108,429 bytes for the reordered fixture, plus record
objects, typed-array overhead, clocks, and the fingerprint. Those byte totals
are not heap measurements. Only one history is cached; there is no retained
Y.Doc.

Seven new unit tests verify reuse through reconstruction counts, fresh
live-state comparisons, record mutations, reordered/duplicate records, changed
clocks, truncation, malformed updates, delayed dependencies, and independent
widget lifetimes. A desktop/mobile integration test forces five identical stale
responses after an edit, verifies that catch-up still reports lag, then permits
the current response and verifies recovery. Verification passed: typecheck, 25
relevant unit tests, and 11 calendar browser tests with one intentional skip.
The new helper/tests lint cleanly; the demo retains its two existing Solid
callback warnings.

```sh
node --expose-gc --import tsx src/own/bear-fit/yjs-history-benchmarks/run-validation.mjs
pnpm exec tsx --test src/own/bear-fit/historyPersistence.test.ts
HISTORY_DEMO_URL=http://localhost:4323/y-travelling \
  pnpm exec playwright test e2e/calendar-history.spec.ts --reporter=line --workers=2
```

## Article follow-up

`src/code-blocks/y-travelling/cacheCalendarHistory.ts` is the exact file
imported by the post and benchmarked as `article-cache`. It replays the older
prefix in one transaction, copies the last 250 calendar states with their
clocks, and destroys its temporary document. It does not retain a head document
across fetches; the example rebuilds the cache when history changes.

The fresh comparison is in `results-article-browser.json`. At 10,000 sequential
records, backward-seek medians were 59.4 ms for the naive helper and below 0.1
ms for cached lookup, after 24.3 ms cache construction. The post rounds these to
59 ms and 24 ms. This rerun uses the actual TypeScript example, not a separate
implementation of the same algorithm. The earlier broader comparison below
remains in its original result files.

The new helper passed its three unit tests and the six synthetic Node fixtures
at 250, 1,000 and 10,000 records, with both sequential and reordered concurrent
updates. `results-article-node.json` records those checks. The benchmark adapter
falls back to naive replay for the single base position just outside the cached
window, which the general verifier also visits. Timed slider workloads stay
inside the cache.

Reproduce the article comparison:

```sh
node --expose-gc --import tsx src/own/bear-fit/yjs-history-benchmarks/run-node.mjs \
  --sizes=250,1000,10000 --strategies=article-cache \
  --out=src/own/bear-fit/yjs-history-benchmarks/results-article-node.json

node src/own/bear-fit/yjs-history-benchmarks/run-browser.mjs --rate=4 --sizes=10000 \
  --sequential-only --strategies=fresh,article-cache \
  --out=src/own/bear-fit/yjs-history-benchmarks/results-article-browser.json

pnpm exec tsx --test src/code-blocks/y-travelling/cacheCalendarHistory.test.ts
```

## Recommendation

For a small change, batch the existing replay loop inside one `doc.transact`. It
preserves the stateless helper and improved the 10,000-record sequential case by
about 3.4×.

For smooth scrubbing in both directions, the best candidate for this calendar is
a cache of the last 250 plain calendar states. Build them with one forward pass
through an independent replay document. Keep that document at the latest stored
version to process appended records. Slider changes then select a snapshot
instead of constructing another document.

This recommendation is specific to the demo's small maps and read-only previews.
It is not a replacement for arbitrary Yjs documents or editors that need a live
`Y.Doc` for every preview.

The local demo contained only one stored record, 332 update bytes, when sampled.
There is no evidence of a current performance problem at that size. The larger
results below are synthetic scaling tests.

## Measured results

Apple M1 Pro, Node 24.13.0, and headless Chromium with 4× CPU throttling. The
browser benchmark measures replay plus extraction of plain calendar data. It
does not include DOM updates, rendering, paint, HTTP latency, or WebSocket work.
CPU throttling is not a measurement on a real phone.

Each run uses 24 seeks and three repetitions, after a warm-up. Setup, the first
seek and subsequent seeks are reported separately. Forward, backward,
alternating and random paths use the last 250 versions. Cache setup is included
in the total, not hidden. Timings below are medians from the browser's
sequential 10,000-record case.

| Strategy                                 |   Setup | First backward seek | Further backward seeks | Further forward seeks |
| ---------------------------------------- | ------: | ------------------: | ---------------------: | --------------------: |
| Current fresh replay                     | <0.1 ms |             60.8 ms |                60.9 ms |               60.3 ms |
| Fresh replay in one transaction          | <0.1 ms |             17.7 ms |                17.8 ms |               17.6 ms |
| Reuse document forward, rebuild backward | <0.1 ms |             16.9 ms |                17.6 ms |               <0.1 ms |
| Encoded checkpoints every 32 records     | 28.9 ms |              4.6 ms |                 4.4 ms |               <0.1 ms |
| Cache plain calendar states              | 24.2 ms |             <0.1 ms |                <0.1 ms |               <0.1 ms |
| Yjs snapshots with `gc: false`           | 28.6 ms |              9.2 ms |                 8.1 ms |                8.1 ms |

Values below 0.1 ms are beneath the useful resolution of these browser samples,
not zero work. Forward and backward setup measurements are separate runs;
consult the JSON for each run's first-seek cost and p95.

The current implementation's backward median was 1.9 ms at 250 records and 6.3
ms at 1,000 records. At 10,000 records, even the batched version can exceed a
16.7 ms frame budget before rendering.

A four-client fixture with delayed, reordered records and one duplicate was
slower. At 10,001 records, fresh backward replay took 191.4 ms, checkpoints took
6.9 ms, and calendar-cache lookup remained below 0.1 ms. Calendar-cache
preprocessing took 164.4 ms in that run. Moving this work out of every slider
event does not make the initial work disappear: a large initial rebuild should
yield between batches or run off the main thread.

The 251 cached plain states, including the window's base state, serialized to
approximately 469–472 KB in the 10,000-record fixtures. This is JSON size, not
JavaScript heap usage. Exploratory forced-GC heap measurements were noisy,
including negative deltas for some strategies, so they should not be used for
precise memory comparisons. Native Yjs snapshots also retain an uncollected
document, which their small encoded snapshot sizes do not represent.

## Reverting updates

Applying an older update does not rewind a document. A minimal experiment in
`undo-probes.mjs` also demonstrates why mixing `UndoManager.undo()` with replay
of the original bytes fails:

1. Apply an update that marks a day available.
2. Apply an update that deletes the mark.
3. Undo the deletion. The mark returns.
4. Apply the original deletion update again. The mark stays, rather than
   disappearing.

Undo generates new CRDT operations. It does not put the document's operation
history back where it was. The original deletion is already known to the
document and does not delete the newly restored item.

A separate experiment preloaded the history into `UndoManager`, recorded stack
boundaries, and navigated using undo and redo only. Both default behavior and
`ignoreRemoteMapChanges: true` passed the sequential fixtures. At 10,000
sequential records, backward undo was approximately 0.01 ms in Node after 27–43
ms setup.

However, both variants produced incorrect calendar states in the reordered
four-client fixture. The default variant first differed at prefix 9; the
ignore-remote variant differed at prefix 36. They are therefore rejected as
replacements for arbitrary persisted-prefix replay, regardless of the favorable
sequential timing. Full counterexamples and results are in `results-undo.json`.

Native `Y.snapshot` / `Y.createDocFromSnapshot` passed the sampled states,
including the reordered fixture. They require `gc: false` on the source document
and still create a new document for each requested snapshot. They are a valid
comparison, but are slower here than caching the calendar's plain data.

## Code findings (original audit)

| Finding                                                                | Evidence                                                                                      | Impact                                                                                                                                    | Effort / risk                                         |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Every slider event replays its entire prefix                           | `src/own/bear-fit/CalendarHistoryDemo.tsx:283–306`; `src/own/bear-fit/replayHistory.ts:11–15` | Repeated main-thread work grows with total retained history, despite a 250-version UI window. Measured above.                             | Batching: S / low. Stateful caching: M / medium.      |
| Refresh validates persistence by replaying the whole fetched log again | `CalendarHistoryDemo.tsx:164–209`                                                             | Each refresh and storage-lag retry repeats the same replay work. The benchmark quantifies replay, not complete request latency.           | Reuse an independent stored-history head: M / medium. |
| Cached history needs stronger identity than clocks or array length     | `src/own/bear-fit/calendarHistoryModel.ts:53–74,94–112`                                       | Compaction can change bytes while reusing clocks. Reusing a stale cache could show a different version or apply a tail to the wrong base. | Preserve current byte-prefix checks: M / medium.      |

These findings are high confidence from the cited code and experiments. No
network or server throughput benchmark was performed. This audit did not cover
unrelated components or general application security.

## Conditions for an implementation

The preview benchmark strategies operate on a fixed history array. Integration
of preview caching with refreshing history has not been implemented or
benchmarked; the validation-only cache above is separate. A future preview cache
implementation must:

- Use an independent replay document, never the connected editable document. The
  live document can contain edits absent from storage.
- Reuse a head document only when the incoming log retains the full previous
  clock-and-byte prefix. An identical response should not trigger replay. A
  genuine append should apply only its suffix.
- Rebuild after compaction or replacement, even when clocks or array lengths
  match. Keep the already displayed plain snapshot while rebuilding.
- Publish a new cache only after successful replay. A malformed update must
  leave the previous visible version intact.
- Replay the complete required prefix before collecting the visible window's
  states. Do not batch the entire visible window into one final snapshot and
  lose its intermediate states.
- Retain the current present/past distinction, stable selection, out-of-window
  preview behavior, and disabled historical editing.
- Destroy replaced head documents and dispose of observers. Release the cache on
  unmount.
- Add tests for identical refreshes, append-only refreshes, compaction with
  reused clocks, malformed tails, rapid selection, pending out-of-order
  dependencies and preserved old previews.

The tutorial's stateless helper can remain the readable explanation of prefix
replay and can initialize the cache's base document. A cache is an optional
optimization, not a reason to replace the post with a state-management tutorial.

## Reproduce

Run from the repository root. No new dependencies or production writes are
required.

```sh
node --expose-gc --import tsx src/own/bear-fit/yjs-history-benchmarks/run-node.mjs \
  --sizes=250,1000 --steps=24 --repeats=3 \
  --out=src/own/bear-fit/yjs-history-benchmarks/results-node-small.json

node --expose-gc --import tsx src/own/bear-fit/yjs-history-benchmarks/run-node.mjs \
  --sizes=10000 --steps=24 --repeats=3 \
  --out=src/own/bear-fit/yjs-history-benchmarks/results-node-large.json

node --import tsx src/own/bear-fit/yjs-history-benchmarks/undo-probes.mjs

# Requires the existing Astro development server on port 4323.
node src/own/bear-fit/yjs-history-benchmarks/run-browser.mjs --rate=4
```

The browser runner serves an empty page through Playwright interception and
imports a temporary bundle of the benchmark. It does not interact with the live
calendar. Set `HISTORY_DEMO_URL` to another local development origin if needed.

For the sampled local history, the Node run additionally used
`--history=/tmp/y-history-local.bin`. That file was fetched read-only from the
local backend; synthetic runs do not need it.

Fixtures model four shared participants and 21 days. The adversarial fixture
uses four independently edited documents, reorders groups of 13 updates and
inserts a duplicate. Expected calendar states come from the original per-update
replay semantics. Validation checks forward, reverse and randomized seeks: every
window position for histories up to 1,000 records, and 65 positions per strategy
for larger histories. Passing these fixtures is evidence, not a proof for all
Yjs types or all possible logs.

Existing verification also passed: `pnpm typecheck` and the 15
history/model/server-helper unit tests. The runner files are JavaScript and are
excluded from the TypeScript project.
