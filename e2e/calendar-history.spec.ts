import { randomUUID } from "node:crypto";
import {
  expect,
  test,
  type BrowserContext,
  type Locator,
  type Page,
} from "@playwright/test";
import { fetchHistory, replayHistory } from "../src/own/bear-fit/history";

const demoUrl = process.env.HISTORY_DEMO_URL;
const server = "http://127.0.0.1:1999";
const storageKey = "bear-fit:blog-y-travelling-technicolor-2077:participant";
const ids = [
  "blog-reader-barney",
  "blog-reader-slithey",
  "blog-reader-ruf",
  "blog-reader-ottar",
];
const region = (page: Page) =>
  page.getByRole("region", { name: "Interactive calendar history demo" });
const day = (page: Page, date = 6) =>
  region(page).getByRole("button", {
    name: new RegExp(`September ${date}, 2077$`),
  });
const slider = (page: Page) =>
  region(page).getByRole("slider", { name: "Calendar history" });

function roomUrl(room: string) {
  const url = new URL(demoUrl!);
  if (!["localhost", "127.0.0.1"].includes(url.hostname))
    throw new Error("Mutation tests require a local homepage server");
  url.searchParams.set("calendarRoom", room);
  return url.href;
}

async function prepare(context: BrowserContext, participant?: string) {
  await context.routeWebSocket("**/parties/main/**", (socket) => {
    const url = new URL(socket.url());
    expect(url.hostname, "Never mutate the production shared room").toBe(
      "127.0.0.1",
    );
    expect(url.port).toBe("1999");
    expect(url.pathname).toMatch(/\/blog-y-travelling-technicolor-2077-test-/);
    socket.connectToServer();
  });
  if (participant)
    await context.addInitScript(
      ({ storageKey, participant }) => {
        if (!localStorage.getItem(storageKey))
          localStorage.setItem(storageKey, participant);
        localStorage.setItem("userId", "canonical-user-must-not-change");
      },
      { storageKey, participant },
    );
}

async function open(page: Page, room: string) {
  await page.goto(roomUrl(room));
  await region(page).scrollIntoViewIfNeeded();
  await expect(day(page)).toBeEnabled({ timeout: 15_000 });
}

async function stored(room: string, key: string, value: boolean | undefined) {
  await expect(async () => {
    const updates = await fetchHistory(server, room, AbortSignal.timeout(5000));
    const doc = replayHistory(updates, updates.length);
    try {
      expect(doc.getMap("availability").get(key)).toBe(value);
    } finally {
      doc.destroy();
    }
  }).toPass({ timeout: 15_000, intervals: [100, 300, 1000] });
}

async function gapMeasurements(button: Locator) {
  return button.evaluate((element) => {
    const parent = element.parentElement!;
    const cells = [...parent.querySelectorAll("button")];
    const a = cells[0]!.getBoundingClientRect();
    const b = cells[1]!.getBoundingClientRect();
    const c = cells[7]!.getBoundingClientRect();
    return {
      horizontal: b.left - a.right,
      vertical: c.top - a.bottom,
      columns: getComputedStyle(parent).gridTemplateColumns.split(" ").length,
    };
  });
}

test("four shared identities, separate marks, stable previews and reload persistence", async ({
  browser,
}, testInfo) => {
  test.skip(!demoUrl, "Set HISTORY_DEMO_URL to the local-backend homepage");
  const room = `blog-y-travelling-technicolor-2077-test-${randomUUID()}`;
  const contexts = await Promise.all(
    [ids[0], ids[1], ids[0]].map(async (participant) => {
      const context = await browser.newContext({
        viewport: testInfo.project.use.viewport,
        reducedMotion: "reduce",
      });
      await prepare(context, participant);
      return context;
    }),
  );
  try {
    const [a, b, same] = await Promise.all(
      contexts.map((context) => context.newPage()),
    );
    const errors: string[] = [];
    for (const page of [a!, b!, same!])
      page.on("pageerror", (error) => errors.push(error.message));
    await open(a!, room);
    await open(b!, room);
    await open(same!, room);
    const people = region(a!).getByRole("button", {
      name: /(?:Barney|Slithey|Ruf|Ottar).*\d dates?/,
    });
    await expect(people).toHaveCount(1);
    await expect(
      region(a!).getByRole("button", {
        name: "Barney (you) 0 dates",
        exact: true,
      }),
    ).toBeVisible();
    await day(a!).click();
    await expect(day(a!)).toHaveAttribute("aria-pressed", "true");
    await expect(day(same!)).toHaveAttribute("aria-pressed", "true");
    await expect(day(b!)).toHaveAttribute("aria-pressed", "false");
    await expect(people).toHaveCount(1);
    await expect(day(b!)).toHaveAttribute("style", /\/ 1\)/);
    await day(b!).click();
    await expect(people).toHaveCount(2);
    await expect(day(a!)).toHaveAttribute("style", /\/ 1\)/);
    for (const [index, participant] of ids.slice(2).entries()) {
      const context = await browser.newContext();
      contexts.push(context);
      await prepare(context, participant);
      const extra = await context.newPage();
      await open(extra, room);
      await day(extra, 9 + index).click();
      await expect(people).toHaveCount(3 + index);
      await expect(day(a!)).toHaveAttribute(
        "style",
        index === 0 ? /\/ 0\.6666666666666666\)/ : /\/ 0\.5\)/,
      );
      await expect(day(a!, 9 + index)).toHaveAttribute(
        "style",
        index === 0 ? /\/ 0\.3333333333333333\)/ : /\/ 0\.25\)/,
      );
    }
    await region(a!)
      .getByRole("button", { name: "Ruf 1 date", exact: true })
      .click();
    for (const [index, context] of contexts.slice(3).entries()) {
      await day(context.pages()[0]!, 9 + index).click();
    }
    await expect(people).toHaveCount(2);
    await expect(region(a!).getByRole("button", { name: /^Ruf / })).toHaveCount(
      0,
    );
    await expect(day(a!)).toHaveCSS("filter", "none");
    await expect(day(a!)).toHaveAttribute("style", /\/ 1\)/);
    await day(a!).hover();
    await expect(region(a!).getByRole("tooltip")).toContainText("Barney");
    await expect(region(a!).getByRole("tooltip")).toContainText("Slithey");
    await region(a!)
      .getByRole("button", { name: "Slithey 1 date", exact: true })
      .click();
    await expect(
      region(a!).getByRole("button", { name: /Slithey 1 date$/ }),
    ).toHaveAttribute("aria-pressed", "true");
    await day(a!).press("ArrowRight");
    await expect(day(a!, 7)).toBeFocused();
    await day(a!, 7).press("Space");
    await stored(room, `${ids[0]}〷2077-09-07`, true);
    await stored(room, `${ids[1]}〷2077-09-06`, true);
    await expect(slider(a!)).toBeEnabled();
    await expect
      .poll(async () => Number(await slider(a!).getAttribute("max")))
      .toBeGreaterThan(1);
    await slider(a!).press("Home");
    await expect(day(a!)).toBeDisabled();
    await expect(people).toHaveCount(1);
    await expect(
      region(a!).getByRole("button", {
        name: "Barney (you) 0 dates",
        exact: true,
      }),
    ).toBeVisible();
    const clock = await slider(a!).getAttribute("aria-valuetext");
    const preview = await day(a!).getAttribute("aria-pressed");
    await day(a!).press("Space");
    await expect(day(a!)).toHaveAttribute("aria-pressed", preview!);
    const oldMax = Number(await slider(a!).getAttribute("max"));
    await day(b!, 8).click();
    await stored(room, `${ids[1]}〷2077-09-08`, true);
    await expect
      .poll(async () => Number(await slider(a!).getAttribute("max")))
      .toBeGreaterThan(oldMax);
    await expect(slider(a!)).toHaveAttribute("aria-valuetext", clock!);
    await expect(day(a!, 8)).toHaveAttribute("aria-pressed", "false");
    await region(a!).screenshot({
      path: testInfo.outputPath("history-preview.png"),
    });
    await slider(a!).press("End");
    await expect(day(a!)).toBeEnabled();
    await expect(day(a!)).toHaveAttribute("aria-pressed", "true");
    await expect(day(a!, 7)).toHaveAttribute("aria-pressed", "true");
    await expect(
      region(a!).getByRole("button", { name: /Slithey 2 dates$/ }),
    ).toBeVisible();
    await expect(
      region(a!).getByRole("button", { name: "Previous version" }),
    ).toHaveCSS("cursor", "pointer");
    await region(a!).getByRole("button", { name: "Previous version" }).click();
    await expect(day(a!)).toBeDisabled();
    await region(a!).getByRole("button", { name: "Next version" }).click();
    await expect(day(a!)).toBeEnabled();
    await day(same!).click();
    await expect(day(a!)).toHaveAttribute("aria-pressed", "false");
    await expect(day(b!)).toHaveAttribute("aria-pressed", "true");
    await expect(day(a!)).toHaveAttribute("style", /\/ 0\.5\)/);
    await stored(room, `${ids[0]}〷2077-09-06`, undefined);
    await a!.reload();
    await region(a!).scrollIntoViewIfNeeded();
    await expect(day(a!)).toBeEnabled();
    expect(
      await a!.evaluate((key) => localStorage.getItem(key), storageKey),
    ).toBe(ids[0]);
    expect(await a!.evaluate(() => localStorage.getItem("userId"))).toBe(
      "canonical-user-must-not-change",
    );
    await expect(day(a!, 7)).toHaveAttribute("aria-pressed", "true");
    await expect(day(a!)).toHaveAttribute("aria-pressed", "false");
    await expect(
      region(a!).getByRole("heading", { name: "shooting a viking movie" }),
    ).toBeVisible();
    const gaps = await gapMeasurements(day(a!));
    expect(gaps.columns).toBe(7);
    expect(gaps.horizontal).toBeCloseTo(4, 1);
    expect(gaps.vertical).toBeCloseTo(4, 1);
    await expect(slider(a!)).toBeEnabled();
    await expect(slider(a!)).toHaveValue(
      (await slider(a!).getAttribute("max"))!,
    );
    await expect(
      region(a!).getByText(/^present\b/i),
    ).toBeVisible();
    await expect(slider(a!)).toHaveAttribute(
      "aria-valuetext",
      "Present, editable",
    );
    await region(a!).screenshot({
      path: testInfo.outputPath("history-live.png"),
    });
    expect(errors).toEqual([]);
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});

test("random assignment persists, touch works, errors and compaction preserve preview", async ({
  browser,
}, testInfo) => {
  test.skip(
    !demoUrl || testInfo.project.name !== "mobile",
    "Explicit local mobile check",
  );
  const room = `blog-y-travelling-technicolor-2077-test-${randomUUID()}`;
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 320, height: 740 },
    reducedMotion: "reduce",
  });
  await prepare(context);
  try {
    const page = await context.newPage();
    await open(page, room);
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    const assigned = await page.evaluate(
      (key) => localStorage.getItem(key),
      storageKey,
    );
    expect(ids).toContain(assigned);
    expect(
      await page.evaluate(() => localStorage.getItem("userId")),
    ).toBeNull();
    await day(page).tap();
    await expect(day(page)).toHaveAttribute("aria-pressed", "true");
    await stored(room, `${assigned}〷2077-09-06`, true);
    await page.reload();
    await region(page).scrollIntoViewIfNeeded();
    await expect(day(page)).toBeEnabled();
    expect(
      await page.evaluate((key) => localStorage.getItem(key), storageKey),
    ).toBe(assigned);
    await expect(day(page)).toHaveAttribute("aria-pressed", "true");
    await expect(slider(page)).toBeEnabled();
    const range = (await slider(page).boundingBox())!;
    await slider(page).tap({ position: { x: 4, y: range.height / 2 } });
    await expect(day(page)).toBeDisabled();
    await slider(page).press("End");
    await expect(day(page)).toBeEnabled();
    await region(page).getByRole("button", { name: "Previous version" }).tap();
    await expect(day(page)).toBeDisabled();
    await slider(page).press("End");
    await expect(day(page)).toBeEnabled();
    await page.route("**/history", (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await day(page, 7).tap();
    await expect(region(page).getByRole("alert")).toContainText("503");
    await expect(day(page, 7)).toHaveAttribute("aria-pressed", "true");
    await page.unroute("**/history");
    await page.route("**/history", (route) =>
      route.fulfill({ status: 200, body: "bad" }),
    );
    await region(page).getByRole("button", { name: "Retry history" }).tap();
    await expect(region(page).getByRole("alert")).toContainText(
      "truncated record header",
    );
    await page.unroute("**/history");
    await region(page).getByRole("button", { name: "Retry history" }).tap();
    await expect(region(page).getByRole("alert")).toHaveCount(0);
    await stored(room, `${assigned}〷2077-09-07`, true);
    await slider(page).press("Home");
    const preview = await day(page).getAttribute("aria-pressed");
    await page.route("**/history", (route) =>
      route.fulfill({ status: 200, body: "" }),
    );
    await context.setOffline(true);
    await expect(
      region(page).getByRole("button", { name: "Reconnect" }),
    ).toBeVisible();
    await context.setOffline(false);
    await expect(region(page).getByText(/Preview kept/)).toBeVisible();
    await expect(day(page)).toHaveAttribute("aria-pressed", preview!);
    await expect(slider(page)).toBeDisabled();
    await region(page).getByRole("button", { name: "Next version" }).tap();
    await expect(day(page, 7)).toHaveAttribute("aria-pressed", "true");
    await expect(day(page)).toBeEnabled();
    await page.unroute("**/history");
    const gaps = await gapMeasurements(day(page));
    expect(gaps.horizontal).toBeCloseTo(4, 1);
    expect(gaps.vertical).toBeCloseTo(4, 1);
    expect(gaps.columns).toBe(7);
    expect((await region(page).boundingBox())!.width).toBeLessThanOrEqual(320);
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await region(page).screenshot({
      path: testInfo.outputPath("history-dark-touch-320.png"),
    });
  } finally {
    await context.close();
  }
});

test("the original calendar retains equal gaps and does not load history dependencies", async ({
  page,
}, testInfo) => {
  test.skip(!demoUrl, "Requires a selected homepage server");
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(new URL("/bear-fit", demoUrl!).href);
  const first = page.getByRole("button", {
    name: "Wednesday, September 4, 2024",
  });
  await first.scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Kasia 5 dates" }),
  ).toBeVisible();
  await first.click();
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await first.press("ArrowRight");
  const second = page.getByRole("button", {
    name: "Thursday, September 5, 2024",
  });
  await expect(second).toBeFocused();
  await second.press("Space");
  await expect(second).toHaveAttribute("aria-pressed", "true");
  const participant = page.getByRole("button", { name: "Wojtek 7 dates" });
  await participant.click();
  await expect(participant).toHaveAttribute("aria-pressed", "true");
  expect(
    scripts.some((url) => /CalendarHistoryDemo|y-partykit|yjs/.test(url)),
  ).toBe(false);
  if (testInfo.project.name === "mobile")
    await page.setViewportSize({ width: 320, height: 740 });
  const gaps = await gapMeasurements(first);
  expect(gaps.columns).toBe(7);
  expect(gaps.horizontal).toBeCloseTo(4, 1);
  expect(gaps.vertical).toBeCloseTo(4, 1);
});
