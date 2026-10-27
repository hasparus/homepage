import {
  createMemo,
  createRenderEffect,
  createSignal,
  createUniqueId,
  For,
  Index,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import YPartyKitProvider from "y-partykit/provider";
import { Doc } from "yjs";

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
import {
  calendarIsEditable,
  type CalendarHistoryEvent,
  type CalendarSnapshot,
  displayedCalendar,
  historyWindowStart,
  initialCalendarHistoryState,
  timelinePosition,
  transitionCalendarHistory,
  visibleHistory,
} from "./calendarHistoryModel";
import { fetchHistory, replayHistory } from "./history";
import { createHistoryPersistenceCheck } from "./historyPersistence";

import styles from "./CalendarHistoryDemo.module.css";

export const BLOG_ROOM = "blog-y-travelling-technicolor-2077";
export const PARTICIPANTS = [
  { id: "blog-reader-barney", name: "Barney" },
  { id: "blog-reader-slithey", name: "Slithey" },
  { id: "blog-reader-ruf", name: "Ruf" },
  { id: "blog-reader-ottar", name: "Ottar" },
] as const;
export const PARTICIPANT_STORAGE_KEY =
  "bear-fit:blog-y-travelling-technicolor-2077:participant";
export const EVENT_TITLE = "shooting a viking movie";
const START = "2077-09-06";
const END = "2077-09-26";
const SERVER =
  import.meta.env.PUBLIC_BEAR_FIT_SERVER ||
  "https://bear-fit.hasparus.partykit.dev";
const LOCAL =
  import.meta.env.DEV &&
  ["localhost", "127.0.0.1", "[::1]"].includes(new URL(SERVER).hostname);
const ARROW_CLASS =
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100 disabled:cursor-default disabled:opacity-40 dark:hover:bg-gray-800";

function calendarState(doc: Doc): CalendarSnapshot {
  return {
    availability: Object.fromEntries(doc.getMap<boolean>("availability")),
    names: Object.fromEntries(doc.getMap<string>("names")),
    event: Object.fromEntries(doc.getMap<string>("event")),
  };
}

export function CalendarHistoryDemo() {
  const historyIsPersisted = createHistoryPersistenceCheck();
  const id = createUniqueId();
  const days = eachDayOfInterval(START, END);
  const [userId, setUserId] = createSignal("");
  const [hasConnected, setHasConnected] = createSignal(false);
  const [model, setModel] = createSignal(initialCalendarHistoryState());
  const send = (event: CalendarHistoryEvent) =>
    setModel((state) => transitionCalendarHistory(state, event));
  const connection = () => model().connection.kind;
  const connectionError = () => {
    const connection = model().connection;
    return connection.kind === "offline" ? connection.message : null;
  };
  const updates = () => model().updates;
  const pastVersions = createMemo(() => visibleHistory(model()));
  const selectedClock = () => {
    const timeline = model().timeline;
    return timeline.kind === "present" ? null : timeline.clock;
  };
  const compacted = () => model().timeline.kind === "compacted-past";
  const outsideWindow = () => model().timeline.kind === "outside-window-past";
  const previewUnavailable = () => compacted() || outsideWindow();
  const error = () => model().error;
  const [hovered, setHovered] = createSignal<string | null>(null);
  const [hoveredUser, setHoveredUser] = createSignal<string | null>(null);
  const [pinned, setPinned] = createSignal<ReadonlySet<string>>(new Set());
  const historic = () => model().timeline.kind !== "present";
  const editable = () => calendarIsEditable(model());
  const state = createMemo(() => displayedCalendar(model()));
  const position = () => timelinePosition(model());
  const usersByDate = createMemo(() => {
    const result = new Map<string, string[]>();
    for (const [key, available] of Object.entries(state().availability)) {
      const [user, date] = key.split("〷");
      if (
        !available ||
        !user ||
        !PARTICIPANTS.some((participant) => participant.id === user) ||
        !date ||
        date < START ||
        date > END
      )
        continue;
      result.set(date, [...(result.get(date) ?? []), user]);
    }
    return result;
  });
  const participants = createMemo(() => {
    const counts = new Map<string, number>();
    for (const users of usersByDate().values())
      for (const user of users) counts.set(user, (counts.get(user) ?? 0) + 1);
    return counts;
  });
  const visibleParticipants = () =>
    PARTICIPANTS.filter(
      (participant) =>
        participant.id === userId() || participants().has(participant.id),
    );
  const nameOf = (user: string) =>
    PARTICIPANTS.find((participant) => participant.id === user)?.name || user;
  const usersOn = (date: string) => usersByDate().get(date) ?? [];
  const mine = (date: string) => usersOn(date).includes(userId());
  const emphasis = (date: string) => {
    const users = usersOn(date);
    const hovered = hoveredUser();
    if (hovered && participants().has(hovered))
      return users.includes(hovered) ? "ring" : "faded";
    for (const user of pinned())
      if (participants().has(user) && !users.includes(user)) return "dimmed";
    return "none";
  };

  let doc: Doc | undefined;
  let provider: YPartyKitProvider | undefined;
  let room = BLOG_ROOM;
  let disposed = false;
  let request: AbortController | undefined;
  let historyTimer: ReturnType<typeof setTimeout> | undefined;
  let connectionTimer: ReturnType<typeof setTimeout> | undefined;
  let revision = 0;
  let drag: boolean | null = null;
  let grid!: HTMLDivElement;
  let tooltip!: HTMLSpanElement;
  const endDrag = () => {
    drag = null;
  };

  const scheduleHistory = (attempt = 0, delay = 350) => {
    clearTimeout(historyTimer);
    historyTimer = setTimeout(() => void refreshHistory(attempt), delay);
  };
  const refreshHistory = async (attempt = 0) => {
    if (!doc || disposed) return;
    if (request) {
      return;
    }
    const fetchedRevision = revision;
    const controller = new AbortController();
    request = controller;
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const next = await fetchHistory(SERVER, room, controller.signal);
      if (disposed) return;
      const persisted = historyIsPersisted(next, doc);
      send({ type: "HISTORY_RECEIVED", updates: next });
      if (!persisted && fetchedRevision === revision) {
        if (attempt < 4) scheduleHistory(attempt + 1, 500 * 2 ** attempt);
        else
          send({
            type: "HISTORY_FAILED",
            message:
              "History is still catching up. Your live calendar is unchanged.",
          });
      }
    } catch (error_) {
      if (!disposed)
        send({
          type: "HISTORY_FAILED",
          message:
            error_ instanceof Error && error_.name !== "AbortError"
              ? `Could not load history: ${error_.message}.`
              : "History request timed out.",
        });
    } finally {
      clearTimeout(timeout);
      request = undefined;
      if (!disposed && fetchedRevision !== revision) scheduleHistory();
    }
  };

  const destroyProvider = () => {
    clearTimeout(connectionTimer);
    const previous = provider;
    provider = undefined;
    previous?.destroy();
    previous?.awareness.destroy();
  };
  const disconnect = (message: string) => {
    destroyProvider();
    endDrag();
    send({ type: "DISCONNECTED", message });
  };
  const connect = () => {
    if (!doc || disposed) return;
    destroyProvider();
    send({ type: "CONNECT" });
    try {
      const server = new URL(SERVER);
      const next = new YPartyKitProvider(server.host, room, doc, {
        connect: false,
        disableBc: true,
        protocol: server.protocol === "http:" ? "ws" : "wss",
      });
      provider = next;
      next.awareness.setLocalState(null);
      next.on("sync", (synced: boolean) => {
        if (!synced || disposed || !doc || provider !== next) return;
        clearTimeout(connectionTimer);
        if (doc.getMap("event").size === 0) {
          doc.transact(() => {
            for (const [key, value] of Object.entries({
              id: room,
              name: EVENT_TITLE,
              creator: userId(),
              startDate: START,
              endDate: END,
            }))
              doc!.getMap("event").set(key, value);
            for (const participant of PARTICIPANTS)
              doc!.getMap("names").set(participant.id, participant.name);
          });
        }
        send({ type: "CONNECTED", snapshot: calendarState(doc) });
        setHasConnected(true);
        scheduleHistory();
      });
      next.on("connection-error", () => {
        if (provider === next) disconnect("Could not connect to the calendar.");
      });
      next.on("connection-close", () => {
        if (!disposed && provider === next)
          disconnect("Calendar disconnected. Editing is paused.");
      });
      connectionTimer = setTimeout(
        () => disconnect("Calendar connection timed out."),
        12_000,
      );
      next.connect();
    } catch {
      disconnect("Could not connect to the calendar.");
    }
  };
  const setDate = (date: string, value: boolean) => {
    if (!editable() || !doc) return;
    const map = doc.getMap<boolean>("availability");
    const key = `${userId()}〷${date}`;
    if (!!map.get(key) === value) return;
    if (value) map.set(key, true);
    else map.delete(key);
  };
  const toggle = (date: string) => setDate(date, !mine(date));
  const showPosition = (index: number) => {
    endDrag();
    if (index === pastVersions().length) {
      send({ type: "VIEW_PRESENT" });
      return;
    }
    try {
      const update = pastVersions()[index];
      if (!Number.isInteger(index) || !update)
        throw new RangeError("Invalid history position");
      const next = replayHistory(
        updates(),
        historyWindowStart(model()) + index + 1,
      );
      try {
        send({
          type: "VIEW_PAST",
          clock: update.clock,
          snapshot: calendarState(next),
        });
      } finally {
        next.destroy();
      }
    } catch {
      send({
        type: "PREVIEW_FAILED",
        message:
          "Could not reconstruct this version. Your live calendar is unchanged.",
      });
    }
  };

  onMount(() => {
    const offline = () => disconnect("You’re offline. Editing is paused.");
    const online = () => {
      if (connection() === "offline") connect();
    };
    const moveTooltip = (event: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = Math.min(
        Math.max(event.clientX - rect.left, 16),
        rect.width - 16,
      );
      tooltip.style.transform = `translate3d(calc(${x}px - 50%), ${event.clientY - rect.top - 8}px, 0)`;
    };
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);
    window.addEventListener("blur", endDrag);
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    grid.addEventListener("mousemove", moveTooltip);
    onCleanup(() => {
      disposed = true;
      clearTimeout(historyTimer);
      request?.abort();
      destroyProvider();
      doc?.destroy();
      document.removeEventListener("pointerup", endDrag);
      document.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("blur", endDrag);
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
      grid.removeEventListener("mousemove", moveTooltip);
    });
    try {
      let user = localStorage.getItem(PARTICIPANT_STORAGE_KEY);
      if (!PARTICIPANTS.some((participant) => participant.id === user)) {
        user =
          PARTICIPANTS[Math.floor(Math.random() * PARTICIPANTS.length)]!.id;
        localStorage.setItem(PARTICIPANT_STORAGE_KEY, user);
      }
      setUserId(user!);
      const testRoom = new URLSearchParams(location.search).get("calendarRoom");
      if (
        LOCAL &&
        testRoom &&
        /^blog-y-travelling-technicolor-2077-test-[\w-]+$/.test(testRoom)
      )
        room = testRoom;
      doc = new Doc();
      doc.on("update", () => {
        if (!doc || disposed) return;
        send({ type: "DOCUMENT_CHANGED", snapshot: calendarState(doc) });
        revision++;
        scheduleHistory();
      });
      connect();
    } catch {
      disconnect(
        "Allow browser storage to keep your calendar identity, then reload.",
      );
    }
  });

  return (
    <aside aria-label="Try calendar history" class={styles.aside}>
      <Show when={!hasConnected()}>
        <div
          class="text-sm text-gray-500 dark:text-gray-400"
          classList={{ [styles.connecting!]: true }}
        >
          <p role="status">
            {connection() === "offline"
              ? connectionError()
              : "Connecting to the calendar…"}
          </p>
          <Show when={connection() === "offline"}>
            <button
              class="min-h-11 cursor-pointer underline"
              type="button"
              onClick={connect}
            >
              Reconnect
            </button>
          </Show>
        </div>
      </Show>
      <section
        aria-label="Interactive calendar history demo"
        class="space-y-3"
        classList={{ [styles.content!]: true }}
        data-connected={hasConnected()}
      >
        <div class={CALENDAR_CLASS}>
          <div class="flex h-5 items-center justify-between gap-2">
            <p class="font-mono text-sm text-gray-500 dark:text-gray-400">
              September 2077
            </p>
            <Show when={connection() === "offline"}>
              <button
                aria-label="Reconnect"
                class="flex h-5 cursor-pointer items-center gap-1.5 rounded-sm px-1 font-mono text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                title={connectionError() ?? undefined}
                type="button"
                onClick={connect}
              >
                <span
                  aria-hidden="true"
                  class="size-1.5 shrink-0 rounded-full bg-[#ef4444]"
                />
                reconnect
              </button>
            </Show>
          </div>
          <h3 class="mb-4 text-lg leading-[1.3333]">{EVENT_TITLE}</h3>
          <div class="mt-2 mb-4">
            <div
              class={CALENDAR_GRID_CLASS}
              ref={grid}
              onPointerLeave={() => setHovered(null)}
            >
              <GridCellTooltip
                names={hovered() ? usersOn(hovered()!).map(nameOf) : []}
                ref={tooltip}
              />
              <For each={getWeekDayNames(1)}>
                {(name) => (
                  <div class="flex h-(--cell) items-center justify-center text-[11.6667px] font-medium opacity-75">
                    {name}
                  </div>
                )}
              </For>
              <Index
                each={Array.from({
                  length: getPaddingDays(new Date(START), 1),
                })}
              >
                {() => <div class="h-(--cell)" />}
              </Index>
              <For each={days}>
                {(day, index) => {
                  const date = isoDate(day);
                  return (
                    <AvailabilityGridCell
                      availableUsers={usersOn(date).length}
                      day={day}
                      emphasis={emphasis(date)}
                      isMine={mine(date)}
                      readOnly={!editable()}
                      tabIndex={index() === 0 ? 0 : -1}
                      totalUsers={participants().size}
                      onClick={(event) => {
                        if (event.detail === 0) toggle(date);
                      }}
                      onKeyDown={(event) =>
                        moveFocusWithArrowKeys(event, () => toggle(date))
                      }
                      onPointerDown={(event) => {
                        if (event.button !== 0) return;
                        drag = !mine(date);
                        setDate(date, drag);
                        if (
                          event.currentTarget.hasPointerCapture(event.pointerId)
                        )
                          event.currentTarget.releasePointerCapture(
                            event.pointerId,
                          );
                      }}
                      onPointerEnter={() => {
                        setHovered(date);
                        if (drag !== null) setDate(date, drag);
                      }}
                    />
                  );
                }}
              </For>
            </div>
          </div>
          <div
            class="max-h-44 overflow-x-clip overflow-y-auto font-mono text-sm text-gray-500 dark:text-gray-400"
            onMouseLeave={() => setHoveredUser(null)}
          >
            <For each={visibleParticipants()}>
              {({ id: user }) => (
                <Participant
                  count={participants().get(user) ?? 0}
                  name={`${nameOf(user)}${user === userId() ? " (you)" : ""}`}
                  pinned={pinned().has(user)}
                  onClick={() =>
                    setPinned((previous) => {
                      const next = new Set(previous);
                      if (!next.delete(user)) next.add(user);
                      return next;
                    })
                  }
                  onMouseEnter={() => setHoveredUser(user)}
                />
              )}
            </For>
          </div>
        </div>
        <div class="mx-auto w-[328px] max-w-full text-sm">
          <div class="flex items-center gap-2">
            <button
              aria-label="Previous version"
              class={ARROW_CLASS}
              disabled={
                pastVersions().length === 0 ||
                previewUnavailable() ||
                position() === 0
              }
              type="button"
              onClick={() => showPosition(position() - 1)}
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="m14 6-6 6 6 6" />
              </svg>
            </button>
            <input
              aria-label="Calendar history"
              aria-describedby={`${id}-position`}
              aria-valuetext={
                historic()
                  ? `Storage clock ${selectedClock()}, read-only`
                  : editable()
                    ? "Present, editable"
                    : "Present, read-only"
              }
              class="block h-11 w-full min-w-0 accent-[#05e] dark:accent-[#d7ae64]"
              disabled={pastVersions().length === 0 || previewUnavailable()}
              max="0"
              min="0"
              ref={(input) =>
                createRenderEffect(() => {
                  input.max = String(pastVersions().length);
                  input.value = String(position());
                })
              }
              step="1"
              type="range"
              onInput={(event) =>
                showPosition(Number(event.currentTarget.value))
              }
            />
            <button
              aria-label="Next version"
              class={ARROW_CLASS}
              disabled={!historic()}
              type="button"
              onClick={() =>
                showPosition(
                  previewUnavailable() ? pastVersions().length : position() + 1,
                )
              }
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </div>
          <p
            id={`${id}-position`}
            class="text-center font-mono text-xs text-gray-500 dark:text-gray-400"
            role="status"
          >
            {historic()
              ? `storage clock ${selectedClock()} / read-only`
              : editable()
                ? "present / editable"
                : "present / read-only"}
          </p>
          <Show when={compacted()}>
            <p role="status">
              This version was compacted from storage. Preview kept; use Next to
              return to the present.
            </p>
          </Show>
          <Show when={outsideWindow()}>
            <p role="status">
              This version is outside the last 250 records. Preview kept; use
              Next to return to the present.
            </p>
          </Show>
          <Show
            when={connection() === "connected" && !model().present.event.id}
          >
            <p role="status">This calendar hasn’t been published yet.</p>
          </Show>
          <Show when={error() && connection() !== "offline"}>
            <p role="alert">
              {error()}{" "}
              <button
                class="underline"
                type="button"
                onClick={() => void refreshHistory()}
              >
                Retry history
              </button>
            </p>
          </Show>
        </div>
      </section>
    </aside>
  );
}
