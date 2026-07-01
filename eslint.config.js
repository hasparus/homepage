import astro from "@hasparus/eslint-config/astro";
import react from "@hasparus/eslint-config/react";
import solid from "@hasparus/eslint-config/solid";

export default [
  { ignores: ["**/*.mdx", "**/*.md", "**/*.gitignored.*"] },

  ...astro,
  ...solid,
  // homepage is Solid-first but keeps React for the three.js bits.
  // TODO(review): both presets currently apply to all **/*.tsx — scope ...react
  // to the React dirs if solid/react rules cross-fire.
  ...react,

  {
    settings: {
      "better-tailwindcss": { entryPoint: "src/global-styles/base.css" },
    },
  },

  {
    rules: { "unicorn/consistent-function-scoping": "off" },
  },
];
