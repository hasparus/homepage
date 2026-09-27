import astro from "@hasparus/eslint-config/astro";
import react from "@hasparus/eslint-config/react";
import solid from "@hasparus/eslint-config/solid";

export default [
  {
    ignores: [
      "**/*.mdx",
      "**/*.md",
      "**/*.gitignored.*",
      "**/.generated/**",
    ],
  },

  ...astro,
  // homepage is Solid-first but keeps React for the three.js bits (*.react.tsx).
  // Solid rules skip the React files; React rules apply only to them, so the two
  // presets stop cross-firing.
  ...solid.map((config) => ({
    ...config,
    ignores: [...(config.ignores ?? []), "**/*.react.tsx"],
  })),
  ...react.map((config) => ({
    ...config,
    files: ["**/*.react.tsx"],
  })),

  {
    settings: {
      "better-tailwindcss": { entryPoint: "src/global-styles/base.css" },
    },
  },

  {
    rules: {
      "unicorn/consistent-function-scoping": "off",
      // Prettier lowercases hex literals, so the rule's uppercase default
      // and the formatter overwrite each other's fixes.
      "unicorn/number-literal-case": [
        "error",
        { hexadecimalValue: "lowercase" },
      ],
    },
  },

  {
    // Command-line benchmark runners; their output is the console.
    files: ["src/own/bear-fit/yjs-history-benchmarks/*.mjs"],
    rules: { "no-console": "off" },
  },
];
