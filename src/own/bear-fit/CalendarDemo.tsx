import { createSignal, For, Index, onCleanup, onMount } from "solid-js";

const WEEK_STARTS_ON = 1;
const RANGE_START = "2024-09-04";
const RANGE_END = "2024-09-29";
const COLLABORATOR = "Kasia";

/** Someone who filled the calendar in before you opened the link. */
const EARLY_BIRD = "Wojtek";
const EARLY_BIRD_DATES: ReadonlySet<string> = new Set([
  "2024-09-10",
  "2024-09-11",
  "2024-09-12",
  "2024-09-18",
  "2024-09-19",
  "2024-09-25",
  "2024-09-26",
]);

/** The cursor travels to a date, presses, marks it. `held` keeps the button down. */
const PATTERNS = [
  [
    { date: "2024-09-09", travel: 560 },
    { date: "2024-09-10", held: true, travel: 190 },
    { date: "2024-09-11", held: true, travel: 190 },
    { date: "2024-09-13", travel: 440 },
    { date: "2024-09-15", travel: 440 },
  ],
  [
    { date: "2024-09-17", travel: 520 },
    { date: "2024-09-18", held: true, travel: 190 },
    { date: "2024-09-19", held: true, travel: 190 },
    { date: "2024-09-21", travel: 420 },
    { date: "2024-09-24", travel: 480 },
    { date: "2024-09-25", held: true, travel: 190 },
  ],
];

const REST_BETWEEN_PATTERNS = 2600;
const IDLE_BEFORE_RESUME = 6000;

const TOOLTIP_PADDING_X = 16;
const TOOLTIP_OFFSET_Y = 8;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type CursorState = "gone" | "idle" | "pressed";

export function CalendarDemo() {
  const days = eachDayOfInterval(RANGE_START, RANGE_END);
  const paddingDays = getPaddingDays(new Date(RANGE_START), WEEK_STARTS_ON);

  const [mine, setMine] = createSignal<ReadonlySet<string>>(new Set());
  const [theirs, setTheirs] = createSignal<ReadonlySet<string>>(new Set());
  const [cursorState, setCursorState] = createSignal<CursorState>("gone");
  const [hovered, setHovered] = createSignal<null | string>(null);

  let root!: HTMLDivElement;
  let grid!: HTMLDivElement;
  let cursor!: HTMLDivElement;
  let tooltip!: HTMLSpanElement;
  const cells = new Map<string, HTMLButtonElement>();

  let stopped = false;
  let started = false;
  let visible = false;
  let paused = false;
  let resumeTimer: number | undefined;
  let dragMode: "clearing" | "none" | "painting" = "none";
  let lastToggled: null | string = null;

  const totalUsers = () =>
    (mine().size > 0 ? 1 : 0) + (theirs().size > 0 ? 1 : 0) + 1;

  const setAvailability = (date: string, value: boolean) => {
    setMine((prev) => {
      const next = new Set(prev);
      if (value) next.add(date);
      else next.delete(date);
      return next;
    });
  };

  /** Kasia steps aside while you paint, and picks up again once you stop. */
  const yieldToUser = () => {
    paused = true;
    setCursorState("gone");
    clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      paused = false;
    }, IDLE_BEFORE_RESUME);
  };

  const handlePointerDown = (date: string) => {
    yieldToUser();

    const available = mine().has(date);
    dragMode = available ? "clearing" : "painting";
    setAvailability(date, !available);
    lastToggled = date;
  };

  const namesOn = (date: string) =>
    [
      mine().has(date) && "you",
      theirs().has(date) && COLLABORATOR,
      EARLY_BIRD_DATES.has(date) && EARLY_BIRD,
    ].filter((name) => typeof name === "string");

  const handlePointerEnter = (date: string) => {
    setHovered(date);
    if (dragMode === "none" || lastToggled === date) return;
    setAvailability(date, dragMode === "painting");
    lastToggled = date;
  };

  onMount(() => {
    const endDrag = () => {
      dragMode = "none";
      lastToggled = null;
    };
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);

    const moveTooltip = (e: MouseEvent) => {
      const gridRect = grid.getBoundingClientRect();
      const y = e.clientY - gridRect.top - TOOLTIP_OFFSET_Y;
      const x = Math.min(
        Math.max(e.clientX - gridRect.left, TOOLTIP_PADDING_X),
        gridRect.width - TOOLTIP_PADDING_X,
      );
      tooltip.style.transform = `translate3d(calc(${x}px - 50%), ${y}px, 0)`;
    };
    window.addEventListener("mousemove", moveTooltip);

    const moveTo = (date: string, duration: number) => {
      const cell = cells.get(date);
      if (!cell) return false;

      const origin = grid.getBoundingClientRect();
      const target = cell.getBoundingClientRect();
      cursor.style.transitionDuration = `${duration}ms`;
      cursor.style.transform = `translate3d(${
        target.left - origin.left + target.width * 0.5
      }px, ${target.top - origin.top + target.height * 0.62}px, 0)`;
      return true;
    };

    const interrupted = () => stopped || paused;

    const runPattern = async (pattern: (typeof PATTERNS)[number]) => {
      if (!moveTo(pattern[0]!.date, 0)) return;
      cursor.style.transform += " translate(-2.5rem, 5rem)";
      await sleep(500);
      if (interrupted()) return;
      setCursorState("idle");

      for (const [i, step] of pattern.entries()) {
        if (interrupted() || !moveTo(step.date, step.travel)) return;

        await sleep(step.travel);
        if (interrupted()) return;

        setCursorState("pressed");
        setTheirs((prev) => new Set(prev).add(step.date));

        if (!pattern[i + 1]?.held) {
          await sleep(120);
          setCursorState("idle");
          await sleep(180);
        }
      }

      await sleep(900);
      if (!interrupted()) setCursorState("gone");
    };

    const play = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheirs(new Set(PATTERNS[0]!.map((step) => step.date)));
        return;
      }

      for (let round = 0; !stopped; round++) {
        while ((!visible || paused) && !stopped) await sleep(300);
        if (stopped) return;

        if (theirs().size > 0) {
          setTheirs(new Set<string>());
          await sleep(700);
        }

        await runPattern(PATTERNS[round % PATTERNS.length]!);
        await sleep(REST_BETWEEN_PATTERNS);
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
      clearTimeout(resumeTimer);
      observer.disconnect();
      document.removeEventListener("pointerup", endDrag);
      document.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("mousemove", moveTooltip);
    });
  });

  return (
    <div
      class="mx-auto w-[340px] max-w-full rounded-lg border-2 border-gray-100 bg-white p-[10px] text-gray-900 [--accent:#05e] [--cursor:oklch(58%_0.2_18)] dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:[--accent:#5b9dff] dark:[--cursor:oklch(70%_0.17_18)]"
      ref={root}
    >
      <p class="font-mono text-sm text-gray-500 dark:text-gray-400">Calendar</p>
      <h3 class="mb-4 text-lg leading-[1.3333]">beers and basketball</h3>

      <div class="mt-2 mb-4">
        <div
          class="relative grid grid-cols-[repeat(7,40px)] justify-between gap-[4px]"
          ref={grid}
          onPointerLeave={() => setHovered(null)}
        >
          <GridCellTooltip
            names={hovered() ? namesOn(hovered()!) : []}
            ref={tooltip}
          />
          <For each={getWeekDayNames(WEEK_STARTS_ON)}>
            {(name) => (
              <div class="flex h-[40px] items-center justify-center text-[11.6667px] font-medium opacity-75">
                {name}
              </div>
            )}
          </For>

          <Index each={Array.from({ length: paddingDays })}>
            {() => <div class="h-[40px]" />}
          </Index>

          <For each={days}>
            {(day, i) => {
              const date = isoDate(day);

              return (
                <AvailabilityGridCell
                  availableUsers={
                    (mine().has(date) ? 1 : 0) +
                    (theirs().has(date) ? 1 : 0) +
                    (EARLY_BIRD_DATES.has(date) ? 1 : 0)
                  }
                  day={day}
                  isMine={mine().has(date)}
                  ref={(el) => cells.set(date, el)}
                  tabIndex={i() === 0 ? 0 : -1}
                  totalUsers={totalUsers()}
                  onKeyDown={(event) => {
                    moveFocusWithArrowKeys(event, () =>
                      setAvailability(date, !mine().has(date)),
                    );
                  }}
                  onPointerDown={(event) => {
                    if (event.pointerType === "mouse" && event.button !== 0) {
                      return;
                    }
                    handlePointerDown(date);
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }}
                  onPointerEnter={() => handlePointerEnter(date)}
                />
              );
            }}
          </For>

          <Cursor name={COLLABORATOR} ref={cursor} state={cursorState()} />
        </div>
      </div>

      <dl class="font-mono text-sm text-gray-500 dark:text-gray-400">
        <Participant count={mine().size} name="you" />
        <Participant count={theirs().size} name={COLLABORATOR} />
        <Participant count={EARLY_BIRD_DATES.size} name={EARLY_BIRD} />
      </dl>
    </div>
  );
}

function GridCellTooltip(props: {
  names: string[];
  ref: HTMLSpanElement | ((el: HTMLSpanElement) => void);
}) {
  return (
    <span
      aria-live="polite"
      class="pointer-events-none absolute bottom-full left-0 z-10 mb-2 rounded-sm bg-gray-900 px-2 py-1 text-left font-mono text-xs whitespace-pre text-white transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900"
      ref={props.ref}
      role="tooltip"
      style={{
        opacity: props.names.length > 0 ? 1 : 0,
        "transition-duration": "150ms, 75ms",
      }}
    >
      <For each={props.names}>{(name) => <div>{name}</div>}</For>
    </span>
  );
}

function Participant(props: { count: number; name: string }) {
  return (
    <div class="flex justify-between gap-2">
      <dt>{props.name}</dt>
      <dd class="tabular-nums">
        {props.count} date{props.count === 1 ? "" : "s"}
      </dd>
    </div>
  );
}

interface AvailabilityGridCellProps {
  availableUsers: number;
  day: Date;
  isMine: boolean;
  onKeyDown: (
    event: KeyboardEvent & { currentTarget: HTMLButtonElement },
  ) => void;
  onPointerDown: (
    event: PointerEvent & { currentTarget: HTMLButtonElement },
  ) => void;
  onPointerEnter: () => void;
  ref: (el: HTMLButtonElement) => void;
  tabIndex: number;
  totalUsers: number;
}

function AvailabilityGridCell(props: AvailabilityGridCellProps) {
  const fill = () =>
    props.totalUsers ? props.availableUsers / props.totalUsers : 0;

  return (
    <button
      aria-label={props.day.toLocaleDateString("en-US", {
        dateStyle: "full",
        timeZone: "UTC",
      })}
      aria-pressed={props.isMine}
      class="flex size-[40px] touch-pan-y touch-pinch-zoom items-center justify-center rounded-md border-2 border-transparent bg-gray-100 tabular-nums transition-[background-color,border-color,transform] duration-150 ease-out select-none hover:border-gray-200 active:scale-[0.96] aria-pressed:border-[5px] aria-pressed:border-gray-200 data-strong:text-white dark:bg-gray-800 dark:hover:border-gray-600 dark:aria-pressed:border-gray-700 dark:data-strong:text-gray-950"
      data-strong={fill() > 0.5 ? "" : undefined}
      ref={props.ref}
      style={{
        "background-color": fill()
          ? `hsl(from var(--accent) h s l / ${fill()})`
          : undefined,
      }}
      tabindex={props.tabIndex}
      type="button"
      onKeyDown={(event) => props.onKeyDown(event)}
      onPointerDown={(event) => props.onPointerDown(event)}
      onPointerEnter={() => props.onPointerEnter()}
    >
      {props.day.toLocaleDateString("en-US", {
        day: "numeric",
        timeZone: "UTC",
      })}
    </button>
  );
}

function Cursor(props: {
  name: string;
  ref: HTMLDivElement | ((el: HTMLDivElement) => void);
  state: CursorState;
}) {
  return (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-0 left-0 transition-transform ease-[cubic-bezier(0.77,0,0.175,1)]"
      ref={props.ref}
    >
      <div
        class="flex origin-top-left items-start drop-shadow-[0_2px_4px_rgb(0_0_0/0.28)] transition-[opacity,scale] duration-150 ease-out"
        style={{
          opacity: props.state === "gone" ? 0 : 1,
          scale: props.state === "pressed" ? "0.88" : "1",
        }}
      >
        {}
        <svg fill="none" height="26" viewBox="-3 -3 18 24" width="18">
          <path
            d="M5.65 12.37h-.19l-.14.13L.5 16.88V1.2l11.28 11.17H5.65Z"
            fill="var(--cursor)"
            paint-order="stroke"
            stroke="white"
            stroke-linejoin="round"
            stroke-width="4.5"
          />
          <path
            d="M5.65 12.37h-.19l-.14.13L.5 16.88V1.2l11.28 11.17H5.65Z"
            fill="var(--cursor)"
            stroke="var(--cursor)"
            stroke-linejoin="round"
            stroke-width="3"
          />
        </svg>
        <span
          class="-mt-0.5 ml-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-white"
          style={{ "background-color": "var(--cursor)" }}
        >
          {props.name}
        </span>
      </div>
    </div>
  );
}

function eachDayOfInterval(from: string, to: string) {
  const days = [];
  const end = new Date(to);
  for (
    let d = new Date(from);
    d <= end;
    d = new Date(d.getTime() + 86_400_000)
  ) {
    days.push(new Date(d));
  }
  return days;
}

function getPaddingDays(firstDay: Date, weekStartsOn: number): number {
  return (firstDay.getUTCDay() - weekStartsOn + 7) % 7;
}

function getWeekDayNames(weekStartsOn: number): string[] {
  const days = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 7 + i)
      .toLocaleDateString("en-US", { weekday: "short" })
      .slice(0, 2),
  );
  return [...days.slice(weekStartsOn), ...days.slice(0, weekStartsOn)];
}

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

function moveFocusWithArrowKeys(
  e: KeyboardEvent & { currentTarget: HTMLButtonElement },
  onClick: () => void,
) {
  const buttons = e.currentTarget.parentElement!.querySelectorAll("button");
  let index = [...buttons].indexOf(e.currentTarget);

  switch (e.key) {
    case " ":
    case "Enter":
      onClick();
      break;
    case "ArrowDown":
      index += 7;
      break;
    case "ArrowLeft":
      index--;
      break;
    case "ArrowRight":
      index++;
      break;
    case "ArrowUp":
      index -= 7;
      break;
    default:
      return;
  }

  e.preventDefault();
  buttons[index % buttons.length]?.focus();
}
