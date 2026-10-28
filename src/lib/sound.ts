import {
  bind,
  type PlayOptions,
  play,
  setEnabled,
  setTheme,
  unlock,
} from "cuelume";

type Input = NonNullable<PlayOptions["input"]>;

const STORAGE_KEY = "sound";
const POINTERS: ReadonlySet<string> = new Set(["mouse", "pen", "touch"]);

let soundOn = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
})();

export const isSoundOn = () => soundOn;

export function setSound(on: boolean) {
  soundOn = on;
  setEnabled(on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Sound still follows `on` until the page reloads.
  }
}

if (typeof window !== "undefined") {
  setTheme("press");
  setEnabled(soundOn);
  bind();
}

/** For controls whose sound depends on state; plain buttons use `data-cuelume-tap`. */
export const tap = (input?: Input) => play("tap", input && { input });

/** What activated `event`, the way cuelume shapes `tap`: a click from Enter or Space reports `detail` 0. */
export function inputOf(event: Event): Input | undefined {
  if (event instanceof KeyboardEvent) return "keyboard";
  if (event.type === "click" && (event as MouseEvent).detail === 0)
    return "keyboard";
  const { pointerType } = event as PointerEvent;
  return POINTERS.has(pointerType) ? (pointerType as Input) : undefined;
}

/** iOS resumes audio only from a click, so controls that play on `pointerdown` call this on click. */
export function unlockSound() {
  if (isSoundOn()) void unlock();
}
