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

- [x] `img.og` added: `src/images/bear-fit/og.png`, rendered from `scripts/og/bear-fit.html` via `node scripts/og/shoot.mjs bear-fit`. Verify on a Vercel preview (og endpoint only runs there).
- [ ] Verify demos at mobile width and with `prefers-reduced-motion`: SwipeDemo, CalendarDemo, `sm:absolute` video in autosave aside (may overlap text on narrow viewports).
- [x] Images resolve (`src/images/bear-fit` follows the deliver convention).

## Open questions

- y-travelling out the same day?
- Are post dates git-derived? First commit is Aug 7.
