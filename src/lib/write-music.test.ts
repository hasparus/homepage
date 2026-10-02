import assert from "node:assert/strict";
import { test } from "node:test";

import { splitSentences } from "./write-music";

const split = (text: string) =>
  splitSentences(text).map((s) => s.segment.trim());

void test("splits on sentence boundaries", () => {
  assert.deepEqual(split("One two three. Four five."), [
    "One two three.",
    "Four five.",
  ]);
});

void test("does not break after a question mark inside quotes", () => {
  assert.deepEqual(split('She asks "which days could work?", not when.'), [
    'She asks "which days could work?", not when.',
  ]);
});

void test("does not break after an abbreviated title", () => {
  assert.deepEqual(split("Mr. Smith left. Dr. Ross stayed."), [
    "Mr. Smith left.",
    "Dr. Ross stayed.",
  ]);
});

void test("does not break inside e.g. or i.e.", () => {
  assert.deepEqual(split("Pick a day, e.g. Monday. Then tell them."), [
    "Pick a day, e.g. Monday.",
    "Then tell them.",
  ]);
});

void test("still breaks after an abbreviation that ends a sentence", () => {
  assert.deepEqual(split("Bring cats, dogs, etc. Then go home."), [
    "Bring cats, dogs, etc.",
    "Then go home.",
  ]);
});

void test("still breaks after a suffix that ends a sentence", () => {
  assert.deepEqual(split("It was built by Bob Smith Jr. He left."), [
    "It was built by Bob Smith Jr.",
    "He left.",
  ]);
});

void test("keeps offsets pointing into the original text", () => {
  assert.deepEqual(
    splitSentences("Mr. Alpha beta. Gamma.").map((s) => s.index),
    [0, 16],
  );
});
