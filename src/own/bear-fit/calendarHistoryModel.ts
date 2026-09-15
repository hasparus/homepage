import type { HistoryUpdate } from "./history";

export const MAX_PAST_VERSIONS = 250;

export interface CalendarSnapshot {
  readonly availability: Readonly<Record<string, boolean>>;
  readonly names: Readonly<Record<string, string>>;
  readonly event: Readonly<Record<string, string>>;
}

export type ConnectionState =
  | { readonly kind: "connecting" }
  | { readonly kind: "connected" }
  | { readonly kind: "offline"; readonly message: string };

export type TimelineState =
  | { readonly kind: "present" }
  | {
      readonly kind: "past" | "compacted-past" | "outside-window-past";
      readonly clock: string;
      readonly snapshot: CalendarSnapshot;
    };

export interface CalendarHistoryState {
  readonly connection: ConnectionState;
  readonly present: CalendarSnapshot;
  readonly updates: readonly HistoryUpdate[];
  readonly timeline: TimelineState;
  readonly error: string | null;
}

export type CalendarHistoryEvent =
  | { type: "CONNECT" }
  | { type: "CONNECTED"; snapshot: CalendarSnapshot }
  | { type: "DISCONNECTED"; message: string }
  | { type: "DOCUMENT_CHANGED"; snapshot: CalendarSnapshot }
  | { type: "HISTORY_RECEIVED"; updates: readonly HistoryUpdate[] }
  | { type: "HISTORY_FAILED"; message: string }
  | { type: "PREVIEW_FAILED"; message: string }
  | { type: "VIEW_PAST"; clock: string; snapshot: CalendarSnapshot }
  | { type: "VIEW_PRESENT" };

export function initialCalendarHistoryState(): CalendarHistoryState {
  return {
    connection: { kind: "connecting" },
    present: { availability: {}, names: {}, event: {} },
    updates: [],
    timeline: { kind: "present" },
    error: null,
  };
}

function retainsPrefix(
  previous: readonly HistoryUpdate[],
  next: readonly HistoryUpdate[],
  clock: string,
): boolean {
  const previousIndex = previous.findIndex((update) => update.clock === clock);
  const nextIndex = next.findIndex((update) => update.clock === clock);
  return (
    previousIndex !== -1 &&
    previousIndex === nextIndex &&
    previous.slice(0, previousIndex + 1).every((update, index) => {
      const candidate = next[index]!;
      return (
        update.clock === candidate.clock &&
        update.value.length === candidate.value.length &&
        update.value.every((byte, i) => byte === candidate.value[i])
      );
    })
  );
}

export function transitionCalendarHistory(
  state: CalendarHistoryState,
  event: CalendarHistoryEvent,
): CalendarHistoryState {
  switch (event.type) {
    case "CONNECT":
      return { ...state, connection: { kind: "connecting" } };
    case "CONNECTED":
      return {
        ...state,
        connection: { kind: "connected" },
        present: event.snapshot,
      };
    case "DISCONNECTED":
      return {
        ...state,
        connection: { kind: "offline", message: event.message },
      };
    case "DOCUMENT_CHANGED":
      return { ...state, present: event.snapshot };
    case "HISTORY_RECEIVED": {
      let timeline = state.timeline;
      if (timeline.kind === "past") {
        const clock = timeline.clock;
        if (!retainsPrefix(state.updates, event.updates, clock)) {
          timeline = { ...timeline, kind: "compacted-past" };
        } else if (
          !event.updates
            .slice(-MAX_PAST_VERSIONS)
            .some((update) => update.clock === clock)
        ) {
          timeline = { ...timeline, kind: "outside-window-past" };
        }
      }
      return { ...state, updates: event.updates, error: null, timeline };
    }
    case "HISTORY_FAILED":
    case "PREVIEW_FAILED":
      return { ...state, error: event.message };
    case "VIEW_PAST":
      if (!visibleHistory(state).some((update) => update.clock === event.clock))
        return state;
      return {
        ...state,
        timeline: {
          kind: "past",
          clock: event.clock,
          snapshot: event.snapshot,
        },
      };
    case "VIEW_PRESENT":
      return { ...state, timeline: { kind: "present" } };
    default: {
      const unhandled: never = event;
      return unhandled;
    }
  }
}

export function displayedCalendar(
  state: CalendarHistoryState,
): CalendarSnapshot {
  return state.timeline.kind === "present"
    ? state.present
    : state.timeline.snapshot;
}

export function visibleHistory(
  state: CalendarHistoryState,
): readonly HistoryUpdate[] {
  return state.updates.slice(-MAX_PAST_VERSIONS);
}

export function historyWindowStart(state: CalendarHistoryState): number {
  return Math.max(0, state.updates.length - MAX_PAST_VERSIONS);
}

export function timelinePosition(state: CalendarHistoryState): number {
  const timeline = state.timeline;
  const visible = visibleHistory(state);
  return timeline.kind === "present"
    ? visible.length
    : Math.max(
        0,
        visible.findIndex((update) => update.clock === timeline.clock),
      );
}

export function calendarIsEditable(state: CalendarHistoryState): boolean {
  return (
    state.connection.kind === "connected" &&
    !!state.present.event.id &&
    state.timeline.kind === "present"
  );
}
