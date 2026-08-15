import { createSignal, For, Index, onCleanup, onMount } from "solid-js";

const WEEK_STARTS_ON = 1;
const RANGE_START = "2024-09-04";
const RANGE_END = "2024-09-29";
const COLLABORATOR = "Kasia";

/** The cursor travels to a date, presses, marks it. `held` keeps the button down. */
const SCRIPT = [
  { date: "2024-09-09", travel: 560 },
  { date: "2024-09-10", held: true, travel: 190 },
  { date: "2024-09-11", held: true, travel: 190 },
  { date: "2024-09-13", travel: 440 },
  { date: "2024-09-15", travel: 440 },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type CursorState = "gone" | "idle" | "pressed";

export function CalendarDemo() {
  const days = eachDayOfInterval(RANGE_START, RANGE_END);
  const paddingDays = getPaddingDays(new Date(RANGE_START), WEEK_STARTS_ON);

  const [mine, setMine] = createSignal<ReadonlySet<string>>(new Set());
  const [theirs, setTheirs] = createSignal<ReadonlySet<string>>(new Set());
  const [cursorState, setCursorState] = createSignal<CursorState>("gone");

  let root!: HTMLDivElement;
  let grid!: HTMLDivElement;
  let cursor!: HTMLDivElement;
  const cells = new Map<string, HTMLButtonElement>();

  let stopped = false;
  let dragMode: "clearing" | "none" | "painting" = "none";
  let lastToggled: null | string = null;

  const totalUsers = () =>
    (mine().size > 0 ? 1 : 0) + (theirs().size > 0 ? 1 : 0);

  const setAvailability = (date: string, value: boolean) => {
    setMine((prev) => {
      const next = new Set(prev);
      if (value) next.add(date);
      else next.delete(date);
      return next;
    });
  };

  const handlePointerDown = (date: string) => {
    stopped = true;
    setCursorState("gone");

    const available = mine().has(date);
    dragMode = available ? "clearing" : "painting";
    setAvailability(date, !available);
    lastToggled = date;
  };

  const handlePointerEnter = (date: string) => {
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

    const play = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheirs(new Set(SCRIPT.map((step) => step.date)));
        return;
      }

      if (!moveTo(SCRIPT[0]!.date, 0)) return;
      cursor.style.transform += " translate(-2.5rem, 5rem)";
      await sleep(500);
      if (stopped) return;
      setCursorState("idle");

      for (const [i, step] of SCRIPT.entries()) {
        if (stopped || !moveTo(step.date, step.travel)) return;

        await sleep(step.travel);
        if (stopped) return;

        setCursorState("pressed");
        setTheirs((prev) => new Set(prev).add(step.date));

        if (!SCRIPT[i + 1]?.held) {
          await sleep(120);
          setCursorState("idle");
          await sleep(180);
        }
      }

      await sleep(900);
      if (!stopped) setCursorState("gone");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        void play();
      },
      { threshold: 0.6 },
    );
    observer.observe(root);

    onCleanup(() => {
      stopped = true;
      observer.disconnect();
      document.removeEventListener("pointerup", endDrag);
      document.removeEventListener("pointercancel", endDrag);
    });
  });

  return (
    <div
      class="mx-auto w-[340px] max-w-full rounded-lg border-2 border-gray-100 bg-white p-[10px] text-gray-900 [--accent:#05e] dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:[--accent:#5b9dff]"
      ref={root}
    >
      <p class="font-mono text-sm text-gray-500 dark:text-gray-400">Calendar</p>
      <h3 class="mb-4 text-lg leading-[1.3333]">Beers with the crew</h3>

      <div class="mt-2 mb-4">
        <div class="mb-2">September 2024</div>
        <div class="relative grid grid-cols-7 gap-1" ref={grid}>
          <For each={getWeekDayNames(WEEK_STARTS_ON)}>
            {(name) => (
              <div class="flex h-10 items-center justify-center text-[11.6667px] font-medium opacity-75">
                {name}
              </div>
            )}
          </For>

          <Index each={Array.from({ length: paddingDays })}>
            {() => <div class="h-10" />}
          </Index>

          <For each={days}>
            {(day, i) => {
              const date = isoDate(day);

              return (
                <AvailabilityGridCell
                  availableUsers={
                    (mine().has(date) ? 1 : 0) + (theirs().has(date) ? 1 : 0)
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
      </dl>
    </div>
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
      class="flex size-10 touch-pan-y touch-pinch-zoom items-center justify-center rounded-md border-2 border-transparent bg-gray-100 tabular-nums transition-[background-color,border-color,transform] duration-150 ease-out select-none hover:border-gray-200 active:scale-[0.96] aria-pressed:border-[5px] aria-pressed:border-gray-200 data-strong:text-white dark:bg-gray-800 dark:hover:border-gray-600 dark:aria-pressed:border-gray-700 dark:data-strong:text-gray-950"
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
        class="flex origin-top-left items-start transition-[opacity,scale] duration-150 ease-out"
        style={{
          opacity: props.state === "gone" ? 0 : 1,
          scale: props.state === "pressed" ? "0.88" : "1",
        }}
      >
        <svg
          class="shrink-0 drop-shadow-sm"
          fill="none"
          height="20"
          viewBox="0 0 12 20"
          width="12"
        >
          <path
            d="M1 1L1 15.5L4.7 12.1L7.2 18L9.6 17L7.1 11.2L11.7 10.8L1 1Z"
            fill="white"
            stroke="black"
            stroke-width="1.2"
          />
        </svg>
        <span class="mt-2.5 ml-1 rounded-sm bg-black px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-white">
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
