import { expect, test } from "@playwright/test";

import {
  compileTimeline,
  CURSOR_EASE,
  cubicBezier,
  TAILWIND_EASE_OUT,
} from "../src/own/bear-fit/choreography";

test("compileTimeline keeps the button down through held steps", () => {
  const timeline = compileTimeline([
    { date: "a", travel: 100 },
    { date: "b", held: true, travel: 50 },
    { date: "c", travel: 200 },
  ]);
  expect(
    timeline.moves.map(({ from, start, to }) => [from, to, start]),
  ).toEqual([
    [undefined, "a", 500],
    ["a", "b", 600],
    ["b", "c", 950],
  ]);
  expect(timeline.presses).toEqual([
    [600, 770],
    [1150, 1270],
  ]);
  expect(timeline.marks.map(({ at }) => at)).toEqual([600, 650, 1150]);
  expect(timeline).toMatchObject({
    clearAt: 4950,
    end: 5650,
    hideAt: 2350,
    settledAt: 1450,
  });
});

test("cubicBezier matches the browser's cubic-bezier()", async ({ page }) => {
  for (const curve of [CURSOR_EASE, TAILWIND_EASE_OUT]) {
    const ease = cubicBezier(curve);
    for (const x of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const browser = await page.evaluate(
        ([curve, x]) => {
          const animation = document.documentElement.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 1000, easing: `cubic-bezier(${curve})` },
          );
          animation.pause();
          animation.currentTime = x * 1000;
          return Number(getComputedStyle(document.documentElement).opacity);
        },
        [curve, x] as const,
      );
      expect(ease(x)).toBeCloseTo(browser, 3);
    }
  }
});
