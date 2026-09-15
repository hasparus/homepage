import { createSignal, For, Index, onCleanup, onMount } from "solid-js";

import {
  AvailabilityGridCell,
  CALENDAR_CLASS,
  CALENDAR_GRID_CLASS,
  eachDayOfInterval,
  getPaddingDays,
  getWeekDayNames,
  GridCellTooltip,
  isoDate,
  moveFocusWithArrowKeys,
  Participant,
} from "./CalendarPresentation";
import { Cursor, type CursorState } from "./Cursor";

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

const TOOLTIP_PADDING_X = 16;
const TOOLTIP_OFFSET_Y = 8;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function CalendarDemo(props: { class?: string }) {
  const days = eachDayOfInterval(RANGE_START, RANGE_END);
  const paddingDays = getPaddingDays(new Date(RANGE_START), WEEK_STARTS_ON);

  const [mine, setMine] = createSignal<ReadonlySet<string>>(new Set());
  const [theirs, setTheirs] = createSignal<ReadonlySet<string>>(new Set());
  const [cursorState, setCursorState] = createSignal<CursorState>("gone");
  const [hovered, setHovered] = createSignal<null | string>(null);
  const [hoveredName, setHoveredName] = createSignal<null | string>(null);
  const [pinned, setPinned] = createSignal<ReadonlySet<string>>(new Set());

  let root!: HTMLDivElement;
  let grid!: HTMLDivElement;
  let cursor!: HTMLDivElement;
  let tooltip!: HTMLSpanElement;
  const cells = new Map<string, HTMLButtonElement>();

  let stopped = false;
  let started = false;
  let visible = false;
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

  const handlePointerDown = (date: string) => {
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

  /** Hovering a name previews it, checking names keeps the filter on. */
  const emphasisOf = (date: string) => {
    const names = namesOn(date);
    const peeked = hoveredName();
    if (peeked) return names.includes(peeked) ? "ring" : "faded";
    for (const name of pinned()) if (!names.includes(name)) return "dimmed";
    return "none";
  };

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

    const runPattern = async (pattern: (typeof PATTERNS)[number]) => {
      if (!moveTo(pattern[0]!.date, 0)) return;
      cursor.style.transform += " translate(-2.5rem, 5rem)";
      await sleep(500);
      if (stopped) return;
      setCursorState("idle");

      for (const [i, step] of pattern.entries()) {
        if (stopped || !moveTo(step.date, step.travel)) return;

        await sleep(step.travel);
        if (stopped) return;

        setCursorState("pressed");
        setTheirs((prev) => new Set(prev).add(step.date));

        if (!pattern[i + 1]?.held) {
          await sleep(120);
          setCursorState("idle");
          await sleep(180);
        }
      }

      await sleep(900);
      if (!stopped) setCursorState("gone");
    };

    const play = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheirs(new Set(PATTERNS[0]!.map((step) => step.date)));
        return;
      }

      for (let round = 0; !stopped; round++) {
        while (!visible && !stopped) await sleep(300);
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
      observer.disconnect();
      document.removeEventListener("pointerup", endDrag);
      document.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("mousemove", moveTooltip);
    });
  });

  return (
    <div
      classList={{
        [CALENDAR_CLASS]: true,
        [props.class!]: !!props.class,
      }}
      ref={root}
    >
      <p class="font-mono text-sm text-gray-500 dark:text-gray-400">Calendar</p>
      <h3 class="mb-4 text-lg leading-[1.3333]">beers and basketball</h3>

      <div class="mt-2 mb-4">
        <div
          class={CALENDAR_GRID_CLASS}
          ref={grid}
          onPointerLeave={() => setHovered(null)}
        >
          <GridCellTooltip
            names={hovered() ? namesOn(hovered()!) : []}
            ref={tooltip}
          />
          <For each={getWeekDayNames(WEEK_STARTS_ON)}>
            {(name) => (
              <div class="flex h-(--cell) items-center justify-center text-[11.6667px] font-medium opacity-75">
                {name}
              </div>
            )}
          </For>

          <Index each={Array.from({ length: paddingDays })}>
            {() => <div class="h-(--cell)" />}
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
                  emphasis={emphasisOf(date)}
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

      <div
        class="font-mono text-sm text-gray-500 dark:text-gray-400"
        onMouseLeave={() => setHoveredName(null)}
      >
        <For
          each={[
            { count: mine().size, name: "you" },
            { count: theirs().size, name: COLLABORATOR },
            { count: EARLY_BIRD_DATES.size, name: EARLY_BIRD },
          ]}
        >
          {(participant) => (
            <Participant
              count={participant.count}
              name={participant.name}
              pinned={pinned().has(participant.name)}
              onClick={() =>
                setPinned((prev) => {
                  const next = new Set(prev);
                  if (!next.delete(participant.name))
                    next.add(participant.name);
                  return next;
                })
              }
              onMouseEnter={() => setHoveredName(participant.name)}
            />
          )}
        </For>
      </div>
    </div>
  );
}
