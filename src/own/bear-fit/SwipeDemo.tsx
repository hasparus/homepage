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
    hours: hours(16, 19),
    initials: "W",
    tint: "linear-gradient(145deg, oklch(84% 0.08 65), oklch(62% 0.11 45))",
  },
];

const EVERYONE_ELSE = FRIENDS.reduce((mask, friend) => mask & friend.hours, -1);

const DISTANCE_THRESHOLD = 64;
const VELOCITY_THRESHOLD = 0.2;
/** Overshoots by ~10% so the row springs back instead of gliding to a stop. */
const SPRING =
  "linear(0 0%, 0.5007 7.21%, 0.7803 12.29%, 0.8883 14.93%, 0.9724 17.63%, 1.0343 20.44%, 1.0754 23.44%, 1.0898 25.22%, 1.0984 27.11%, 1.1014 29.15%, 1.0989 31.4%, 1.0854 35.23%, 1.0196 48.86%, 1.0043 54.06%, 0.9956 59.6%, 0.9925 68.11%, 1 100%)";

const SETTLE = `transform 420ms ${SPRING}`;
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
    <div class="mx-auto w-[340px] max-w-full rounded-lg border-2 border-gray-100 bg-white p-3 [--busy:#71717a] [--free:#16a34a] dark:border-gray-800 dark:bg-gray-950 dark:[--busy:#a1a1aa] dark:[--free:#4ade80]">
      <p class="mb-2 flex justify-between font-mono text-sm text-gray-500 dark:text-gray-400">
        Thursday
        <span class="text-gray-400 dark:text-gray-500">← busy · free →</span>
      </p>

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

      <p class="mt-3 border-t border-gray-100 pt-3 font-mono text-sm text-gray-500 tabular-nums dark:border-gray-800 dark:text-gray-400">
        you & {FRIENDS.map((friend) => friend.initials).join(" & ")} ={" "}
        <span class="text-gray-900 dark:text-gray-100">
          {shared()
            ? HOURS.filter((hour) => shared() & hours(hour))
                .map((hour) => `${hour}:00`)
                .join(", ")
            : "∅"}
        </span>
      </p>
    </div>
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

  onMount(() => {
    const settle = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? SETTLE_REDUCED
      : SETTLE;

    const gesture = new DragGesture(
      node,
      ({ active, direction: [dx], last, movement: [mx], velocity: [vx] }) => {
        if (active) {
          node.style.transition = "none";
          node.style.transform = `translate3d(${mx}px, 0, 0)`;
          track.style.opacity = String(
            Math.min(Math.abs(mx) / DISTANCE_THRESHOLD, 1),
          );
          track.style.backgroundColor = mx > 0 ? "var(--free)" : "var(--busy)";
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
    <li class="relative isolate overflow-hidden rounded-md">
      <div
        aria-hidden="true"
        class="absolute inset-0 -z-10 opacity-0 transition-opacity duration-100"
        ref={track}
      />
      <button
        aria-label={`${props.hour}:00`}
        aria-pressed={props.free}
        class="flex h-11 w-full cursor-grab touch-pan-y items-center gap-3 rounded-md bg-white px-2 text-left transition-[background-color] duration-150 ease-out select-none active:cursor-grabbing dark:bg-gray-950"
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
        <span class="w-14 font-mono text-sm tabular-nums">{props.hour}:00</span>
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
          class="ml-auto text-xs text-gray-400 dark:text-gray-500"
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
