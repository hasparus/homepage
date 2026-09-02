# bear-fit post: what's left

Content ~90% there. Missing a landing, not material. Placeholders in the file: `TODO` before the closing rule, "I'm probably missing something here" after it.

## Must fix

- [ ] **Ending doesn't land.** Last section closes on "simple doesn't always have to mean familiar or immediately legible", complicating the thesis, then stops and restates the tldr. The tldr's "which days, not which 30-minute slots" is the actual insight but only appears in a subordinate clause in "Eating complexity" and the crab.fit rant. Give it its own moment near the end. Bookend option: the 2014 swipe idea was still asking the wrong question (time slots); took six years to notice days are the right unit.
- [ ] **Title vs body.** "syncing humans" never appears or gets earned. Use the framing in the ending or retitle.
- [ ] **y-travelling dependency.** Last line links `/y-travelling`, which is a branch-only draft. Ship together or cut the link.

## Should fix

- [ ] **Lo-fi section drifts.** Patchwork / Playbit / Cloudflare paragraph doesn't return to bear-fit. Cut or reduce to a clause.
- [ ] **"Contrary to Elon Musk's philosophy"** is unexplained.
- [ ] **Click counting loose.** "Three clicks: choose start, choose end, press Enter" counts a keypress as a click right after defining simplicity as click count.
- [ ] **Cal.com** is a category mismatch (1:1 booking vs group availability). Justify or drop.
- [ ] **"Innovation token"** is about tech choices, applied here to UX novelty. Only works if reader knows the essay.
- [ ] **Normie section tone.** Reread for condescension; those friends are the audience in the screenshots.
- [x] **Spotify embed** ("Use Me", Bill Withers) lands after "Tools are to be _used_". Needs a `title` attr on the iframe for screen readers and agents, optionally a figcaption fallback for blocked embeds.

## Ship checklist

- [x] `img.og` added: `src/images/bear-fit/og.png` (2400×1260), rendered at 2x (2400x1260) from `scripts/og/bear-fit.html` via `node scripts/og/shoot.mjs bear-fit`. Uses bear-fit's dialog, dot grid, and Czikago font from the `aux/bear-fit` submodule. Uses bear-fit chrome, Czikago, cursor-party arrow from the `aux/bear-fit` submodule. Verify on a Vercel preview (og endpoint only runs there).
- [ ] Verify demos at mobile width and with `prefers-reduced-motion`: SwipeDemo, CalendarDemo, `sm:absolute` video in autosave aside (may overlap text on narrow viewports).
- [x] Images resolve (`src/images/bear-fit` follows the deliver convention).

## Open questions

- y-travelling out the same day?
- Are post dates git-derived? First commit is Aug 7.

## Ending ideas

The last real beat is "Simple doesn't always have to mean familiar or immediately legible." Everything after it is a placeholder. Three ways to land, roughly in order of how much I like them.

### A. Sync at low resolution (ties the title)

Syncing humans is a consistency problem. Every calendar tool tries to solve it at hourly resolution and fails, because people don't know their Tuesdays three weeks out. bear-fit drops the resolution to a day, and at that resolution the sync gets trivial. Y.js does the rest. The move is one paragraph: name the title's metaphor out loud, say the product decision was resolution, not features, and stop. The "20 AI agents" line can survive as the last sentence.

Why this one: it makes the tldr's "which days, not which slots" claim the thesis instead of a subordinate clause, and it explains why the alternatives lose without another Doodle jab.

### B. Bookend with the swipe app

Go back to 2014. The swipe prototype had the same goal and the same set intersection idea. What it got wrong was the unit: it asked people to swipe time slots, so it needed everyone's hourly future and would have died the way crab.fit dies for you. It took six years to notice that the unit was the bug. Close on that. Shorter than A and lands harder emotionally, but it doesn't touch "syncing humans" unless you add one sentence.

Could combine with A: the resolution insight is what the 2014 version was missing.

### C. Adopt vs use, revisited

Return to "you can adopt a cat, tools are to be used." Autosave was surprising precisely because it asks nothing. The ending would say the goal was software that never needs adopting, and that surprise is the cost of not asking. Weakest of the three: it repeats a point the post already made and leaves the title unearned.

### What to cut regardless

The "I'm probably missing something here" rule-separated paragraph should merge into whichever ending wins. Two closing rules plus a link to the next post is one rule too many.
