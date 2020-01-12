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
  export type Tags = string[];
  export type Article = Link | [LinkText, Link, Commentary?, Tags?];
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
      inlineMdx`
        Need an algorithm to improve your tech talks? This is it.

        It helped me immensely.`,
    ],
    "https://overreacted.io/fix-like-no-ones-watching/",
    [
      "My Decade in Review",
      "https://overreacted.io/my-decade-in-review/",
      `Dan started early and worked super hard.
       A humbling and motivating read.`,
    ],
    [
      "TODO comments Twitter thread",
      "https://twitter.com/dan_abramov/status/1215838693518430210",
      inlineMdx`
          > TODO doesn’t mean you actually intend to do something.
            It’s a marker for the next person that the logic was
            left unfinished...

          TODO comments are good.

          I believe that honesty is the essential quality of a software engineer.
          Whenever I have a vague idea of how to fix/improve something but no
          time to do it, I'll leave a todo. Whenever I do a hack, I'll admit it
          in the comment, explain why it's bad and what problems we should expect.

          It wasn't obvious to me when I learned to program.
          "My code doesn't need comments." -- I thought.
          Clean code is final. It is supposed to be beautiful, almost perfect, right?
          It grew on me with time, while working with deadlines, clients,
          project managers, and legacy code.
          
          Code Review comments perish. They have to be searched for.
          They can be lost while migrating between version control systems
          or VCS hosting services. Conversations on Slack or JIRA tickets are
          even more ephemeral. TODO comments are immortal. The memory of them
          will survive in your git history.
      `,
    ],
    ["Goodbye, Clean Code", "https://overreacted.io/goodbye-clean-code/"],
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
  "Kent C. Dodds": [
    ["Colocation", "https://kentcdodds.com/blog/colocation"],
    ["AHA Programming", "https://kentcdodds.com/blog/aha-programming"],
  ],
  "John Otander": [
    [
      "JSX as a design tool data structure",
      "https://johno.com/jsx-as-a-design-tool-data-structure",
      undefined,
      ["styling"],
    ],
    ["Styling themes", "johno.com/styling-themes", undefined, ["styling"]],
  ],
  "Brent Jackson": [
    [
      "The Three Tenets of Styled System",
      "https://jxnblk.com/blog/the-three-tenets-of-styled-system/",
      undefined,
      ["styling"],
    ],
    [
      "Iterations on a Theme",
      "https://jxnblk.com/blog/iterations-on-a-theme/",
      undefined,
      ["styling"],
    ],
    [
      "Themeability",
      "https://jxnblk.com/blog/themeability/",
      undefined,
      ["styling"],
    ],
    [
      "Interoperability",
      "https://jxnblk.com/blog/interoperability/",
      undefined,
      ["styling"],
    ],
  ],
  "Vyacheslav Egorov": [
    [
      "Shaky diagramming",
      "https://mrale.ph/blog/2012/11/25/shaky-diagramming.html",
      "This is 🔥.",
    ],
    [
      "How the Grinch stole array.length access",
      "https://mrale.ph/blog/2014/12/24/array-length-caching.html",
      inlineMdx`
        mraleph has a lot of good pieces on V8 and JS optimization.
        This is one of them.
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
