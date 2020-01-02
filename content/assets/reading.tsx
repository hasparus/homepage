/** @jsx jsx */
// needed for inlineMdx macro
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mdx as jsx } from "@mdx-js/react";
import { inlineMdx } from "../../src/lib/inlineMdx.macro";

const _ = jsx;

export namespace ReadingList {
  export type Author = string;
  export type LinkText = string & { __brand?: "LinkText" };
  export type Link = string;
  export type Commentary =
    | (string & { __brand?: "Commentary" })
    | React.ComponentType;
  export type Article = Link | [LinkText, Link, Commentary?];
}
export type ReadingList = Record<ReadingList.Author, ReadingList.Article[]>;

export const alreadyRead: ReadingList = {
  "Tomasz Łakomy": ["https://tlakomy.com/who-is-senior-developer/"],
  asthasr: ["https://asthasr.github.io/posts/danger-of-simplicity/"],
  "Justin Meiners": [
    ["Think in Math", "https://justinmeiners.github.io/think-in-math/"],
  ],
  swyx: [
    [
      "Learn in Public",
      "https://www.swyx.io/writing/learn-in-public/",
      "This is lifechanging. I recommend it even to non-developer friends.",
    ],
    "https://www.swyx.io/writing/learning-gears/",
    "https://css-tricks.com/types-or-tests-why-not-both/",
  ],
  "Kevin Mahoney": ["http://kevinmahoney.co.uk/articles/tests-vs-types/"],
  "Scott Wlaschin": [
    [
      "Domain Modeling Made Functional",
      "https://www.youtube.com/watch?v=1pSH8kElmM4",
    ],
  ],
  "Dan Abramov": [
    [
      "Preparing for a Tech Talk, Part 1: Motivation",
      "https://overreacted.io/preparing-for-tech-talk-part-1-motivation/",
    ],
    [
      "Preparing for a Tech Talk, Part 2: What, Why, and How",
      "https://overreacted.io/preparing-for-tech-talk-part-2-what-why-and-how/",
    ],
    [
      "Preparing for a Tech Talk, Part 3: Content",
      "https://overreacted.io/preparing-for-tech-talk-part-3-content/",
      `Need an algorithm to improve your tech talks? This is it.
       It helped me immensely.`,
    ],
    "https://overreacted.io/fix-like-no-ones-watching/",
    [
      "My Decade in Review",
      "https://overreacted.io/my-decade-in-review/",
      `TLDR: Dan started early and worked super hard.
       A humbling and motivating read.`,
    ],
  ],
  "Martin Fowler": ["https://martinfowler.com/bliki/BeckDesignRules.html"],
  "Rich Hickey": [
    ["Simplicity Matters", "https://www.youtube.com/watch?v=rI8tNMsozo0"],
    ["Maybe Not", "https://www.youtube.com/watch?v=YR5WdGrpoug"],
  ],
  "Lars Kappert": ["https://github.com/webpro/programming-principles/"],
  "Henrik Kniberg": [
    [
      "Making sense of MVP and why I prefer Earliest Testable/Usable/Lovable",
      "https://blog.crisp.se/2016/01/25/henrikkniberg/making-sense-of-mvp",
      `MVP and misconceptions around it, filled with delightful illustrations 
       and real-life examples.`,
    ],
  ],
  "Eric Sink": [
    [
      "Act Your Age",
      "https://ericsink.com/Act_Your_Age.html",
      `Eric Sink writes about the chasm between Early Adopters
       and Pragmatists and describes a Pragmatist in Pain
       needed to sponsor your product across this chasm.`,
    ],
  ],
  "Tanya Reilly": [["Being Glue", "https://noidea.dog/#/glue/"]],
  "Joel Hooks": [
    ["Digital Garden", "https://joelhooks.com/digital-garden"],
  ],
  "Amy Hoy": [
    [
      "How the Blogs Broke the Web",
      "https://stackingthebricks.com/how-blogs-broke-the-web/",
    ],
  ],
  "Tom Critchlow": [
    [
      "Building a Digital Garden",
      "https://tomcritchlow.com/2019/02/17/building-digital-garden",
      inlineMdx`
      I encountered this in [Joel Hooks's Digital Garden](https://joelhooks.com/digital-garden).
      
      I love the paragraph about [stock and flow](https://tomcritchlow.com/2019/02/17/building-digital-garden#stock-over-flow).
      The stock — high-quality, long-lasting content — is something I aspire to 
      accumulate here.
      Tim got me hooked on nurturing my own digital garden.
      This page is one way to do it — a reference
      point for conversations with friends. After I write some more articles,
      I'm going to add a table of contents and highlight my favorite work.
      `,
    ],
  ],
};

export const futureReading: ReadingList = {
  "Harold Abelson, Gerald Jay Sussman, Julie Sussman": [
    [
      "Structure and Interpretation of Computer Programs",
      "https://books.google.pl/books?id=1DrQngEACAAJ&dq=Structure+and+Interpretation+of+Computer+Programs&hl=en&sa=X&ved=0ahUKEwj-ptHaxLXmAhUEjosKHap9A1oQ6AEIKTAA",
      inlineMdx`I have some bad memories with the last textbook I've read
        (Cormen's Introduction to Algorithms), but I've heard a lot of good
        reviews of SICP. I'm planning to read it in Q1 2020.`,
    ],
  ],
  "Joel Hooks": [
    [
      "Stop Giving af and Start Writing More",
      "https://joelhooks.com/on-writing-more",
    ],
    [
      "Badass: Making Users Awesome by Kathy Sierra",
      "https://joelhooks.com/badass-making-users-awesome-by-kathy-sierra",
    ],
  ],
};
