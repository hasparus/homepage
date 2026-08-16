import { DragGesture } from "@use-gesture/vanilla";
import { createSignal, For, onCleanup, onMount } from "solid-js";

import { Cursor, type CursorState } from "./Cursor";

const HOURS = [17, 18, 19, 20, 21];

/** Bits `from` through `to`, inclusive. `hours(19)` is a single hour. */
const hours = (from: number, to = from) => ((1 << (to - from + 1)) - 1) << from;

const COLLABORATOR_HOURS = hours(16, 19) | hours(21);

/** M edits their own row while you watch, so their mask has to be live. */
const [collaboratorHours, setCollaboratorHours] =
  createSignal(COLLABORATOR_HOURS);

const FRIENDS = [
  {
    hours: () => hours(17, 20),
    initials: "B",
    tint: "linear-gradient(145deg, oklch(80% 0.07 255), oklch(57% 0.1 268))",
  },
  {
    hours: () => hours(18, 22),
    initials: "P",
    tint: "linear-gradient(145deg, oklch(82% 0.07 155), oklch(58% 0.1 168))",
  },
  {
    hours: collaboratorHours,
    initials: "M",
    tint: "linear-gradient(145deg, oklch(84% 0.08 65), oklch(62% 0.11 45))",
  },
];

const everyoneElse = () =>
  FRIENDS.reduce((mask, friend) => mask & friend.hours(), -1);

/** M drops out of the early slots and joins the late one, then starts over. */
const CURSOR_SCRIPT = [17, 18, 20];

const REST_BEFORE_REPLAY = 3000;
const SWIPE = 70;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DISTANCE_THRESHOLD = 32;
const VELOCITY_THRESHOLD = 0.2;
/** Damped spring, ~4.6% overshoot — enough to feel elastic, not bouncy. */
const SPRING =
  "linear(0 0%, 0.0503 4.5%, 0.1697 9.1%, 0.3208 13.6%, 0.4773 18.2%, 0.6226 22.7%, 0.7475 27.3%, 0.8481 31.8%, 0.9244 36.4%, 0.9786 40.9%, 1.0140 45.5%, 1.0346 50%, 1.0441 54.5%, 1.0459 59.1%, 1.0427 63.6%, 1.0367 68.2%, 1.0297 72.7%, 1.0225 77.3%, 1.0160 81.8%, 1.0105 86.4%, 1.0061 90.9%, 1.0029 95.5%, 1 100%)";

const SETTLE = `transform 260ms ${SPRING}`;
const SETTLE_REDUCED = "transform 150ms ease-out";

export function SwipeDemo() {
  const [free, setFree] = createSignal(hours(19));
  const [busy, setBusy] = createSignal(hours(20));

  const decide = (hour: number, verdict: "busy" | "free") => {
    const bit = hours(hour);
    setFree((prev) => (verdict === "free" ? prev | bit : prev & ~bit));
    setBusy((prev) => (verdict === "busy" ? prev | bit : prev & ~bit));
  };

  const shared = () => free() & everyoneElse();

  const [cursorState, setCursorState] = createSignal<CursorState>("gone");
  let root!: HTMLElement;
  let list!: HTMLUListElement;
  let cursor!: HTMLDivElement;
  let trail!: HTMLDivElement;
  let stopped = false;
  let started = false;
  let visible = false;

  onMount(() => {
    const moveCursor = (x: number, y: number, duration: number) => {
      cursor.style.transitionDuration = `${duration}ms`;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      trail.style.transitionDuration = `${Math.round(duration * 1.9)}ms`;
      trail.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const anchor = (hour: number) => {
      const origin = list.getBoundingClientRect();
      const row = list.querySelectorAll("button")[HOURS.indexOf(hour)]!;
      const target = row.getBoundingClientRect();
      return {
        x: target.left - origin.left + target.width * 0.25,
        y: target.top - origin.top + target.height * 0.5,
      };
    };

    const runStep = async (hour: number) => {
      const { x, y } = anchor(hour);
      moveCursor(x, y, 420);
      setCursorState("idle");
      await sleep(420);
      if (stopped) return;

      setCursorState("pressed");
      await sleep(120);
      if (stopped) return;

      const dx = collaboratorHours() & hours(hour) ? -SWIPE : SWIPE;
      for (const progress of [0.35, 0.7, 1]) {
        moveCursor(x + dx * progress, y, 90);
        await sleep(90);
        if (stopped) return;
      }

      setCollaboratorHours((mask) => mask ^ hours(hour));
      setCursorState("idle");
      await sleep(320);
    };

    const play = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCollaboratorHours((mask) => {
          let settled = mask;
          for (const hour of CURSOR_SCRIPT) settled ^= hours(hour);
          return settled;
        });
        return;
      }

      for (;;) {
        while (!visible && !stopped) await sleep(300);
        if (stopped) return;

        setCollaboratorHours(COLLABORATOR_HOURS);
        await sleep(600);

        const { x, y } = anchor(CURSOR_SCRIPT[0]!);
        moveCursor(x + 60, y + 40, 0);

        for (const hour of CURSOR_SCRIPT) {
          if (stopped) return;
          await runStep(hour);
        }

        setCursorState("gone");
        await sleep(REST_BEFORE_REPLAY);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = !!entries[0]?.isIntersecting;
        if (visible && !started) {
          started = true;
          void play();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    onCleanup(() => {
      stopped = true;
      observer.disconnect();
    });
  });

  return (
    <section class="flex flex-col items-center" ref={root}>
      <article class="mx-auto w-[340px] max-w-full rounded-lg border-2 border-gray-100 bg-white [--busy:var(--color-gray-300)] [--cursor:oklch(58%_0.2_18)] [--free:#16a34a] [--surface:light-dark(#fff,var(--color-gray-950))] dark:border-gray-800 dark:bg-gray-950 dark:[--busy:var(--color-gray-600)] dark:[--cursor:oklch(58%_0.2_268)] dark:[--free:#4ade80]">
        <header class="flex justify-between border-b border-dashed border-gray-200/50 p-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Thursday
          <span class="font-serif text-gray-400 italic dark:text-gray-500">
            click or swipe ↔
          </span>
        </header>

        <ul class="relative" ref={list}>
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
          <div
            aria-hidden="true"
            class="pointer-events-none absolute top-0 left-0 z-20 transition-[opacity,transform] ease-out"
            ref={trail}
            style={{ opacity: cursorState() === "gone" ? 0 : 0.3 }}
          >
            <div class="size-2.5 -translate-1/2 rounded-full bg-(--cursor) blur-[3px]" />
          </div>
          <Cursor name="M" ref={cursor} state={cursorState()} />
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

  onMount(() => {
    const settle = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? SETTLE_REDUCED
      : SETTLE;

    const drag = (mx: number) => {
      const verdict = mx > 0 ? "free" : "busy";
      const color =
        verdict === "free"
          ? "var(--free)"
          : "light-dark(var(--color-gray-700), var(--color-gray-50))";

      node.style.transition = "none";
      node.style.transform = `translate3d(${mx}px, 0, 0)`;
      track.style.opacity = String(
        Math.min(Math.abs(mx) / DISTANCE_THRESHOLD, 1),
      );
      track.style.backgroundColor = `color-mix(in oklab, ${color} 18%, transparent)`;
      track.style.color = color;
      track.style.justifyContent = mx > 0 ? "flex-start" : "flex-end";
      track.textContent = verdict;
    };

    const release = () => {
      track.style.opacity = "0";
      node.style.transition = settle;
      node.style.transform = "translate3d(0, 0, 0)";
    };

    const gesture = new DragGesture(
      node,
      // eslint-disable-next-line solid/reactivity -- a DOM listener, so props are read when it fires
      ({ active, direction: [dx], last, movement: [mx], velocity: [vx] }) => {
        if (active) {
          drag(mx);
          return;
        }

        if (!last) return;

        release();

        const flung =
          Math.abs(mx) > DISTANCE_THRESHOLD ||
          (vx > VELOCITY_THRESHOLD && Math.abs(mx) > 16);

        if (flung) props.onDecide(dx > 0 || mx > 0 ? "free" : "busy");
      },
      { axis: "x", filterTaps: true },
    );

    onCleanup(() => gesture.destroy());
  });

  return (
    <li class="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        class="absolute inset-0 -z-10 flex items-center px-1 text-xs font-medium opacity-0 transition-opacity duration-100"
        ref={track}
      />
      <button
        aria-label={`${props.hour}:00`}
        aria-pressed={props.free}
        class="relative z-10 flex h-11 w-full cursor-grab touch-pan-y items-center gap-[9px] bg-white px-2 text-left transition-[background-color] duration-150 ease-out select-none active:cursor-grabbing dark:bg-gray-950"
        ref={node}
        style={{
          "background-color": props.free
            ? "color-mix(in oklab, var(--free) 14%, var(--surface))"
            : props.busy
              ? "color-mix(in oklab, var(--busy) 14%, var(--surface))"
              : undefined,
        }}
        type="button"
        onClick={() => props.onDecide(props.free ? "busy" : "free")}
      >
        <span class="text-xs tabular-nums">{props.hour}:00</span>
        <span class="flex">
          <For each={FRIENDS}>
            {(friend) => {
              const here = () => (friend.hours() & hours(props.hour)) !== 0;
              return (
                <span
                  class="flex size-6 items-center justify-center rounded-full text-[11px] font-medium text-white ring-2 ring-white transition-[margin,opacity,scale] duration-200 ease-out dark:ring-gray-950"
                  style={{
                    "background-image": friend.tint,
                    "margin-right": here() ? "-0.25rem" : "-1.5rem",
                    opacity: here() ? 1 : 0,
                    scale: here() ? "1" : "0.9",
                  }}
                >
                  {friend.initials}
                </span>
              );
            }}
          </For>
        </span>
        <span
          class="ml-auto text-xs text-gray-800 dark:text-white"
          style={{ color: props.free ? "var(--free)" : undefined }}
        >
          {props.free ? "free" : props.busy ? "busy" : ""}
        </span>
      </button>
    </li>
  );
}
