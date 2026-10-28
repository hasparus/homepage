import { createMemo, createSignal, For, Index, onMount } from "solid-js";

import {
  compileTimeline,
  CURSOR_EASE,
  cubicBezier,
  ENTER_OFFSET,
  FADE,
  type Step,
  FADE_EASE,
} from "./choreography";
import { Cursor, PRESSED_SCALE } from "./Cursor";

const ACCENT = "#05e";
const DAYS = Array.from({ length: 26 }, (_, i) => i + 4); // Sep 4–29, 2024
const PADDING_DAYS = 2; // Sep 4 is a Wednesday
const MINE = [9, 10, 11, 13];
const WOJTEK = [10, 11, 12, 18, 19, 25, 26];

const PATTERN: Step<number>[] = [
  { date: 10, travel: 560 },
  { date: 11, held: true, travel: 190 },
  { date: 19, travel: 440 },
  { date: 25, travel: 440 },
  { date: 17, travel: 520 },
  { date: 18, held: true, travel: 190 },
];
const TIMELINE = compileTimeline(PATTERN);
const PAINTED_AT = new Map(TIMELINE.marks.map(({ at, date }) => [date, at]));

const CURSOR_IN_CELL = { x: 24, y: 26 };

const cellOf = (day: number) => {
  const i = 7 + PADDING_DAYS + day - DAYS[0]!;
  return { col: i % 7, row: Math.floor(i / 7) };
};

const glide = cubicBezier(CURSOR_EASE);
const easeOut = cubicBezier(FADE_EASE);
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
/** Progress at `t` of the widget's fade transition that started at `at`. */
const fade = (t: number, at: number) => easeOut(clamp01((t - at) / FADE));

/** CalendarDemo's cursor and fills at `t`, computed instead of transitioned so any frame can be shot. */
const sceneAt = (t: number) => {
  const move =
    TIMELINE.moves.findLast((m) => m.start <= t) ?? TIMELINE.moves[0]!;
  const p = glide(clamp01((t - move.start) / move.travel));
  const from = cellOf(move.from ?? move.to);
  const to = cellOf(move.to);
  const pressed = TIMELINE.presses.reduce(
    (sum, [down, up]) => sum + fade(t, down) - fade(t, up),
    0,
  );
  return {
    cursor: {
      col: from.col + (to.col - from.col) * p,
      enter: move.from === undefined ? 1 - p : 0,
      opacity: fade(t, TIMELINE.showAt) - fade(t, TIMELINE.hideAt),
      row: from.row + (to.row - from.row) * p,
      scale: 1 - (1 - PRESSED_SCALE) * pressed,
    },
    piotr: (day: number) => {
      const at = PAINTED_AT.get(day);
      return at === undefined ? 0 : fade(t, at) - fade(t, TIMELINE.clearAt);
    },
    piotrCount: TIMELINE.marks.filter(
      ({ at }) => at <= t && t < TIMELINE.clearAt,
    ).length,
  };
};

/**
 * 1200×630 social card: bear-fit's dialog, mid-paint. `window.ogScene.seek(ms)` scrubs the loop.
 * Shoot with `node scripts/og/shoot.mjs bear-fit --video`.
 */
export function OgImage() {
  const [t, setT] = createSignal(TIMELINE.settledAt);
  onMount(() => {
    window.ogScene = {
      duration: TIMELINE.end,
      seek: (ms) => setT(ms % TIMELINE.end),
    };
  });

  const scene = createMemo(() => sceneAt(t()));
  const people = [
    {
      count: () => MINE.length,
      fill: (day: number) => +MINE.includes(day),
      me: true,
      name: "you",
    },
    {
      count: () => WOJTEK.length,
      fill: (day: number) => +WOJTEK.includes(day),
      name: "Wojtek",
    },
    {
      count: () => scene().piotrCount,
      fill: (day: number) => scene().piotr(day),
      name: "Piotr",
    },
  ];
  const fillOf = (day: number) =>
    people.reduce((sum, person) => sum + person.fill(day), 0) / people.length;

  return (
    <div
      id="og"
      class="flex h-[630px] w-[1200px] items-center gap-14 overflow-hidden px-16 font-[Czikago,sans-serif] text-black [--cursor:oklch(58%_0.2_18)]"
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
              left: `calc(${CURSOR_IN_CELL.x}px + (100% - 40px) * ${scene().cursor.col / 6} + ${ENTER_OFFSET.x * scene().cursor.enter}rem)`,
              opacity: scene().cursor.opacity,
              scale: scene().cursor.scale,
              top: `calc(${CURSOR_IN_CELL.y}px + var(--spacing) * 11 * ${scene().cursor.row} + ${ENTER_OFFSET.y * scene().cursor.enter}rem)`,
            }}
          >
            <Cursor name="Piotr" state="idle" />
          </div>
        </div>

        <dl class="grid gap-0.5 font-mono text-sm text-gray-500">
          <For each={people}>
            {(person) => (
              <div
                class="flex justify-between"
                classList={{ "text-black": person.me }}
              >
                <dt>{person.me ? `✓ ${person.name}` : person.name}</dt>
                <dd class="tabular-nums">{person.count()}</dd>
              </div>
            )}
          </For>
        </dl>
      </div>
    </div>
  );
}
