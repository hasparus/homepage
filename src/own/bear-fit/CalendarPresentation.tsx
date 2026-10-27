import { For } from "solid-js";

/** Shared by the local collaboration demo and the backend history demo. */
export const CALENDAR_CLASS =
  "@container mx-auto w-[328px] max-w-full rounded-lg border-2 border-gray-100 bg-white p-[10px] text-gray-900 [--accent:#05e] [--cell:min(40px,calc((100cqw-24px)/7))] [--cursor:oklch(58%_0.2_18)] dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:[--accent:#d7ae64] dark:[--cursor:oklch(58%_0.2_268)]";

export const CALENDAR_GRID_CLASS =
  "relative grid grid-cols-[repeat(7,var(--cell))] gap-[4px]";

export function GridCellTooltip(props: {
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

export function Participant(props: {
  count: number;
  name: string;
  onClick: () => void;
  onMouseEnter: () => void;
  pinned: boolean;
}) {
  return (
    <button
      aria-pressed={props.pinned}
      class="group -mx-1 flex w-[calc(100%+0.5rem)] cursor-pointer justify-between gap-2 rounded-sm px-1 py-0.5 text-left transition-colors duration-100 ease-out hover:bg-gray-100 hover:text-gray-800 aria-pressed:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:aria-pressed:text-gray-100"
      type="button"
      onClick={() => props.onClick()}
      onMouseEnter={() => props.onMouseEnter()}
    >
      <span class="group-aria-pressed:before:content-['✓_']">{props.name}</span>
      <span class="tabular-nums">
        {props.count} date{props.count === 1 ? "" : "s"}
      </span>
    </button>
  );
}

interface AvailabilityGridCellProps {
  availableUsers: number;
  day: Date;
  emphasis: "dimmed" | "faded" | "none" | "ring";
  isMine: boolean;
  readOnly?: boolean;
  onClick?: (event: MouseEvent) => void;
  onKeyDown: (
    event: KeyboardEvent & { currentTarget: HTMLButtonElement },
  ) => void;
  onPointerDown: (
    event: PointerEvent & { currentTarget: HTMLButtonElement },
  ) => void;
  onPointerEnter: () => void;
  ref?: (el: HTMLButtonElement) => void;
  tabIndex: number;
  totalUsers: number;
}

export function AvailabilityGridCell(props: AvailabilityGridCellProps) {
  const fill = () =>
    props.totalUsers ? props.availableUsers / props.totalUsers : 0;
  return (
    <button
      aria-label={props.day.toLocaleDateString("en-US", {
        dateStyle: "full",
        timeZone: "UTC",
      })}
      aria-pressed={props.isMine}
      aria-disabled={props.readOnly || undefined}
      class="flex size-(--cell) touch-pan-y touch-pinch-zoom items-center justify-center rounded-md border-2 border-transparent bg-gray-100 tabular-nums transition-[background-color,border-color,filter,opacity,transform] duration-150 ease-out select-none hover:border-gray-200 active:scale-[0.96] aria-disabled:active:scale-100 aria-pressed:border-[5px] aria-pressed:border-gray-200 data-peeked:border-4 data-peeked:border-gray-200 data-strong:text-white motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-gray-800 dark:hover:border-gray-600 dark:aria-pressed:border-gray-700 dark:data-peeked:border-gray-600 dark:data-strong:text-gray-950"
      data-peeked={props.emphasis === "ring" ? "" : undefined}
      data-strong={fill() > 0.5 ? "" : undefined}
      ref={props.ref}
      style={{
        "background-color": fill()
          ? `color(from var(--accent) display-p3 r g b / ${fill()})`
          : undefined,
        filter:
          props.emphasis === "faded" || props.emphasis === "dimmed"
            ? "saturate(0.25)"
            : undefined,
        opacity:
          props.emphasis === "faded"
            ? 0.6
            : props.emphasis === "dimmed"
              ? 0.8
              : undefined,
      }}
      tabindex={props.tabIndex}
      type="button"
      onClick={(event) => {
        if (!props.readOnly) props.onClick?.(event);
      }}
      onKeyDown={(event) => props.onKeyDown(event)}
      onPointerDown={(event) => {
        if (!props.readOnly) props.onPointerDown(event);
      }}
      onPointerEnter={() => props.onPointerEnter()}
    >
      {props.day.toLocaleDateString("en-US", {
        day: "numeric",
        timeZone: "UTC",
      })}
    </button>
  );
}

export function eachDayOfInterval(from: string, to: string) {
  const days = [];
  const end = new Date(to);
  for (let d = new Date(from); d <= end; d = new Date(d.getTime() + 86_400_000))
    days.push(new Date(d));
  return days;
}

export function getPaddingDays(firstDay: Date, weekStartsOn: number): number {
  return (firstDay.getUTCDay() - weekStartsOn + 7) % 7;
}

export function getWeekDayNames(weekStartsOn: number): string[] {
  const days = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 7 + i)
      .toLocaleDateString("en-US", { weekday: "short" })
      .slice(0, 2),
  );
  return [...days.slice(weekStartsOn), ...days.slice(0, weekStartsOn)];
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export function moveFocusWithArrowKeys(
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
  buttons[(index + buttons.length) % buttons.length]?.focus();
}
