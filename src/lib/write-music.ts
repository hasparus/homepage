/**
 * Colors sentences by word count to visualize prose rhythm.
 * After Gary Provost's "write music" tip and wooorm/write-music,
 * rebuilt on Intl.Segmenter and highlighte.rs marker strokes.
 */

const HUES = [60, 60, 60, 300, 300, 0, 0, 120, 120, 120, 120, 120, 120, 180];

let marks: { remove(): void }[] | null = null;

export async function toggleWriteMusic() {
  if (marks) {
    for (const mark of marks) mark.remove();
    marks = null;
    return;
  }
  const { highlight } = await import("@highlighters/core");
  marks = [];

  const words = new Intl.Segmenter("en", { granularity: "word" });

  for (const block of document.querySelectorAll(".zaduma-prose :is(p, li)")) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement?.closest("p, li") === block
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    });

    const texts: { node: Text; start: number }[] = [];
    let text = "";
    for (let node; (node = walker.nextNode() as Text | null);) {
      texts.push({ node, start: text.length });
      text += node.parentElement?.closest("code")
        ? "x".repeat(node.data.length)
        : node.data.replaceAll(/\s/g, " ");
    }

    for (const sentence of splitSentences(text)) {
      const count = [...words.segment(sentence.segment)].filter(
        (w) => w.isWordLike,
      ).length;
      if (!count) continue;

      const start = locate(texts, sentence.index);
      const end = locate(
        texts,
        sentence.index + sentence.segment.trimEnd().length,
      );
      if (!start || !end) continue;

      const range = new Range();
      range.setStart(...start);
      range.setEnd(...end);

      // ponytail: This doesn't react to color mode changes. But it's just an internal tool, so it's fine.
      const dark = document.documentElement.classList.contains("dark");
      const hue = HUES[Math.min(count, HUES.length - 1)]!;
      marks.push(
        highlight(range, {
          color: dark ? `hsl(${hue}deg 70% 55%)` : `hsl(${hue}deg 93% 70%)`,
          vivid: dark ? "screen" : false,
          animation: { draw: false },
          edge: { cap: "round", waviness: 3, roughness: 1, radius: 8 },
          ink: {
            flowFade: 0.85,
          },
          tip: {
            type: "fine",
          },
        }),
      );
    }
  }
}

type Sentence = { index: number; segment: string };

const SENTENCES = new Intl.Segmenter("en", { granularity: "sentence" });

/**
 * Intl.Segmenter breaks sentences after `?`/`.` inside quotes
 * (…asks “which days could work?”, not…) and after abbreviations
 * (Mr. Smith). Such false breaks are merged back into one sentence.
 */
export function splitSentences(text: string): Sentence[] {
  const merged: Sentence[] = [];
  for (const { index, segment } of SENTENCES.segment(text)) {
    const prev = merged.at(-1);
    if (prev && isFalseBreak(prev.segment, segment)) {
      prev.segment += segment;
    } else {
      merged.push({ index, segment });
    }
  }
  return merged;
}

/**
 * A lowercase letter, dash, comma, semicolon, or closing bracket,
 * optionally behind an opening quote, continues the previous sentence.
 */
const CONTINUATION = /^[“”"'‘’([]?[\p{Ll}\p{Pd},;)\]]/u;

/**
 * Abbreviations that take a name or number after the period.
 * ponytail: ones that often end a sentence ("etc.", "Inc.", "Jr.") stay
 * out, since merging those is worse than splitting them.
 */
const ABBREVIATION =
  /(?:^|[\s(])(?:mr|mrs|ms|dr|prof|st|rev|gen|vs|cf|fig|figs|e\.g|i\.e)\.$/i;

function isFalseBreak(before: string, after: string) {
  return (
    CONTINUATION.test(after.trimStart()) || ABBREVIATION.test(before.trimEnd())
  );
}

function locate(
  texts: { node: Text; start: number }[],
  offset: number,
): [Text, number] | undefined {
  for (const { node, start } of texts) {
    if (offset <= start + node.data.length) return [node, offset - start];
  }
  return undefined;
}
