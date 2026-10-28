import { createSignal, For, Index, onMount } from "solid-js";

import { Cursor } from "./Cursor";

const ACCENT = "#05e";
const DAYS = Array.from({ length: 26 }, (_, i) => i + 4); // Sep 4–29, 2024
const PADDING_DAYS = 2; // Sep 4 is a Wednesday
const MINE = [9, 10, 11, 13];
const WOJTEK = [10, 11, 12, 18, 19, 25, 26];
const PEOPLE_COUNT = 3;

/** Piotr's pass over the calendar, timed like CalendarDemo's PATTERNS. */
const PATTERN = [
  { day: 10, travel: 560 },
  { day: 11, held: true, travel: 190 },
  { day: 19, travel: 440 },
  { day: 25, travel: 440 },
  { day: 17, travel: 520 },
  { day: 18, held: true, travel: 190 },
];

const CURSOR_IN_CELL = { x: 24, y: 26 };

/** A grid column and row plus pixels, resolved in CSS against the grid's own size. */
const cellPoint = (day: number) => {
  const i = 7 + PADDING_DAYS + day - DAYS[0]!;
  return {
    col: i % 7,
    row: Math.floor(i / 7),
    x: CURSOR_IN_CELL.x,
    y: CURSOR_IN_CELL.y,
  };
};

const easeInOutQuart = (x: number) =>
  x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2;
const easeOut = (x: number) => 1 - (1 - x) ** 2;
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
/** The widget's 150ms ease-out transition, started at `at`. */
const fade = (t: number, at: number) => easeOut(clamp01((t - at) / 150));

type Point = ReturnType<typeof cellPoint>;

/** Replays CalendarDemo's runPattern on a clock, so any frame is a function of time. */
const moves: { from: Point; start: number; to: Point; travel: number }[] = [];
const presses: [down: number, up: number][] = [];
const paintedAt = new Map<number, number>();

const SHOW_AT = 500;
const ENTER_OFFSET = { x: -40, y: 80 };
const firstCell = cellPoint(PATTERN[0]!.day);
let from = {
  ...firstCell,
  x: firstCell.x + ENTER_OFFSET.x,
  y: firstCell.y + ENTER_OFFSET.y,
};
let now = SHOW_AT;
let downAt: number | undefined;
for (const [i, step] of PATTERN.entries()) {
  const to = cellPoint(step.day);
  moves.push({ from, start: now, to, travel: step.travel });
  now += step.travel;
  from = to;
  downAt ??= now;
  paintedAt.set(step.day, now);
  if (!PATTERN[i + 1]?.held) {
    presses.push([downAt, now + 120]);
    downAt = undefined;
    now += 300;
  }
}
/** Every date painted, the cursor resting on the last one. The still og.png. */
const POSTER_AT = now;
const HIDE_AT = now + 900;
const CLEAR_AT = HIDE_AT + 2600;
const DURATION = CLEAR_AT + 700;

const sceneAt = (t: number) => {
  const move = moves.findLast((m) => m.start <= t) ?? moves[0]!;
  const p = easeInOutQuart(clamp01((t - move.start) / move.travel));
  const pressed = presses.reduce(
    (sum, [down, up]) => sum + fade(t, down) - fade(t, up),
    0,
  );
  const lerp = (key: keyof Point) =>
    move.from[key] + (move.to[key] - move.from[key]) * p;
  return {
    cursor: {
      col: lerp("col"),
      row: lerp("row"),
      opacity: fade(t, SHOW_AT) - fade(t, HIDE_AT),
      scale: 1 - 0.12 * pressed,
      x: lerp("x"),
      y: lerp("y"),
    },
    piotr: (day: number) => {
      const at = paintedAt.get(day);
      return at === undefined ? 0 : fade(t, at) - fade(t, CLEAR_AT);
    },
    piotrCount: [...paintedAt.values()].filter((at) => at <= t && t < CLEAR_AT)
      .length,
  };
};

/**
 * 1200×630 social card: bear-fit's dialog, mid-paint. `window.ogScene.seek(ms)` scrubs the loop.
 * Shoot with `node scripts/og/shoot.mjs bear-fit --video`.
 */
export function OgImage() {
  const [t, setT] = createSignal(POSTER_AT);
  onMount(() =>
    Object.assign(window, {
      ogScene: {
        duration: DURATION,
        seek: (ms: number) => setT(ms % DURATION),
      },
    }),
  );

  const scene = () => sceneAt(t());
  const fillOf = (day: number) =>
    (+MINE.includes(day) + +WOJTEK.includes(day) + scene().piotr(day)) /
    PEOPLE_COUNT;

  return (
    <div
      id="og"
      class="flex h-[630px] w-[1200px] items-center gap-14 overflow-hidden px-16 font-[Czikago,sans-serif] text-black [--cursor:oklch(58%_0.2_18)] [&_*]:transition-none!"
      style={{
        background:
          "linear-gradient(90deg, #fff 21px, transparent 1%) 50%, linear-gradient(#fff 21px, transparent 1%) 50%, #000",
        "background-size": "22px 22px",
      }}
    >
      <div class="min-w-0 flex-1 font-[Czikago,sans-serif]">
        <h1 class="text-[2.75rem] leading-[1.12] font-[555] text-balance">
          bear-fit: the simplest UX for syncing humans
        </h1>
        <p class="mt-4 text-2xl tracking-tighter text-gray-600 tabular-nums">
          6 min read · 2026-08-07
        </p>
      </div>
      <div class="relative w-[340px] shrink-0 zoom-[1.32] rounded-sm border-2 border-black bg-white p-[10px] shadow-[2px_2px_#000]">
        <p class="font-mono text-sm">Calendar</p>
        <h1 class="mb-4 text-xl leading-[1.3333] font-normal">
          beers and basketball
        </h1>
        <p class="mb-4 leading-[1.3333]">September</p>

        <div class="relative mb-4 grid grid-cols-[repeat(7,40px)] justify-between gap-1">
          <For each={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}>
            {(name) => (
              <div class="flex h-10 items-center justify-center text-[11.6667px] font-medium opacity-75">
                {name}
              </div>
            )}
          </For>
          <Index each={Array.from({ length: PADDING_DAYS })}>
            {() => <div class="h-10" />}
          </Index>
          <For each={DAYS}>
            {(day) => (
              <div
                class="relative flex size-10 items-center justify-center rounded-md bg-gray-100 aria-pressed:border-[5px] aria-pressed:border-gray-200"
                aria-pressed={MINE.includes(day)}
                style={{
                  color: fillOf(day) > 0.5 ? "white" : "black",
                  "background-color": fillOf(day)
                    ? `hsl(from ${ACCENT} h s l / ${fillOf(day)})`
                    : undefined,
                }}
              >
                {day}
              </div>
            )}
          </For>
          <div
            class="absolute origin-top-left"
            style={{
              left: `calc(${scene().cursor.x}px + (100% - 40px) * ${scene().cursor.col / 6})`,
              opacity: scene().cursor.opacity,
              scale: scene().cursor.scale,
              top: `calc(${scene().cursor.y}px + var(--spacing) * 11 * ${scene().cursor.row})`,
            }}
          >
            <Cursor name="Piotr" state="idle" />
          </div>
        </div>

        <dl class="grid gap-0.5 font-mono text-sm text-gray-500">
          <For
            each={[
              { count: () => MINE.length, name: "✓ you" },
              { count: () => WOJTEK.length, name: "Wojtek" },
              { count: () => scene().piotrCount, name: "Piotr" },
            ]}
          >
            {(person) => (
              <div
                class="flex justify-between"
                classList={{ "text-black": person.name === "✓ you" }}
              >
                <dt>{person.name}</dt>
                <dd class="tabular-nums">{person.count()}</dd>
              </div>
            )}
          </For>
        </dl>
      </div>
    </div>
  );
}
