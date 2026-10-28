/** A collaborator's cursor travels to a date, presses, and marks it. `held` keeps the button down. */
export interface Step<TDate> {
  date: TDate;
  held?: boolean;
  travel: number;
}

export const CURSOR_EASE = [0.77, 0, 0.175, 1] as const;
export const TAILWIND_EASE_OUT = [0, 0, 0.2, 1] as const;
export const FADE = 150;

/** Where the cursor starts before gliding to its first date, in rem from that date. */
export const ENTER_OFFSET = { x: -2.5, y: 5 };

const SHOW = 500;
const PRESS = 120;
const SETTLE = 180;
const LINGER = 900;
const REST = 2600;
const CLEAR = 700;

/** One pass of a collaborator's cursor, in milliseconds from when the cursor is placed. */
export function compileTimeline<TDate>(steps: readonly Step<TDate>[]) {
  const moves: {
    from: TDate | undefined;
    start: number;
    to: TDate;
    travel: number;
  }[] = [];
  const presses: [down: number, up: number][] = [];
  const marks: { at: number; date: TDate }[] = [];

  let now = SHOW;
  let downAt: number | undefined;
  for (const [i, step] of steps.entries()) {
    moves.push({
      from: steps[i - 1]?.date,
      start: now,
      to: step.date,
      travel: step.travel,
    });
    now += step.travel;
    downAt ??= now;
    marks.push({ at: now, date: step.date });
    if (!steps[i + 1]?.held) {
      presses.push([downAt, now + PRESS]);
      downAt = undefined;
      now += PRESS + SETTLE;
    }
  }

  const settledAt = now;
  const hideAt = settledAt + LINGER;
  const clearAt = hideAt + REST;
  return {
    clearAt,
    end: clearAt + CLEAR,
    hideAt,
    marks,
    moves,
    presses,
    settledAt,
    showAt: SHOW,
  };
}

/** CSS `cubic-bezier()` as a function, for scenes that compute frames instead of transitioning. */
export function cubicBezier([x1, y1, x2, y2]: readonly [
  number,
  number,
  number,
  number,
]) {
  const curve = (a: number, b: number, t: number) =>
    3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;
  return (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 32; i++) {
      const t = (lo + hi) / 2;
      if (curve(x1, x2, t) < x) lo = t;
      else hi = t;
    }
    return curve(y1, y2, (lo + hi) / 2);
  };
}
