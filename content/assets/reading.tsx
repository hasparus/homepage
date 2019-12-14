export namespace ReadingList {
  export type Author = string;
  export type LinkText = string & { __brand?: "LinkText" };
  export type Link = string & { __brand?: "Link" };
  export type Commentary = string & { __brand?: "Commentary" };
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
    "https://overreacted.io/preparing-for-tech-talk-part-1-motivation/",
    "https://overreacted.io/preparing-for-tech-talk-part-2-what-why-and-how/",
    "https://overreacted.io/preparing-for-tech-talk-part-3-content/",
    "https://overreacted.io/fix-like-no-ones-watching/",
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
      "A quick and fun post about MVP and misconception around it, " +
        "filled with delightful illustrations and real-life examples.",
    ],
  ],
  "Eric Sink": [
    [
      "Act Your Age",
      "https://ericsink.com/Act_Your_Age.html",
      "Short piece in which Eric Sink writes about the chasm between Early Adopters " +
        "and Pragmatists and describes a Pragmatist in Pain, who you need to sponsor " +
        "your product across the chasm.",
    ],
  ],
};

export const futureReading: ReadingList = {
  "Harold Abelson, Gerald Jay Sussman, Julie Sussman": [
    [
      "Structure and Interpretation of Computer Programs",
      "https://books.google.pl/books?id=1DrQngEACAAJ&dq=Structure+and+Interpretation+of+Computer+Programs&hl=en&sa=X&ved=0ahUKEwj-ptHaxLXmAhUEjosKHap9A1oQ6AEIKTAA",
      "I have some bad memories with the last textbook I've read " +
        "(Cormen's Introduction to Algorithms), but I've heard a lot of good " +
        "reviews of SICP. I'm planning to read it in Q1 2020.",
    ],
  ],
};
