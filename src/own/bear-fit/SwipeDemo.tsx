import { DragGesture } from "@use-gesture/vanilla";
import { createSignal, For, onCleanup, onMount } from "solid-js";

const HOURS = [16, 17, 18, 19, 20, 21, 22, 23];

/** Bits `from` through `to`, inclusive. `hours(19)` is a single hour. */
const hours = (from: number, to = from) => ((1 << (to - from + 1)) - 1) << from;

const FRIENDS = [
  { hours: hours(17, 20), initials: "MK" },
  { hours: hours(18, 22), initials: "AP" },
  { hours: hours(16, 19), initials: "JW" },
];

const EVERYONE_ELSE = FRIENDS.reduce((mask, friend) => mask & friend.hours, -1);

const DISTANCE_THRESHOLD = 64;
const VELOCITY_THRESHOLD = 0.2;
const SETTLE = "transform 320ms cubic-bezier(0.23, 1, 0.32, 1)";

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
        you & MK & AP & JW ={" "}
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
        node.style.transition = SETTLE;
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
        class="flex h-11 w-full cursor-grab touch-pan-y items-center gap-3 rounded-md border-l-4 border-transparent bg-white px-2 text-left transition-[background-color,border-color,transform] duration-150 ease-out select-none active:cursor-grabbing dark:bg-gray-950"
        ref={node}
        style={{
          "background-color": props.free
            ? "color-mix(in oklab, var(--free) 12%, transparent)"
            : props.busy
              ? "color-mix(in oklab, var(--busy) 12%, transparent)"
              : undefined,
          "border-left-color": props.free
            ? "var(--free)"
            : props.busy
              ? "var(--busy)"
              : undefined,
        }}
        type="button"
        onClick={() => props.onDecide(props.free ? "busy" : "free")}
      >
        <span class="w-14 font-mono text-sm tabular-nums">{props.hour}:00</span>
        <span class="flex -space-x-1">
          <For each={availableFriends()}>
            {(friend) => (
              <span class="flex size-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-700 ring-2 ring-white dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-950">
                {friend.initials}
              </span>
            )}
          </For>
        </span>
        <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">
          {props.free ? "free" : props.busy ? "busy" : ""}
        </span>
      </button>
    </li>
  );
}
