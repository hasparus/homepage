import { DragGesture } from "@use-gesture/vanilla";
import { createSignal, For, onCleanup, onMount } from "solid-js";

const HOURS = [17, 18, 19, 20, 21];

/** Bits `from` through `to`, inclusive. `hours(19)` is a single hour. */
const hours = (from: number, to = from) => ((1 << (to - from + 1)) - 1) << from;

const FRIENDS = [
  {
    hours: hours(17, 20),
    initials: "B",
    tint: "linear-gradient(145deg, oklch(80% 0.07 255), oklch(57% 0.1 268))",
  },
  {
    hours: hours(18, 22),
    initials: "P",
    tint: "linear-gradient(145deg, oklch(82% 0.07 155), oklch(58% 0.1 168))",
  },
  {
    hours: hours(16, 19) | hours(21),
    initials: "M",
    tint: "linear-gradient(145deg, oklch(84% 0.08 65), oklch(62% 0.11 45))",
  },
];

const EVERYONE_ELSE = FRIENDS.reduce((mask, friend) => mask & friend.hours, -1);

const DISTANCE_THRESHOLD = 32;
const VELOCITY_THRESHOLD = 0.2;
/** Damped spring, ~4.6% overshoot — enough to feel elastic, not bouncy. */
const SPRING =
  "linear(0 0%, 0.0503 4.5%, 0.1697 9.1%, 0.3208 13.6%, 0.4773 18.2%, 0.6226 22.7%, 0.7475 27.3%, 0.8481 31.8%, 0.9244 36.4%, 0.9786 40.9%, 1.0140 45.5%, 1.0346 50%, 1.0441 54.5%, 1.0459 59.1%, 1.0427 63.6%, 1.0367 68.2%, 1.0297 72.7%, 1.0225 77.3%, 1.0160 81.8%, 1.0105 86.4%, 1.0061 90.9%, 1.0029 95.5%, 1 100%)";

const SETTLE = `transform 260ms ${SPRING}`;
const SETTLE_REDUCED = "transform 150ms ease-out";

export function SwipeDemo() {
  const [free, setFree] = createSignal(0);
  const [busy, setBusy] = createSignal(0);

  const decide = (hour: number, verdict: "busy" | "free") => {
    const bit = hours(hour);
    setFree((prev) => (verdict === "free" ? prev | bit : prev & ~bit));
    setBusy((prev) => (verdict === "busy" ? prev | bit : prev & ~bit));
  };

  const shared = () => free() & EVERYONE_ELSE;

  return (
    <section class="flex flex-col items-center">
      <article class="mx-auto w-[340px] max-w-full rounded-lg border-2 border-gray-100 bg-white [--busy:var(--color-gray-100)] [--free:#16a34a] dark:border-gray-800 dark:bg-gray-950 dark:[--busy:var(--color-gray-600)] dark:[--free:#4ade80]">
        <header class="flex justify-between p-2 font-mono text-sm text-gray-500 dark:text-gray-400">
          Thursday
          <span class="text-gray-400 dark:text-gray-500">← busy · free →</span>
        </header>

        <ul>
          <For each={HOURS}>
            {(hour) => (
              <SlotRow
                busy={(busy() & hours(hour)) !== 0}
                free={(free() & hours(hour)) !== 0}
                hour={hour}
                onDecide={(verdict) => decide(hour, verdict)}
              />
            )}
          </For>
        </ul>
      </article>
      <footer class="mt-2 font-mono text-sm tabular-nums">
        you & {FRIENDS.map((friend) => friend.initials).join(" & ")} ={" "}
        <span class="text-gray-900 dark:text-gray-100">
          {shared()
            ? HOURS.filter((hour) => shared() & hours(hour))
                .map((hour) => `${hour}:00`)
                .join(", ")
            : "∅"}
        </span>
      </footer>
    </section>
  );
}

interface SlotRowProps {
  busy: boolean;
  free: boolean;
  hour: number;
  onDecide: (verdict: "busy" | "free") => void;
}

function SlotRow(props: SlotRowProps) {
  let node!: HTMLButtonElement;
  let track!: HTMLDivElement;
  let trackLabel!: HTMLSpanElement;

  onMount(() => {
    const settle = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? SETTLE_REDUCED
      : SETTLE;

    const gesture = new DragGesture(
      node,
      // eslint-disable-next-line solid/reactivity -- a DOM listener, so props are read when it fires
      ({ active, direction: [dx], last, movement: [mx], velocity: [vx] }) => {
        if (active) {
          const verdict = mx > 0 ? "free" : "busy";
          const color = `var(--${verdict})`;

          node.style.transition = "none";
          node.style.transform = `translate3d(${mx}px, 0, 0)`;
          track.style.opacity = String(
            Math.min(Math.abs(mx) / DISTANCE_THRESHOLD, 1),
          );
          track.style.backgroundColor = `color-mix(in oklab, ${color} 18%, transparent)`;
          track.style.color = color;
          track.style.justifyContent = mx > 0 ? "flex-start" : "flex-end";
          trackLabel.textContent = verdict;
          return;
        }

        if (!last) return;

        track.style.opacity = "0";
        node.style.transition = settle;
        node.style.transform = "translate3d(0, 0, 0)";

        const flung =
          Math.abs(mx) > DISTANCE_THRESHOLD ||
          (vx > VELOCITY_THRESHOLD && Math.abs(mx) > 16);

        if (flung) props.onDecide(dx > 0 || mx > 0 ? "free" : "busy");
      },
      { axis: "x", filterTaps: true },
    );

    onCleanup(() => gesture.destroy());
  });

  const availableFriends = () =>
    FRIENDS.filter((friend) => friend.hours & hours(props.hour));

  return (
    <li class="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        class="absolute inset-0 -z-10 flex items-center px-1 text-xs font-medium opacity-0 transition-opacity duration-100"
        ref={track}
      >
        <span ref={trackLabel} />
      </div>
      <button
        aria-label={`${props.hour}:00`}
        aria-pressed={props.free}
        class="flex h-11 w-full cursor-grab touch-pan-y items-center gap-2 bg-white px-2 text-left transition-[background-color] duration-150 ease-out select-none active:cursor-grabbing dark:bg-gray-950"
        ref={node}
        style={{
          "background-color": props.free
            ? "color-mix(in oklab, var(--free) 14%, transparent)"
            : props.busy
              ? "color-mix(in oklab, var(--busy) 14%, transparent)"
              : undefined,
        }}
        type="button"
        onClick={() => props.onDecide(props.free ? "busy" : "free")}
      >
        <span class="text-xs tabular-nums">{props.hour}:00</span>
        <span class="flex -space-x-1">
          <For each={availableFriends()}>
            {(friend) => (
              <span
                class="flex size-6 items-center justify-center rounded-full text-[11px] font-medium text-white ring-2 ring-white dark:ring-gray-950"
                style={{ "background-image": friend.tint }}
              >
                {friend.initials}
              </span>
            )}
          </For>
        </span>
        <span
          class="ml-auto text-xs text-white"
          style={{
            color: props.free
              ? "var(--free)"
              : props.busy
                ? "var(--busy)"
                : undefined,
          }}
        >
          {props.free ? "free" : props.busy ? "busy" : ""}
        </span>
      </button>
    </li>
  );
}
