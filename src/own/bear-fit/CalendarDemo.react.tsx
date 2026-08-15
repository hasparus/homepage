/** @jsxImportSource react */

import { forwardRef, useEffect, useRef, useState } from "react";

const WEEK_STARTS_ON = 1;
const RANGE_START = "2024-09-04";
const RANGE_END = "2024-09-29";
const COLLABORATOR = "Piotr";

/** The cursor travels to a date, presses, marks it. `held` keeps the button down. */
const SCRIPT = [
  { date: "2024-09-09", travel: 560 },
  { date: "2024-09-11", held: true, travel: 380 },
  { date: "2024-09-13", travel: 440 },
  { date: "2024-09-15", travel: 440 },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type CursorState = "gone" | "idle" | "pressed";

export function CalendarDemo() {
  const days = eachDayOfInterval(RANGE_START, RANGE_END);
  const paddingDays = getPaddingDays(new Date(RANGE_START), WEEK_STARTS_ON);

  const [mine, setMine] = useState<ReadonlySet<string>>(new Set());
  const [theirs, setTheirs] = useState<ReadonlySet<string>>(new Set());
  const [cursorState, setCursorState] = useState<CursorState>("gone");
  const [dragMode, setDragMode] = useState<"clearing" | "none" | "painting">(
    "none",
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cells] = useState(() => new Map<string, HTMLButtonElement>());
  const stopped = useRef(false);
  const lastToggled = useRef<null | string>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    stopped.current = false;

    const moveTo = (date: string, duration: number) => {
      const cell = cells.get(date);
      const grid = gridRef.current;
      const cursor = cursorRef.current;
      if (!cell || !grid || !cursor) return false;

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
      const cursor = cursorRef.current!;
      cursor.style.transform += " translate(-2.5rem, 5rem)";
      await sleep(500);
      if (stopped.current) return;
      setCursorState("idle");

      for (const [i, step] of SCRIPT.entries()) {
        if (stopped.current || !moveTo(step.date, step.travel)) return;

        await sleep(step.travel);
        if (stopped.current) return;

        setCursorState("pressed");
        setTheirs((prev) => new Set(prev).add(step.date));

        if (!SCRIPT[i + 1]?.held) {
          await sleep(120);
          setCursorState("idle");
          await sleep(180);
        }
      }

      await sleep(900);
      if (!stopped.current) setCursorState("gone");
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

    return () => {
      stopped.current = true;
      observer.disconnect();
    };
  }, [cells]);

  useEffect(() => {
    const end = () => {
      setDragMode("none");
      lastToggled.current = null;
    };
    document.addEventListener("pointerup", end);
    document.addEventListener("pointercancel", end);
    return () => {
      document.removeEventListener("pointerup", end);
      document.removeEventListener("pointercancel", end);
    };
  }, []);

  const totalUsers = (mine.size > 0 ? 1 : 0) + (theirs.size > 0 ? 1 : 0);

  const setAvailability = (date: string, value: boolean) => {
    setMine((prev) => {
      const next = new Set(prev);
      if (value) next.add(date);
      else next.delete(date);
      return next;
    });
  };

  const handlePointerDown = (date: string) => {
    stopped.current = true;
    setCursorState("gone");

    const available = mine.has(date);
    setDragMode(available ? "clearing" : "painting");
    setAvailability(date, !available);
    lastToggled.current = date;
  };

  const handlePointerEnter = (date: string) => {
    if (dragMode === "none" || lastToggled.current === date) return;
    setAvailability(date, dragMode === "painting");
    lastToggled.current = date;
  };

  return (
    <div
      className="mx-auto w-[340px] max-w-full rounded-lg border-2 border-gray-100 bg-white p-[10px] text-gray-900 [--accent:#05e] dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:[--accent:#5b9dff]"
      ref={rootRef}
    >
      <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
        Calendar
      </p>
      <h3 className="mb-4 text-lg leading-[1.3333]">Beers with the crew</h3>

      <div className="mt-2 mb-4">
        <div className="mb-2">September 2024</div>
        <div className="relative grid grid-cols-7 gap-1" ref={gridRef}>
          {getWeekDayNames(WEEK_STARTS_ON).map((name) => (
            <div
              className="flex h-10 items-center justify-center text-[11.6667px] font-medium opacity-75"
              key={name}
            >
              {name}
            </div>
          ))}

          {Array.from({ length: paddingDays }, (_, i) => (
            <div className="h-10" key={`padding-${i}`} />
          ))}

          {days.map((day, i) => {
            const date = isoDate(day);
            const availableUsers =
              (mine.has(date) ? 1 : 0) + (theirs.has(date) ? 1 : 0);

            return (
              <AvailabilityGridCell
                availableUsers={availableUsers}
                day={day}
                isMine={mine.has(date)}
                key={date}
                ref={(el) => {
                  if (el) cells.set(date, el);
                  else cells.delete(date);
                }}
                tabIndex={i === 0 ? 0 : -1}
                totalUsers={totalUsers}
                onKeyDown={(event) =>
                  moveFocusWithArrowKeys(event, () =>
                    setAvailability(date, !mine.has(date)),
                  )
                }
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
          })}

          <Cursor name={COLLABORATOR} ref={cursorRef} state={cursorState} />
        </div>
      </div>

      <dl className="font-mono text-sm text-gray-500 dark:text-gray-400">
        <Participant count={mine.size} name="you" />
        <Participant count={theirs.size} name={COLLABORATOR} />
      </dl>
    </div>
  );
}

function Participant({ count, name }: { count: number; name: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt>{name}</dt>
      <dd className="tabular-nums">
        {count} date{count === 1 ? "" : "s"}
      </dd>
    </div>
  );
}

interface AvailabilityGridCellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  availableUsers: number;
  day: Date;
  isMine: boolean;
  totalUsers: number;
}

const AvailabilityGridCell = forwardRef<
  HTMLButtonElement,
  AvailabilityGridCellProps
>(function AvailabilityGridCell(
  { availableUsers, day, isMine, totalUsers, ...rest },
  ref,
) {
  const fill = totalUsers ? availableUsers / totalUsers : 0;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={day.toLocaleDateString("en-US", {
        dateStyle: "full",
        timeZone: "UTC",
      })}
      aria-pressed={isMine}
      data-strong={fill > 0.5 || undefined}
      className="flex size-10 touch-pan-y touch-pinch-zoom items-center justify-center rounded-md border-2 border-transparent bg-gray-100 tabular-nums transition-[background-color,border-color,transform] duration-150 ease-out select-none active:scale-[0.96] aria-pressed:border-[5px] aria-pressed:border-gray-200 data-strong:text-white dark:bg-gray-800 dark:aria-pressed:border-gray-700 dark:data-strong:text-gray-950"
      style={{
        backgroundColor: fill
          ? `hsl(from var(--accent) h s l / ${fill})`
          : undefined,
      }}
      {...rest}
    >
      {day.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" })}
    </button>
  );
});

const Cursor = forwardRef<HTMLDivElement, { name: string; state: CursorState }>(
  function Cursor({ name, state }, ref) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 transition-transform ease-[cubic-bezier(0.77,0,0.175,1)]"
        ref={ref}
      >
        <div
          className="flex origin-top-left items-start transition-[opacity,scale] duration-150 ease-out"
          style={{
            opacity: state === "gone" ? 0 : 1,
            scale: state === "pressed" ? "0.88" : "1",
          }}
        >
          <svg
            className="shrink-0 drop-shadow-sm"
            fill="none"
            height="20"
            viewBox="0 0 12 20"
            width="12"
          >
            <path
              d="M1 1L1 15.5L4.7 12.1L7.2 18L9.6 17L7.1 11.2L11.7 10.8L1 1Z"
              fill="white"
              stroke="black"
              strokeWidth="1.2"
            />
          </svg>
          <span className="mt-2.5 ml-1 rounded-sm bg-black px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-white">
            {name}
          </span>
        </div>
      </div>
    );
  },
);

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
  e: React.KeyboardEvent<HTMLButtonElement>,
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
