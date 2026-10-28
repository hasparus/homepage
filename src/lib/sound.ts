import { type PlayOptions, play, setEnabled, setTheme } from "cuelume";

type Input = NonNullable<PlayOptions["input"]>;

const STORAGE_KEY = "sound";
const POINTERS: ReadonlySet<string> = new Set(["mouse", "pen", "touch"]);

export function isSoundOn() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSound(on: boolean) {
  setEnabled(on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    return true;
  } catch {
    return false;
  }
}

if (typeof window !== "undefined") {
  setTheme("press");
  setEnabled(isSoundOn());
}

/** For controls whose sound depends on state; plain buttons use `data-cuelume-tap`. */
export const tap = (input: Input | undefined) =>
  play("tap", { theme: "press", ...(input && { input }) });

/** What activated `event`, the way cuelume shapes `tap`: a click from Enter or Space reports `detail` 0. */
export function inputOf(event: Event): Input | undefined {
  if (event instanceof KeyboardEvent) return "keyboard";
  if (event.type === "click" && (event as MouseEvent).detail === 0)
    return "keyboard";
  const { pointerType } = event as PointerEvent;
  return POINTERS.has(pointerType) ? (pointerType as Input) : undefined;
}
