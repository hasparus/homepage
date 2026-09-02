import { For, Index } from "solid-js";

import { Cursor } from "./Cursor";

const ACCENT = "#05e";
const DAYS = Array.from({ length: 26 }, (_, i) => i + 4); // Sep 4–29, 2024
const PADDING_DAYS = 2; // Sep 4 is a Wednesday
const MINE = [9, 10, 11, 13];
const PEOPLE = [
  { dates: MINE, name: "you" },
  { dates: [10, 11, 12, 18, 19, 25, 26], name: "Wojtek" },
  { dates: [10, 11, 17, 18, 19, 25], name: "Piotr" },
];
const CURSOR_ON = 18;

/** 1200×630 social card: bear-fit's dialog, mid-paint. Screenshot with `node scripts/og/shoot.mjs bear-fit`. */
export function OgImage() {
  const fillOf = (day: number) =>
    PEOPLE.filter((p) => p.dates.includes(day)).length / PEOPLE.length;

  return (
    <div
      id="og"
      class="flex h-[630px] w-[1200px] items-center justify-center overflow-hidden font-[Czikago,sans-serif] text-black [--cursor:#7c3aed]"
      style={{
        background:
          "linear-gradient(90deg, #fff 21px, transparent 1%) 50%, linear-gradient(#fff 21px, transparent 1%) 50%, #000",
        "background-size": "22px 22px",
      }}
    >
      <div class="relative w-[340px] zoom-[1.32] rounded-sm border-2 border-black bg-white p-[10px] shadow-[2px_2px_#000]">
        <p class="font-mono text-sm">Calendar</p>
        <h1 class="mb-4 text-base leading-[1.3333] font-normal">
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
                {day === CURSOR_ON && (
                  <div class="absolute top-[26px] left-[24px] [--cursor:#7c3aed]">
                    <Cursor name="Piotr" state="idle" />
                  </div>
                )}
              </div>
            )}
          </For>
        </div>

        <dl class="grid gap-0.5 font-mono text-sm text-gray-500">
          <For each={PEOPLE}>
            {(person) => (
              <div
                class="flex justify-between"
                classList={{ "text-black": person.name === "you" }}
              >
                <dt>{person.name === "you" ? "✓ you" : person.name}</dt>
                <dd class="tabular-nums">{person.dates.length}</dd>
              </div>
            )}
          </For>
        </dl>
      </div>
    </div>
  );
}
