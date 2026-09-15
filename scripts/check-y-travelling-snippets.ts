import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHighlighter } from "shiki";
import ts from "typescript";
import astroConfig from "../astro.config";

const notes = readFileSync(resolve("BEAR_FIT_NOTES.md"), "utf8");
const start = "<!-- y-travelling-checked-draft:start -->";
const end = "<!-- y-travelling-checked-draft:end -->";
assert(notes.includes(start) && notes.includes(end), "Checked draft not found");
const draft = notes.split(start)[1]!.split(end)[0]!;
const snippets = [...draft.matchAll(/```(tsx?) twoslash\n([\s\S]*?)\n```/g)];
assert(snippets.length > 0, "No Twoslash snippets found");

function functions(source: string) {
  const file = ts.createSourceFile(
    "snippet.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const printer = ts.createPrinter({ removeComments: true });
  return new Map(
    file.statements
      .filter(ts.isFunctionDeclaration)
      .filter((node) => node.name)
      .map((node) => [
        node.name!.text,
        printer.printNode(ts.EmitHint.Unspecified, node, file),
      ]),
  );
}

const sourceFunctions = functions(
  readFileSync("src/own/bear-fit/history.ts", "utf8"),
);
const copied = new Set([
  "replayHistory",
  "decodeHistoryUpdates",
  "fetchHistory",
]);
const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: ["ts", "tsx"],
});
const { themes, transformers } = astroConfig.markdown!.shikiConfig!;
assert(
  themes && transformers,
  "Expected the site's themed Twoslash configuration",
);
let hoverCount = 0;
try {
  for (const [index, match] of snippets.entries()) {
    const code = match[2]!;
    assert(
      !/@(?:noErrors|errors|noErrorValidation)|@ts-(?:ignore|nocheck)|\bdeclare\b/.test(
        code,
      ),
      `Snippet ${index + 1} suppresses errors or declares unimplemented code`,
    );
    for (const [name, definition] of functions(code)) {
      if (copied.has(name)) {
        assert.equal(
          definition,
          sourceFunctions.get(name),
          `${name} differs from demo source`,
        );
        copied.delete(name);
      }
    }
    const html = highlighter.codeToHtml(code, {
      themes,
      transformers,
      lang: match[1]!,
      meta: { __raw: "twoslash" },
    });
    assert(
      html.includes("twoslash"),
      `Snippet ${index + 1} did not activate Twoslash`,
    );
    const hovers = (html.match(/twoslash-hover/g) ?? []).length;
    assert(hovers > 0, `Snippet ${index + 1} has no type hovers`);
    hoverCount += hovers;
    console.log(`Snippet ${index + 1}: typechecked, ${hovers} hover elements`);
  }
  assert.equal(copied.size, 0, "A source-backed helper is missing");
  console.log(
    `${snippets.length} snippets passed using astro.config.ts; ${hoverCount} hover elements.`,
  );
  console.log("Replay, decoder and fetch ASTs match the actual demo source.");
} finally {
  highlighter.dispose();
}
